<template>
  <q-input
    :type="type"
    :model-value="modelValue"
    rounded
    standout="standout-class"
    :autogrow="false"
    color="primary"
    :class="{ 'q-input': true, high: isHigh, 'disabled-style': isDisabled, 'has-voice': hasVoice }"
    :disable="isDisabled"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <template v-slot:append>
      <q-btn
        v-if="hasVoice"
        style="
          align-self: end;
          justify-self: end;
          color: white;
          position: absolute;
          right: 10px;
          top: 10px;
        "
        round
        flat
        :disable="loading"
        class="q-mr-sm q-mb-md"
        @click.stop="toggleRecording"
      >
        <q-spinner v-if="loading" color="white" size="20px" />
        <img v-else-if="!isRecording" :src="micIcon" />
        <q-icon v-else name="stop_circle" />
      </q-btn>
      <slot name="append" />
    </template>
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, ref, toRefs } from 'vue'
import micIcon from '../assets/icons/micro.svg'
import AudioRecorder from 'audio-recorder-polyfill' // ← polyfill
import mpegEncoder from 'audio-recorder-polyfill/mpeg-encoder'
import useContent from 'src/api/composables/useContent'

AudioRecorder.encoder = mpegEncoder // comment out for WAV
AudioRecorder.prototype.mimeType = 'audio/mpeg'
/* Safari / Edge need the polyfill, but you can force-enable it everywhere
   to always get MP3 blobs. */
window.MediaRecorder = AudioRecorder as any

const { apiTranscribe } = useContent()

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined
    isHigh?: boolean
    isWide?: boolean
    label?: string
    hasVoice?: boolean
    type?: string
    isDisabled?: boolean
  }>(),
  { type: 'textarea' },
)
const { modelValue } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

/* ---------- recorder state ---------- */
const isRecording = ref(false)
const loading = ref(false)
let mediaStream: MediaStream | null = null
let mediaChunks: BlobPart[] = []
let recorder: MediaRecorder | null = null

/* ---------- toggle mic ---------- */
async function toggleRecording() {
  try {
    if (!isRecording.value) {
      // ── start ──
      if (!mediaStream) {
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      }
      recorder = new MediaRecorder(mediaStream!)
      mediaChunks = []

      recorder.addEventListener('dataavailable', (e) => mediaChunks.push(e.data))
      recorder.addEventListener('stop', onStop)

      recorder.start() // you can pass a timeslice if you want chunks
      isRecording.value = true
    } else {
      // ── stop ──
      recorder?.stop()
    }
  } catch (err) {
    console.error('Mic error:', err)
    isRecording.value = false
  }
}

/* ---------- blob handler ---------- */
function onStop() {
  const blob = new Blob(mediaChunks, { type: recorder?.mimeType })
  handleRecordedAudio(blob) // ← PUT your backend call here
  isRecording.value = false

  // free HW if you don’t plan to keep recording again
  mediaStream?.getTracks().forEach((t) => t.stop())
  mediaStream = null
}

/* You work here */
function handleRecordedAudio(blob: Blob) {
  const file = new File([blob], 'voice.mp3', { type: blob.type })
  loading.value = true
  apiTranscribe(file)
    .then((response) => {
      console.log('Transcription response:', response)
      const text = response.text
      emit('update:modelValue', text)
    })
    .catch((error) => {
      console.error('Transcription error:', error)
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  const ua = navigator.userAgent
  // Check for iOS device and Safari (excluding Chrome on iOS)
  if (/iP(ad|hone|od)/.test(ua) && /Safari/.test(ua) && !/CriOS/.test(ua)) {
    document.documentElement.classList.add('ios-safari')
  }
})
</script>

<style lang="scss" scoped>
.q-input ::v-deep .q-field.high {
  height: -webkit-fill-available !important;
}
.q-input ::v-deep .q-field__control {
  height: -webkit-fill-available !important;
}

.ios-safari .q-input ::v-deep .q-field__control {
  /* Adjust height for iOS Safari */
  height: auto !important;
}

.q-input ::v-deep .q-field__control {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px !important;
}
.disabled-style ::v-deep .q-field__control {
  background-color: transparent !important;
  border: 1px solid rgba(107, 114, 128, 0.5);
}

.q-input ::v-deep .q-field__native {
  resize: none !important;
  color: white !important;
}

.has-voice ::v-deep .q-field__native {
  padding-right: 30px;
}

.q-input ::v-deep .standout-class {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 1);
}
</style>

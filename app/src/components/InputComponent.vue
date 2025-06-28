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
        class="q-mr-sm q-mb-md"
      >
        <img :src="micIcon" />
      </q-btn>
      <slot name="append" />
    </template>
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { onMounted, toRefs } from 'vue'
import micIcon from '../assets/icons/micro.svg'

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

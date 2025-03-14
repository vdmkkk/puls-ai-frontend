<template>
  <q-editor
    ref="editorRef"
    :type="type"
    v-model="editorContent"
    :toolbar="[
      ['bold', 'italic', 'underline'],
      [
        {
          label: $q.lang.editor.formatting,
          icon: $q.iconSet.editor.formatting,
          list: 'no-icons',
          options: ['h1', 'h2', 'h3', 'h4', 'h5', 'code', 'p'],
        },
      ],
      ['copy'],
    ]"
    rounded
    :autogrow="false"
    :class="{ 'q-input': true, high: isHigh, 'disabled-style': isDisabled }"
    :disable="isDisabled"
    @update:model-value="handleUpdate"
  >
    <template v-slot:copy>
      <q-btn size="xs" flat round @click="handleCopy">
        <img class="copy" :src="copy" />
      </q-btn>
    </template>
  </q-editor>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted, watch } from 'vue'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'
import copy from 'src/assets/icons/copy.svg'

// Define props and defaults
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
const { modelValue, isHigh, isDisabled, type } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

// Create conversion instances
const md = new MarkdownIt()
const turndownService = new TurndownService()

// We'll keep the editor's content as HTML in a separate reactive variable
const editorContent = ref('')

// Initialize the editor content based on the incoming markdown
onMounted(() => {
  editorContent.value = modelValue.value ? md.render(modelValue.value) : ''
})

// If the parent updates modelValue, update the HTML content (only if it’s different)
watch(modelValue, (newVal) => {
  const newHtml = newVal ? md.render(newVal) : ''
  if (newHtml !== editorContent.value) {
    editorContent.value = newHtml
  }
})

// Debounce updates so that rapid changes (like pressing Enter) don’t re-render immediately
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(editorContent, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const updatedMarkdown = turndownService.turndown(newVal)
    emit('update:modelValue', updatedMarkdown)
  }, 300)
})

// Optionally, if QEditor emits an update event, synchronize our editorContent
function handleUpdate(updatedHtml: string) {
  editorContent.value = updatedHtml
}

// Copying: get the current HTML, convert to markdown, then write it to the clipboard
const handleCopy = () => {
  const currentHtml = editorContent.value
  const markdownText = turndownService.turndown(currentHtml)
  navigator.clipboard
    .writeText(markdownText)
    .then(() => {
      console.log('Markdown copied to clipboard')
    })
    .catch((err) => {
      console.error('Copy failed', err)
    })
}
</script>

<style lang="scss" scoped>
.q-input.high {
  height: -webkit-fill-available !important;
}

.q-input {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  // border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px !important;
}
.disabled-style {
  background-color: transparent !important;
  // border: 1px solid rgba(107, 114, 128, 0.5);
}

.copy {
  width: 16px;
  height: 16px;
}

:global(h1) {
  font-size: var(--font-size-title);
}

:global(h2) {
  font-size: var(--font-size-lg);
}

:global(h3) {
  font-size: var(--font-size-md);
}

:global(h4) {
  font-size: var(--font-size-m);
}

:global(h5) {
  font-size: var(--font-size-sm);
}
</style>

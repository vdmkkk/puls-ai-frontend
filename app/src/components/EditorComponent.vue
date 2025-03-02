<template>
  <q-editor
    :type="type"
    :model-value="editorHtml"
    :toolbar="[['bold', 'italic', 'underline']]"
    rounded
    :autogrow="false"
    :class="{ 'q-input': true, high: isHigh, 'disabled-style': isDisabled }"
    :disable="isDisabled"
    @update:model-value="handleUpdate"
  />
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue'
import MarkdownIt from 'markdown-it'
import TurndownService from 'turndown'

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

// Create instances for conversion
const md = new MarkdownIt()
const turndownService = new TurndownService()

// Convert markdown (modelValue) to HTML for the QEditor
const editorHtml = computed(() => {
  return modelValue.value ? md.render(modelValue.value) : ''
})

// When QEditor emits HTML updates, convert back to markdown and emit
function handleUpdate(updatedHtml: string) {
  const updatedMarkdown = turndownService.turndown(updatedHtml)
  emit('update:modelValue', updatedMarkdown)
}
</script>

<style lang="scss" scoped>
.q-input.high {
  height: -webkit-fill-available !important;
}

.q-input {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px !important;
}
.disabled-style {
  background-color: transparent !important;
  border: 1px solid rgba(107, 114, 128, 0.5);
}
</style>

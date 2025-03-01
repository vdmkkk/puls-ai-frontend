<template>
  <q-checkbox
    :model-value="modelValue"
    :label="label"
    :disable="isDisabled"
    color="teal"
    keep-color
    @update:model-value="emit('update:modelValue', $event as string)"
  />
</template>
<script setup lang="ts">
import { toRefs } from 'vue'

// @ts-nocheck //

const props = defineProps<{
  modelValue: boolean
  label: string
  isDisabled: boolean
}>()

const { modelValue } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style lang="scss" scoped>
.q-checkbox ::v-deep .text-teal {
  color: #4e4571 !important;
}
</style>

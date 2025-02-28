<template>
  <q-input
    :type="type"
    :model-value="modelValue"
    rounded
    standout="standout-class"
    :autogrow="false"
    color="primary"
    :class="isHigh ? 'high' : ''"
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
        icon="mic"
        class="q-mr-sm q-mb-md"
      />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string | undefined
    isHigh?: boolean
    isWide?: boolean
    label?: string
    hasVoice?: boolean
    type?: string
  }>(),
  { type: 'textarea' },
)
const { modelValue } = toRefs(props)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<style lang="scss" scoped>
:global(.q-field.high) {
  height: -webkit-fill-available !important;
}
:global(.q-field__control) {
  height: -webkit-fill-available !important;
}

:global(.q-field__control) {
  border-radius: 20px !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

:global(.q-field__native) {
  resize: none !important;
  color: white !important;
}

:global(.standout-class) {
  background-color: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 1);
}
</style>

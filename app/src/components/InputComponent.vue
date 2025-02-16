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
  background-color: rgba(133, 157, 184, 0.281) !important;
}

:global(.q-field__native) {
  resize: none !important;
  color: white !important;
}

:global(.standout-class) {
  background-color: rgba(144, 169, 197, 0.459) !important;
}
</style>

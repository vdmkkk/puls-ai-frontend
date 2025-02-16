<template>
  <q-btn
    :label="label"
    :class="{ selected: optionValue, default: !optionValue }"
    @click="emits('click')"
    flat
  />
</template>

<script setup lang="ts">
defineProps<{
  label: string
  optionValue: boolean
}>()

const emits = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.default,
.selected {
  border-radius: 10px;
}
.selected {
  background-color: white;
  color: black;
}

.default {
  background-color: rgba(133, 157, 184, 0.281) !important;
}
</style>

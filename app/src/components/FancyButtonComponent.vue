<template>
  <q-btn
    :label="label"
    flat
    no-caps
    class="fancy-btn"
    style="align-self: center !important"
    @click="emits('click')"
  />
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

const emits = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.fancy-btn {
  border: 3px solid #6836b8;
  color: #fff;
  width: fit-content;
  border-radius: 10px;
  font-size: var(--font-size-sm);
}
</style>

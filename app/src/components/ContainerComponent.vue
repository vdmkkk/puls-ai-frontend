<template>
  <div class="text column">
    <p>{{ text }}</p>
    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //

defineProps<{
  text: string
}>()
</script>

<style lang="scss" scoped>
.text {
  // border: solid 2px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: var(--spacing-xs);
  // padding-top: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  p {
    font-size: var(--font-size-md);
    font-weight: 600;
  }
}
</style>

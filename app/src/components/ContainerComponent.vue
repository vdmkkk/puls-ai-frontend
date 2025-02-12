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
  border: solid 2px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 20px;
  padding-top: 30px;
  background-color: rgba(58, 58, 67, 0.5);

  p {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>

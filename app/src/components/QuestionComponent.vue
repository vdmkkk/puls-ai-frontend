<template>
  <div :class="'question column' + (isHigh ? ' no-wrap high' : ' justify-between')">
    <p>{{ question }}</p>
    <slot name="default" />
    <div v-if="!$slots.default">
      <q-separator />
      <p class="q-mt-lg answer">{{ answer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //

defineProps<{
  question: string
  isHigh?: boolean
}>()

const answer = defineModel<string>()
</script>

<style lang="scss" scoped>
.question {
  border: solid 2px rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 20px;
  padding-top: 30px;
  background-color: rgba(58, 58, 67, 0.5);

  p {
    font-size: 20px;
    font-weight: 600;
  }

  .answer {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.high {
  height: auto;
}
</style>

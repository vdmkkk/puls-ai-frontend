<template>
  <div
    :class="
      'question column' +
      (isHigh ? ' no-wrap high' : ' justify-between') +
      (isDisabled ? ' disabled' : '')
    "
  >
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
  isDisabled?: boolean
}>()

const answer = defineModel<string>()
</script>

<style lang="scss" scoped>
.disabled {
  color: #b8b8bb !important;
}
.question {
  border-radius: 10px;
  padding: 20px;
  padding-top: 30px;
  background-color: rgba(255, 255, 255, 0.08);
  user-select: none;

  p {
    font-size: var(--font-size-sm);
    font-weight: 600;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
    // color: #4e4571;
  }

  .answer {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
    color: #b8b8bb;
    // color: white;
  }
}

.high {
  height: auto;
}
</style>

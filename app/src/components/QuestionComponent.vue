<template>
  <div :class="'question column' + (isHigh ? ' no-wrap' : ' justify-between')">
    <p>{{ question }}</p>
    <q-input
      type="textarea"
      v-model="answer"
      rounded
      standout="standout-class"
      :autogrow="false"
      color="primary"
      :class="isHigh ? 'high' : ''"
    />
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
}

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

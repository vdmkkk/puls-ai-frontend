<template>
  <div class="post column justify-between">
    <div>
      <p class="topic">{{ topic }}</p>
      <p v-if="text" class="text">{{ text }}</p>
      <div v-else class="space" />
    </div>

    <div>
      <p v-if="date" class="date">{{ date }}</p>
      <p v-else class="date" style="text-decoration: underline">Перейти</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //

defineProps<{
  topic: string
  text: string
  date?: string
}>()
</script>

<style lang="scss" scoped>
.post {
  border-radius: 10px;
  padding: var(--spacing-xs);
  background-color: rgba(255, 255, 255, 0.08);
  user-select: none;
  cursor: pointer;

  .topic {
    font-size: var(--font-size-md);
    font-weight: 600;
    margin: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2; /* number of lines to show */
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .text {
    margin-top: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #b8b8b8;
    margin-bottom: 0px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* number of lines to show */
    line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .space {
    height: var(--spacing-md);
  }

  .date {
    margin-top: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #29c2e8;
  }
}
</style>

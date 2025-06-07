<template>
  <q-btn
    :label="label"
    flat
    no-caps
    class="fancy-btn"
    style="align-self: center"
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
  color: #fff;
  width: fit-content;
  border-radius: 10px;
  background-color: #684485;
  font-size: var(--font-size-xs);
  font-weight: 500;
  width: var(--spacing-xl) !important;
}

.fancy-btn:hover {
  background-color: #715488;
}

@media screen and (max-width: 576px) {
  .fancy-btn {
    font-size: var(--font-size-sm);
    width: calc(var(--spacing-xl) + var(--spacing-md)) !important;
  }
}
</style>

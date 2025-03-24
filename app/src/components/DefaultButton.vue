<template>
  <q-btn :label="label" flat no-caps class="default-btn" @click.stop="emits('click')">
    <img :src="icon" v-if="icon" />
  </q-btn>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()

const emits = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.default-btn {
  border: 1px solid #fff !important;
  color: #fff;
  border-radius: 10px;
  font-size: var(--font-size-xs);
  font-weight: 500;
}

@media screen and (max-width: 576px) {
  .default-btn {
    font-size: var(--font-size-sm);
    // width: calc(var(--spacing-xl) + var(--spacing-md)) !important;
  }
}
</style>

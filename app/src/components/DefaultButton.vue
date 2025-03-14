<template>
  <q-btn :label="label" flat no-caps class="default-btn" @click="emits('click')">
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
</style>

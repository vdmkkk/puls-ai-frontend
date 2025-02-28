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
  background-color: #4e4571;
  font-size: var(--font-size-sm);
  font-weight: 500;
}

.fancy-btn:hover {
  background-color: #625985;
}
</style>

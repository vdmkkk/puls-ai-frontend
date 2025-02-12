<template>
  <q-btn :label="label" flat no-caps class="default-btn" @click="emits('click')" />
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

const emits = defineEmits(['click'])
</script>

<style lang="scss" scoped>
.default-btn {
  border: 2px solid #fff;
  color: #fff;
  width: fit-content;
  border-radius: 10px;
  align-self: flex-end;
  margin-top: 30px;
  margin-right: 2.5%;
  margin-bottom: 30px;
}
</style>

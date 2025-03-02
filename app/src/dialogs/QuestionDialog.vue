<script setup lang="ts">
import DefaultButton from 'src/components/DefaultButton.vue'
import InputComponent from 'src/components/InputComponent.vue'
import { ref, watch } from 'vue'
import close from '../assets/icons/close.svg'
import EditorComponent from 'src/components/EditorComponent.vue'

const answer = defineModel<string>()
const props = defineProps<{
  isOpen: boolean
  question: string
  isHigh?: boolean
}>()

const isOpenRef = ref(props.isOpen)

const emits = defineEmits(['close', 'save'])

watch(
  () => props.isOpen,
  (value) => {
    isOpenRef.value = value
  },
)

watch(isOpenRef, (value) => {
  if (!value) {
    emits('close')
  }
})

const onSave = () => {
  emits('save', answer.value)
}
</script>

<template>
  <q-dialog v-model="isOpenRef">
    <div class="dialog-container" :style="{ height: isHigh ? '60vh' : 'auto' }">
      <q-btn class="close" flat round @click="emits('close')">
        <img :src="close" />
      </q-btn>
      <p class="title">{{ question }}</p>
      <p class="subtitle">{{ question }}</p>
      <InputComponent
        :model-value="answer"
        :is-high="!!isHigh"
        @update:model-value="answer = $event"
      />
      <!-- <EditorComponent
        :model-value="answer"
        :is-high="!!isHigh"
        @update:model-value="answer = $event"
      /> -->
      <DefaultButton label="Сохранить" @click="onSave" class="save" />
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
  width: 90vw;
  background-color: #4e4571;
  border-radius: 10px;
  padding: var(--spacing-sm);
  padding-top: 30px;
  color: white;
  height: max-content;
  display: flex;
  flex-direction: column;
  position: relative;

  .title {
    font-size: var(--font-size-md);
    font-weight: 600;
    margin: 0px;
  }

  .close {
    position: absolute;
    right: var(--spacing-xs);
    top: var(--spacing-xs);
    width: var(--spacing-xs) !important;
    height: var(--spacing-xs) !important;
  }

  .subtitle {
    font-size: var(--font-size-sm);
    font-weight: 500;
    color: #b8b8bb;
    margin-top: var(--spacing-xs);
  }

  .save {
    margin-top: var(--spacing-sm);
    align-self: center;
  }
}
</style>

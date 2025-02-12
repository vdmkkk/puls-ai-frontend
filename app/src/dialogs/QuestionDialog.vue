<script setup lang="ts">
import InputComponent from 'src/components/InputComponent.vue'
import QuestionComponent from 'src/components/QuestionComponent.vue'
import { ref, toRefs, watch } from 'vue'

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
      <QuestionComponent
        :question="question"
        v-model:answer="answer"
        :is-high="!!isHigh"
        :style="{ height: isHigh ? '50vh' : 'auto' }"
      >
        <InputComponent
          :model-value="answer"
          :is-high="!!isHigh"
          @update:model-value="answer = $event"
        />
      </QuestionComponent>
      <q-btn label="Сохранить" flat no-caps class="save-btn" @click="onSave" />
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
  width: 90vw;
  background-color: rgba(58, 58, 67, 1);
  border-radius: 10px;
  padding: 20px;
  padding-top: 30px;
  color: white;
  height: max-content;
}
</style>

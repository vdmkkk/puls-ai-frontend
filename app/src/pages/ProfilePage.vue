<script setup lang="ts">
// @ts-nocheck //
import QuestionComponent from 'src/components/QuestionComponent.vue'
import BlobComponent from 'src/components/BlobComponent.vue'

import { ref } from 'vue'
import QuestionDialog from 'src/dialogs/QuestionDialog.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'

const questions = ref({
  'Как вас зовут?': 'answer1',
  'Какая ваша целевая аудитория?': 'answer2',
  'Напишите три проблемы или "боли" вашего потенциального клиента': 'answer3',
  'Засчет чего достигается успех ваших клиентов?': 'answer4',
  'Какая у вас специальность?': 'answer5',
  'Напишите главные факты о себе как о специалисте\nПочему к вам стоит прислушаться?': 'answer6',
})

const dialog = ref<{
  isOpen: boolean
  question: string
  answerKey: string
  isHigh: boolean
}>({
  isOpen: false,
  question: null,
  answerKey: null,
  isHigh: false,
})

const answers = ref<{
  link: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  answer5: string
  answer6: string
  answer7: string
}>({
  link: '',
  answer1: '',
  answer2: '',
  answer3: '',
  answer4: '',
  answer5: '',
  answer6: '',
  answer7: '',
})

const onSave = () => {
  console.log(answers.value)
}

const handlerOpenDialog = (question: string, answerKey: string, isHigh = false): void => {
  dialog.value = {
    isOpen: true,
    question,
    isHigh,
    answerKey,
  }
}

const handlerCloseDialog = () => {
  dialog.value = {
    isOpen: false,
    question: null,
    answerKey: null,
    isHigh: false,
  }
}

const handlerSaveDialog = (answer: string) => {
  answers.value[dialog.value.answerKey] = answer
  handlerCloseDialog()
}
</script>

<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <QuestionDialog
        :is-open="dialog.isOpen"
        :question="dialog.question"
        :is-high="dialog.isHigh"
        :model-value="answers[dialog.answerKey]"
        @close="handlerCloseDialog"
        @save="handlerSaveDialog"
      />
      <div class="column header">
        <p class="title">Информация о вас</p>
        <p class="description">Это необходимо для написания качественного контента</p>
        <FancyButtonComponent
          label="Проанализировать мою деятельность"
          style="align-self: center !important; margin-top: 30px; margin-bottom: 30px"
          @click="handlerOpenDialog('Ссылка на VK/TG', 'link')"
        />
        <p class="description" style="align-self: center">Или ответить на вопросы самостоятельно</p>
        <!-- <div class="question row">
          <p>Ссылка на VK/TG:</p>
          <q-input
            type="text"
            v-model="answers.link"
            rounded
            standout="standout-class"
            color="primary"
            style="width: -webkit-fill-available"
          />
        </div> -->
      </div>
      <div class="survey">
        <div class="questions">
          <QuestionComponent
            v-for="[question, answerKey] in Object.entries(questions)"
            :question="question"
            v-model="answers[answerKey]"
            @click="handlerOpenDialog(question, answerKey)"
          />
        </div>
        <QuestionComponent
          class="text"
          question="Шаблон поста"
          v-model="answers.answer7"
          isHigh
          @click="handlerOpenDialog('Шаблон поста', 'answer7', true)"
        />
      </div>
    </div>
    <DefaultButton label="Сохранить" @click="onSave" />
  </q-page>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .header {
    margin-left: 20%;
    margin-right: 20%;
    margin-top: 30px;
    margin-bottom: 30px;
    .title {
      font-size: 40px;
      font-weight: 600;
      margin: 0;
    }
    .description {
      font-size: 20px;
      font-weight: 100;
    }

    .question {
      border-radius: 10px;
      padding: 10px;
      padding-left: 30px;
      background-color: rgba(58, 58, 67, 0.5);
      align-items: center;
      flex-wrap: nowrap;

      p {
        font-size: 20px;
        font-weight: 600;
        margin-top: auto;
        margin-bottom: auto;
        margin-right: 10%;
        white-space: nowrap;
      }
    }
  }

  .survey {
    width: 95%;
    margin-left: 2.5%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 30px;

    .text {
      width: 20%;
    }

    .questions {
      width: 80%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 20px;
    }
  }
}
</style>

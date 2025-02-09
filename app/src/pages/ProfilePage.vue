<script setup lang="ts">
// @ts-nocheck //
import QuestionComponent from 'src/components/QuestionComponent.vue'
import BlobComponent from 'src/components/BlobComponent.vue'

import { ref } from 'vue'

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
</script>

<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Вопросы, на которые надо ответить</p>
        <p class="description">Это необходимо для написания качественного контента</p>
        <div class="question row">
          <p>Ссылка на VK/TG:</p>
          <q-input
            type="text"
            v-model="answers.link"
            rounded
            standout="standout-class"
            color="primary"
            style="width: -webkit-fill-available"
          />
        </div>
      </div>
      <div class="survey">
        <div class="questions">
          <QuestionComponent question="Какой вас зовут?" v-model="answers.answer1" />
          <QuestionComponent question="Какая ваша целевая аудитория?" v-model="answers.answer2" />
          <QuestionComponent
            question='Напишите три проблемы или "боли" вашего потенциального клиента'
            v-model="answers.answer3"
          />
          <QuestionComponent
            question="Засчет чего достигается успех ваших клиентов?"
            v-model="answers.answer4"
          />
          <QuestionComponent question="Какая у вас специальность?" v-model="answers.answer5" />
          <QuestionComponent
            :question="'Напишите главные факты о себе как о специалисте\nПочему к вам стоит прислушаться?'"
            v-model="answers.answer6"
          />
        </div>
        <QuestionComponent class="text" question="Шаблон поста" v-model="answers.answer7" isHigh />
      </div>
    </div>
    <q-btn label="Сохранить" flat no-caps class="save-btn" @click="onSave" />
  </q-page>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .save-btn {
    border: 2px solid #fff;
    color: #fff;
    width: fit-content;
    border-radius: 10px;
    align-self: flex-end;
    margin-top: 30px;
    margin-right: 2.5%;
    margin-bottom: 30px;
  }

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

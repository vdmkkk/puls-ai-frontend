<script setup lang="ts">
// @ts-nocheck //
import QuestionComponent from 'src/components/QuestionComponent.vue'
import BlobComponent from 'src/components/BlobComponent.vue'

import { computed, onMounted, ref, watch } from 'vue'
import QuestionDialog from 'src/dialogs/QuestionDialog.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import useCustomize from 'src/api/composables/useCustomize'
import { debounce } from 'quasar'
import useContent from 'src/api/composables/useContent'
import InputComponent from 'src/components/InputComponent.vue'
import CheckComponent from 'src/components/CheckComponent.vue'
import arrow_down from 'src/assets/icons/arrow_down.svg'
import { useRouter } from 'vue-router'

const questions = ref({
  'Как вас зовут?': 'answer1',
  'Какая ваша целевая аудитория?': 'answer2',
  'Напишите три проблемы или "боли" вашего потенциального клиента': 'answer3',
  'Засчет чего достигается успех ваших клиентов?': 'answer4',
  'Какая у вас специальность?': 'answer5',
  'Напишите главные факты о себе как о специалисте. Почему к вам стоит прислушаться?': 'answer6',
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

const emits = defineEmits<{
  (e: 'update:answers'): void
}>()

const isAuto = ref(true)
const loading = ref(false)

const answers = ref<{
  link: string
  answer1: string
  answer2: string
  answer3: string
  answer4: string
  answer5: string
  answer6: string
  post_sample: string[]
  check: boolean
}>({
  link: '',
  answer1: '',
  answer2: '',
  answer3: '',
  answer4: '',
  answer5: '',
  answer6: '',
  post_sample: [],
  check: true,
})

const { apiGenAnswersFromLink, apiGetUserAnswers, apiSaveAnswers } = useCustomize(loading)

const handlerOpenDialog = (question: string, answerKey: string, isHigh = false): void => {
  // if (!isAuto.value) {
  dialog.value = {
    isOpen: true,
    question,
    isHigh,
    answerKey,
  }
  // }
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

const processAnswers = () => {
  apiSaveAnswers(answers.value)
  emits('update:answers', answers.value)
}

const getFromLink = () => {
  if (answers.value.link.length > 0) {
    apiGenAnswersFromLink({ link: answers.value.link }).then((data) => {
      if (data) {
        const { q1, q2, q3, q4, q5, q6, post_sample } = data
        answers.value = {
          link: answers.value.link,
          answer1: q1,
          answer2: q2,
          answer3: q3,
          answer4: q4,
          answer5: q5,
          answer6: q6,
          post_sample,
          check: answers.value.check,
        }
      }
    })
  }
}

const debouncedProcessAnswers = debounce(processAnswers, 1000)

const filteredAnswers = computed(() => {
  const { link, check, ...rest } = answers.value
  return rest
})

watch(
  filteredAnswers,
  () => {
    debouncedProcessAnswers()
  },
  { deep: true },
)
const loadData = () => {
  apiGetUserAnswers().then((data) => {
    if (data) {
      const { q1, q2, q3, q4, q5, q6, post_sample } = data
      answers.value = {
        link: '',
        answer1: q1,
        answer2: q2,
        answer3: q3,
        answer4: q4,
        answer5: q5,
        answer6: q6,
        post_sample,
        check: true,
      }
    }
  })
}

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  loadData()
})
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
        <p class="title">Заполните анкету, чтобы начать создавать контент</p>
        <p class="description">
          Выберите удобный способ: мы можем проанализировать ваш аккаунт по ссылке и
          <span style="font-weight: 600">автоматически</span>
          заполнить поля с вопросами или вы можете ответить на вопросы
          <span style="font-weight: 600">вручую</span>. Это займёт всего 5 минут и нужно только один
          раз.
        </p>
      </div>
      <q-btn-toggle
        v-model="isAuto"
        class="btn-group"
        no-caps
        rounded
        unelevated
        :options="[
          { label: 'Автоматически', value: true },
          { label: 'Вручную', value: false },
        ]"
      />
      <p class="link-title" :class="{ grey: !isAuto }">
        Укажите ссылку на ваш Telegram-канал или профиль VK, где вы уже публикуете посты
      </p>
      <div class="row" style="gap: var(--spacing-xs)">
        <InputComponent
          :isDisabled="!isAuto"
          :modelValue="answers.link"
          type="text"
          class="link-input"
          @update:model-value="answers.link = $event"
        />
        <FancyButtonComponent :disabled="!isAuto" label="Применить" @click="getFromLink" />
        <!-- <q-btn round color="primary" @click="getFromLink">
          <img :src="arrow_down" />
        </q-btn> -->
      </div>

      <CheckComponent
        :modelValue="answers.check"
        :isDisabled="!isAuto"
        style="user-select: none"
        label="Использовать стилистику моих постов"
        @update:modelValue="answers.check = $event"
      />
      <p class="survey-title">
        Нажмите на карточку с вопросом, чтобы посмотреть пояснения и ответить
      </p>
      <div v-if="!loading" class="questions">
        <QuestionComponent
          v-for="[question, answerKey] in Object.entries(questions)"
          :question="question"
          v-model="answers[answerKey]"
          @click="handlerOpenDialog(question, answerKey)"
        />
      </div>
      <q-spinner-puff v-else class="loading" size="70px" />
      <FancyButtonComponent
        :disabled="
          answers.answer1 == '' ||
          answers.answer2 == '' ||
          answers.answer3 == '' ||
          answers.answer4 == '' ||
          answers.answer5 == '' ||
          answers.answer6 == ''
        "
        label="Перейти  к созданию контента"
        style="width: max-content !important; align-self: flex-start"
        @click="navigateTo('/texts')"
      >
        <q-tooltip
          v-if="
            answers.answer1 == '' ||
            answers.answer2 == '' ||
            answers.answer3 == '' ||
            answers.answer4 == '' ||
            answers.answer5 == '' ||
            answers.answer6 == ''
          "
          ><a
            :style="
              $q.screen.xs
                ? { 'font-size': 'var(--font-size-sm)' }
                : { 'font-size': 'var(--font-size-xs)' }
            "
            >Сначала заполните анкету</a
          ></q-tooltip
        >
      </FancyButtonComponent>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);

  .link-title {
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-m);
    font-weight: 500;
  }

  .link-input {
    width: 50%;
  }

  .header {
    margin-top: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    .title {
      font-size: var(--font-size-title);
      font-weight: 600;
      margin: 0;
      line-height: calc(var(--font-size-title) + 5px);
      margin-bottom: var(--spacing-xs);
    }
    .description {
      font-size: var(--font-size-sm);
      font-weight: 100;
      color: #ffffff;
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

  .survey-title {
    margin-top: var(--spacing-sm);
    font-size: var(--font-size-m);
    font-weight: 500;
  }

  .text {
    width: 20%;
  }

  .questions {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: var(--spacing-xs);
    padding-bottom: var(--spacing-md);
  }

  .loading {
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--spacing-xl);
    color: #684485;
  }
}

.q-btn-group ::v-deep .no-outline {
  border: 1px solid #684485 !important;
  width: var(--spacing-xl) !important;
  font-size: var(--font-size-xs);
}

.q-btn-group ::v-deep .bg-primary {
  background-color: #684485 !important;
  border: 1px solid transparent !important;
}

.q-btn-group ::v-deep .q-btn-item:last-child {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 10px !important;
}

.q-btn-group ::v-deep .q-btn-item:first-child {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

.grey {
  color: #b8b8bb !important;
}

@media screen and (max-width: 576px) {
  .questions {
    display: flex !important;
    flex-direction: column;
  }

  .q-btn-group ::v-deep .no-outline {
    width: calc(var(--spacing-xl) + var(--spacing-lg)) !important;
    font-size: var(--font-size-sm);
  }
}
</style>

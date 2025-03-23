<script setup lang="ts">
import DefaultButton from 'src/components/DefaultButton.vue'
import InputComponent from 'src/components/InputComponent.vue'
import { ref, watch } from 'vue'
import close from '../assets/icons/close.svg'
import EditorComponent from 'src/components/EditorComponent.vue'

const answer = defineModel<string>('model')
const code = defineModel<string>('code')
const props = defineProps<{
  isOpen: boolean
  answerKey: string
}>()

const title = {
  vk: 'Подключение к VK',
  tg: 'Подключение к Telegram',
}

const description = {
  vk: 'Введите ссылку на ваше сообщество в VK',
  tg: 'Введите ссылку на ваш канал в Telegram',
}

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
  emits('save', props.answerKey == 'tg' ? answer.value : { answer: answer.value, code: code.value })
}
</script>

<template>
  <q-dialog v-model="isOpenRef">
    <div class="dialog-container">
      <q-btn class="close" flat round @click="emits('close')">
        <img :src="close" />
      </q-btn>
      <p class="title">{{ title[answerKey] }}</p>
      <p v-if="description" class="subtitle"><p v-if="answerKey == 'tg'">1. Найти в поиске telegram- бота @puls_autopost_bot<br/>2. Перейдите в Ваш канал<br/>3. Сделайте @puls_autopost_bot вторым администратором Вашего канала</p><p v-else>{{ description['vk'] }}</p></p>
      <InputComponent :model-value="answer" @update:model-value="answer = $event" />
      <div v-if="answerKey === 'vk'">
        <p class="subtitle" style="margin-top: var(--spacing-sm)">
          1. Перейдите в https://vkhost.github.io/<br />2. Выберите приложение VK Admin<br />3.
          Нажмите кнопку Разрешить<br />4. Скопируйте часть адресной строки от access_token= до
          &expires_in<br />5. Вставьте скопированный ключ в поле
        </p>
        <InputComponent :model-value="code" @update:model-value="code = $event" />
      </div>
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
    margin-bottom: var(--spacing-xs);
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
  }

  .save {
    margin-top: var(--spacing-sm);
    align-self: center;
  }
}
</style>

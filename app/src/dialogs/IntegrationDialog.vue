<script setup lang="ts">
import DefaultButton from 'src/components/DefaultButton.vue'
import InputComponent from 'src/components/InputComponent.vue'
import { ref, watch } from 'vue'
import close from '../assets/icons/close.svg'
import EditorComponent from 'src/components/EditorComponent.vue'
import instLogo from '../assets/icons/inst-logo.svg'

const answer = defineModel<string>('model')
const code = defineModel<string>('code')
const password = defineModel<string>('password')
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
  emits('save', props.answerKey == 'tg' ? answer.value : props.answerKey == 'inst' ? {answer: answer.value, password: password.value} : { answer: answer.value, code: code.value })
}
</script>

<template>
  <q-dialog v-model="isOpenRef">
    <div v-if="answerKey !== 'inst'" class="dialog-container">
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
    <div v-else class="inst-container">
      <img :src="instLogo" alt="Instagram Logo" />
<q-input
    v-model="answer"
    label="Телефон, имя пользователя или эл. адрес"
    outlined
    dense
    class="login-input"
  />
  <q-input
    v-model="password"
    type="password"
    label="Пароль"
    outlined
    dense
    class="login-input"
  />    
  <q-btn label="Войти" no-caps class="login"  @click="onSave" />
  <DefaultButton label="Отмена" @click="emits('close')" class="cancel" />
 </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
.dialog-container {
  width: 90vw;
  background-color: #684485;
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

.inst-container {
  width: fit-content;
  background-color:rgb(0, 0, 0);
  border-radius: 10px;
  padding: var(--spacing-sm);
  padding-top: 30px;
  color: white;
  height: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  

  .login-input { margin-bottom: 12px; }

  img {
    width: 200px;
  }

  .login {
    width: 80%;
    margin-top: var(--spacing-sm);
    border-radius: 10px;
    background-color: #4150F7;
  }

  .cancel {
    margin-top: var(--spacing-xs);
    align-self: center;
  }
}
.login-input {
  width: 350px;
  height: 40px;
}

.login-input ::v-deep .q-field__control {
    background-color: #121212 !important;           /* black fill like screenshot   */
    color: #4a4a4a !important;     /* thin grey outline            */
    border-radius: 4px;               /* subtle rounded corners       */
    // padding: 14px 12px;               /* inner breathing room         */
    transition: border-color .2s ease, box-shadow .2s ease;
  }

.login-input ::v-deep .q-field__native::placeholder {
    color: #9d9d9d !important;
    opacity: 1;              
  }

  .login-input ::v-deep .q-field__native {
    // padding: 10px 0px !important;
    color: #fff;         
    // font-size: 12px;
  }



  .login-input ::v-deep input:-webkit-autofill {
   box-shadow: 0 0 0px 1000px #121212 inset !important;
   -webkit-text-fill-color: #fff !important;
   caret-color: #fff;
}

.login-input ::v-deep .q-field__label {
  color: #4a4a4a;
}

@media screen and (max-width: 576px) {

  .inst-container {
    width: 90vw;
    padding: var(--spacing-xs);
    padding-top: 30px;
  }

  .login-input {
    width: 90%;
  }
  
}


</style>

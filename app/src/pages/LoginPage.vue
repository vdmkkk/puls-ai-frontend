<template>
  <div class="column app items-center">
    <div class="row title-container">
      <a class="title">Вход в</a><img src="/src/assets/svg/logo.svg" /><a class="title">puls.</a>
    </div>
    <q-form @submit="handlerLogin" class="q-gutter-md items-center column">
      <q-input
        v-model="login"
        :label="$t('email')"
        style="width: 500px"
        type="email"
        color="deep-purple-8"
        label-color="grey-1"
        rounded
        outlined
        lazy-rules
        :error="errorStore.errors.login"
        :error-message="errorStore.errors.login ? errorStore.errorMessage : undefined"
        :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
      />
      <div class="row">
        <q-input
          v-model="password"
          :type="!showPassword ? 'password' : 'text'"
          :label="$t('password')"
          style="width: 436px"
          color="deep-purple-8"
          label-color="grey-1"
          rounded
          outlined
          lazy-rules
          :error="errorStore.errors.password"
          :error-message="errorStore.errors.password ? errorStore.errorMessage : undefined"
          @keydown.enter.prevent="handlerLogin"
          :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
        >
          <template v-slot:append>
            <q-icon
              :name="!showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              color="grey-1"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
        <q-btn
          class="check"
          icon="question_mark"
          @click="handlerChangePassword"
          size="sm"
          color="grey-1"
          outline
        >
          <q-tooltip>
            <a>{{ $t('forgotPassword') }}</a>
          </q-tooltip>
        </q-btn>
      </div>
      <q-btn :label="$t('login')" class="login" type="submit" flat text-color="grey-1" no-caps />
    </q-form>

    <q-btn
      :label="$t('dontHaveAccount')"
      class="already-have-account"
      flat
      no-caps
      rounded
      @click="handlerRedirect"
    />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
import useAuth from 'src/api/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useErrorStore } from 'src/stores/error-store'

const { t } = useI18n()

const errorStore = useErrorStore()

const { apiLogin } = useAuth()
const router = useRouter()

const login = ref<string>('')
const password = ref<string>('')
const showPassword = ref<boolean>(false)

const handlerLogin = () => {
  apiLogin(login.value, password.value).then((e) => {
    if (!e) {
      router.push('/')
    } else {
      if (e.response?.data?.user_message) {
        Notify.create({
          message: e.response?.data?.user_message,
          position: 'top',
          color: 'negative',
        })
      } else {
        Notify.create({
          message: t('errors.errorOnAuth'),
          position: 'top',
          color: 'negative',
        })
      }
    }
  })
}

const handlerChangePassword = () => {
  router.push('/forgot-password')
}

const handlerRedirect = () => {
  router.push('/register')
}
</script>

<style lang="scss" scoped>
.app {
  background-color: #12121b;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 80px;
  height: 100vh;
  gap: 20px;

  .title-container {
    line-height: var(--font-size-title);
    .title {
      font-size: var(--font-size-title);
      font-weight: 600;
      color: white;
    }
    img {
      margin-left: 16px;
      margin-right: calc(var(--spacing-xxs) / 2px);
      height: calc(var(--font-size-title) - 4px);
    }
    margin-bottom: 50px;
  }
}

:global(.q-field__control) {
  border: 1px solid #2d2d4e;
  border-radius: 14px !important;
}

:global(.q-field__control) {
  padding-left: 30px !important;
  padding-right: 30px !important;
}

:global(.q-field__native) {
  color: white;
}

:global(input, select) {
  color: white !important;
  -webkit-text-fill-color: white !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
}

.login {
  margin-top: 30px;
  background-color: #2c2c5e !important;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 14px;
}

.already-have-account {
  color: white;
  font-size: var(--font-size-xxs);
}

.check {
  height: 48px !important;
  width: 48px !important;
  border-radius: 12px;
  margin-top: 6px !important;
  margin-left: 16px !important;
}
</style>

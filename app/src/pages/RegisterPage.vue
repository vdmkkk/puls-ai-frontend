<template class="overflow-hidden">
  <div class="column app items-center no-wrap">
    <div class="row title-container">
      <a class="title">Регистрация в</a><img src="/src/assets/svg/logo.svg" /><a class="title"
        >puls.</a
      >
    </div>
    <q-form @submit="handlerLogin" class="q-gutter-md items-center column">
      <q-input
        v-model="name"
        :label="$t('name')"
        style="width: 500px"
        color="deep-purple-8"
        label-color="grey-1"
        outlined
        rounded
        lazy-rules
        :error="errorStore.errors.name"
        :error-message="errorStore.errors.name ? errorStore.errorMessage : undefined"
        :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
      />
      <q-input
        v-model="lastName"
        :label="$t('lastName')"
        style="width: 500px"
        color="deep-purple-8"
        label-color="grey-1"
        outlined
        rounded
        lazy-rules
        :error="errorStore.errors.lastName"
        :error-message="errorStore.errors.lastName ? errorStore.errorMessage : undefined"
        :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
      />
      <div class="row">
        <q-input
          v-model="login"
          :label="$t('email')"
          style="width: 436px"
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
        <q-btn class="check" icon="check" @click="handlerVerify" size="sm" color="grey-1" outline>
          <q-tooltip>
            <a>{{ $t('verify') }}</a>
          </q-tooltip>
        </q-btn>
      </div>
      <q-input
        v-model="verificationCode"
        :label="$t('verificationCode')"
        style="width: 500px"
        color="deep-purple-8"
        label-color="grey-1"
        rounded
        outlined
        lazy-rules
        :error="errorStore.errors.verificationCode"
        :error-message="errorStore.errors.verificationCode ? errorStore.errorMessage : undefined"
        :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
      />
      <q-input
        v-model="password"
        :type="!showPassword ? 'password' : 'text'"
        :label="$t('password')"
        style="width: 500px"
        color="deep-purple-8"
        label-color="grey-1"
        rounded
        outlined
        lazy-rules
        :error="errorStore.errors.password"
        :error-message="errorStore.errors.password ? errorStore.errorMessage : undefined"
        :rules="[
          (val) => (val && val.length > 0) || $t('errors.required'),
          (val) => isValidPassword(val) || $t('errors.passwordNotValid'),
          (val) => val === againPassword || $t('errors.passwordsNotSame'),
        ]"
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
      <q-input
        v-model="againPassword"
        :type="!showPasswordAgain ? 'password' : 'text'"
        :label="$t('passwordAgain')"
        style="width: 500px"
        color="deep-purple-8"
        label-color="grey-1"
        rounded
        outlined
        lazy-rules
        :error="errorStore.errors.againPassword"
        :error-message="errorStore.errors.againPassword ? errorStore.errorMessage : undefined"
        :rules="[
          (val) => (val && val.length > 0) || $t('errors.required'),
          (val) => val === password || $t('errors.passwordsNotSame'),
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="!showPasswordAgain ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            color="grey-1"
            size="xs"
            @click="showPasswordAgain = !showPasswordAgain"
          /> </template
      ></q-input>

      <q-btn :label="$t('register')" class="login" type="submit" flat text-color="grey-1" no-caps />

      <q-btn
        :label="$t('alreadyHaveAccount')"
        class="already-have-account"
        flat
        no-caps
        rounded
        @click="handlerRedirect"
      />
    </q-form>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
import { Notify } from 'quasar'
import useAuth from 'src/api/composables/useAuth'
import { useErrorStore } from 'src/stores/error-store'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()

const { apiRegister, apiEmailCode } = useAuth()
const router = useRouter()

const name = ref<string>('')
const lastName = ref<string>('')
const login = ref<string>('')
const password = ref<string>('')
const againPassword = ref<string>('')
const verificationCode = ref<string>('')

const errorStore = useErrorStore()

const showPassword = ref<boolean>(false)
const showPasswordAgain = ref<boolean>(false)

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^[A-Za-z0-9]{8,}$/
  return passwordRegex.test(password)
}

const handlerVerify = () => {
  apiEmailCode(login.value).then((e) => {
    if (!e) {
      Notify.create({ message: t('sentConfirm'), color: 'positive', position: 'top' })
    } else {
      if (e.response?.data?.user_message) {
        Notify.create({
          message: e.response?.data?.user_message,
          position: 'top',
          color: 'negative',
        })
      } else {
        Notify.create({
          message: t('errors.unknown'),
          position: 'top',
          color: 'negative',
        })
      }
    }
  })
}

const handlerLogin = () => {
  if (password.value != againPassword.value) {
    Notify.create({ message: t('errors.passwordsNotSame'), color: 'negative', position: 'top' })
    return
  }
  if (!isValidPassword(password.value)) {
    Notify.create({ message: t('errors.passwordNotValid'), color: 'negative', position: 'top' })

    return
  }
  let verif: number
  try {
    verif = parseInt(verificationCode.value)
    if (Number.isNaN(verif)) {
      throw Error
    }
  } catch {
    Notify.create({ message: t('errors.verificationFailed'), color: 'negative', position: 'top' })
    return
  }
  apiRegister(name.value, lastName.value, login.value, password.value, verif).then((e) => {
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

const handlerRedirect = () => {
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.app {
  background-color: #12121b;
  padding-left: 10%;
  padding-right: 10%;
  padding-top: 80px;
  // height: 100%;
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

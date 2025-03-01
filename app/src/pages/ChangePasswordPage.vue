<template>
  <div class="column app items-center">
    <div class="row title-container">
      <a class="title">Восстановление пароля</a>
    </div>
    <q-form @submit="handlerSubmit" class="q-gutter-md column items-center">
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
        :rules="[(val) => (val && val.length > 0) || $t('errors.required')]"
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
      <q-btn :label="$t('sendLink')" class="login" type="submit" flat text-color="grey-1" no-caps />
    </q-form>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck //
import useAuth from 'src/api/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useErrorStore } from 'src/stores/error-store'

const route = useRoute()
const accessToken = route.params.access_token as string

const { t } = useI18n()

const { apiChangePassword } = useAuth()
const router = useRouter()
const errorStore = useErrorStore()

const password = ref<string>('')
const againPassword = ref<string>('')

const showPassword = ref<boolean>(false)
const showPasswordAgain = ref<boolean>(false)

const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^[A-Za-z0-9]{8,}$/
  return passwordRegex.test(password)
}

const handlerSubmit = () => {
  if (password.value != againPassword.value) {
    Notify.create({ message: t('errors.passwordsNotSame'), color: 'negative', position: 'top' })
    return
  }
  if (!isValidPassword(password.value)) {
    Notify.create({ message: t('errors.passwordNotValid'), color: 'negative', position: 'top' })
    return
  }

  apiChangePassword(accessToken, password.value).then((e) => {
    if (!e) {
      router.push('/login')
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
    .title {
      font-size: var(--font-size-title);
      font-weight: 600;
      color: white;
    }
    img {
      margin-left: 16px;
      margin-right: 6px;
      height: 36px;
      margin-top: 14px;
    }
    margin-bottom: 50px;
  }
}

.q-input ::v-deep .q-field__control {
  border: 1px solid #2d2d4e;
  border-radius: 14px !important;
}

.q-input ::v-deep .q-field__control {
  padding-left: 30px !important;
  padding-right: 30px !important;
}

.q-input ::v-deep .q-field__native {
  color: white;
}

.q-input ::v-deep input,
select {
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
  position: absolute;
  height: 48px !important;
  width: 48px !important;
  border-radius: 12px;
  top: 80px;
  left: 80px;
}
</style>

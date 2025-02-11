<template>
  <q-btn class="check" icon="chevron_left" @click="handlerBack" size="md" color="grey-1" outline>
    <q-tooltip>
      <a>{{ $t('back') }}</a>
    </q-tooltip>
  </q-btn>
  <div class="column app items-center">
    <div class="row title-container">
      <a class="title">Восстановление пароля</a>
    </div>
    <q-form @submit="handlerSendLink" class="q-gutter-md items-center column">
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
import { useErrorStore } from 'src/stores/error-store'

const { t } = useI18n()

const { apiSendLink } = useAuth()
const router = useRouter()
const errorStore = useErrorStore()

const login = ref<string>('')

const handlerSendLink = () => {
  apiSendLink(login.value).then((e) => {
    console.log(e)
    if (!e || e.status === 200) {
      Notify.create({ message: t('sentConfirm'), color: 'positive', position: 'top' })
    } else {
      Notify.create({
        message: t('errors.unknown'),
        position: 'top',
        color: 'negative',
      })
    }
  })
}

const handlerBack = () => {
  router.back()
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
  position: absolute;
  height: 48px !important;
  width: 48px !important;
  border-radius: 12px;
  top: 80px;
  left: 80px;
}
</style>

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
    <q-input
      v-model="login"
      :label="$t('email')"
      style="width: 500px"
      type="email"
      color="deep-purple-8"
      label-color="grey-1"
      rounded
      outlined
    />
    <q-btn
      :label="$t('sendLink')"
      class="login"
      @click="handlerSendLink"
      flat
      text-color="grey-1"
      no-caps
    />
  </div>
</template>

<script setup lang="ts">
import useAuth from 'src/api/composables/useAuth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { apiSendLink } = useAuth()
const router = useRouter()

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
      font-size: 40px;
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
  font-size: 12px;
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

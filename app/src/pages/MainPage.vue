<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <IntegrationDialog
        :is-open="dialog.isOpen"
        :answer-key="dialog.answerKey"
        :model="dialog.answerKey == 'vk' ? me?.vk_channel_url : me?.tg_channel_url"
        :code="me?.vk_channel_code"
        @close="handlerCloseDialog"
        @save="handlerSaveDialog"
      />
      <div class="row justify-between items-start">
        <div class="column header">
          <p class="title">Профиль</p>
          <p class="name">{{ me?.first_name }} {{ me?.last_name }}</p>
          <p class="description">
            {{ me?.email }}
          </p>
        </div>
        <DefaultButton label="Выйти" style="margin-top: var(--spacing-sm)" @click="handleLogout" />
      </div>

      <DefaultButton label="Сменить пароль" style="align-self: flex-start" @click="changePwd" />
      <div class="container">
        <p class="title">{{ subs[me?.tariff]?.title }}</p>
        <p class="description">
          осталось
          {{ me?.gen_point_amount }}/{{ subs[me?.tariff]?.gens }}
          <img style="vertical-align: sub" :src="boltIcon" /> генераций
        </p>
        <p class="description">осталось {{ me?.days_left }} дней подписки</p>
        <p class="link" @click="navigateTo('/subscription')">
          Управлять подпиской <img :src="arrowRight" />
        </p>
      </div>
      <p class="name">Интеграции</p>
      <div class="integrations row" style="gap: var(--spacing-sm); width: 50%">
        <div class="int-container">
          <div class="icon-container-tg">
            <img class="icon" :src="tgIcon" />
          </div>
          <p v-if="me?.tg_channel_url" class="description">{{ me?.tg_channel_url }}</p>
          <p v-else class="description">Не подключен</p>
          <DefaultButton
            :label="me?.tg_channel_url ? 'Изменить' : 'Подключить'"
            style="align-self: flex-start; margin-top: var(--spacing-xs)"
            @click="handlerOpenDialog('tg')"
          />
        </div>
        <div class="int-container">
          <div class="icon-container-vk">
            <img class="icon" :src="vkIcon" />
          </div>
          <p v-if="me?.vk_channel_url" class="description">{{ me?.vk_channel_url }}</p>
          <p v-else class="description">Не подключен</p>
          <DefaultButton
            :label="me?.vk_channel_url ? 'Изменить' : 'Подключить'"
            style="align-self: flex-start; margin-top: var(--spacing-xs)"
            @click="handlerOpenDialog('vk')"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useContent from 'src/api/composables/useContent'
import useProfile from 'src/api/composables/useProfile'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import DefaultButton from 'src/components/DefaultButton.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import arrowRight from 'src/assets/icons/arrow_right_blue.svg'
import boltIcon from 'src/assets/icons/energy.svg'
import tgIcon from 'src/assets/icons/telegram.svg'
import vkIcon from 'src/assets/icons/vk.svg'
import IntegrationDialog from 'src/dialogs/IntegrationDialog.vue'
import useCustomize from 'src/api/composables/useCustomize'
import { Notify } from 'quasar'
import Cookies from 'js-cookie'
import useAuth from 'src/api/composables/useAuth'

const { getMe } = useProfile()
const router = useRouter()
const loading = ref(false)
const loading2 = ref(false)
const { apiSaveAccount } = useCustomize(loading2)
const { apiSendLink } = useAuth()

const subs = {
  '2': {
    title: 'Старт',
    days: '30',
    gens: '14',
    cost: '990',
  },
  '3': {
    title: 'Прорыв',
    days: '30',
    gens: '28',
    cost: '2490',
  },
  '4': {
    title: 'Мастер',
    days: '30',
    gens: '40',
    cost: '3990',
  },
  '1': {
    title: 'Пробный тариф',
    days: '7',
    gens: '6',
    cost: '990',
  },
}

const dialog = ref<{
  isOpen: boolean
  answerKey: 'vk' | 'tg'
}>({
  isOpen: false,
  answerKey: null,
})

const me = ref()

const handlerOpenDialog = (answerKey: string): void => {
  dialog.value = {
    isOpen: true,
    answerKey,
  }
}

const handlerCloseDialog = () => {
  dialog.value = {
    isOpen: false,
    answerKey: null,
  }
}

const handlerSaveDialog = (answer: string) => {
  if (dialog.value.answerKey == 'tg') {
    apiSaveAccount({
      tg_channel_url: answer,
      vk_channel_url: '',
      vk_token: '',
    }).then((res) => {
      if (res) {
        me.value.tg_channel_url = answer
      } else {
        Notify.create({
          message:
            'Произошла ошибка при привязке аккаунта. Пожалуйста, убедитесь, что вы выполнили все шаги инструкции, и попробуйте еще раз',
          position: 'top',
          color: 'negative',
        })
      }
    })
  } else {
    apiSaveAccount({
      vk_channel_url: answer.answer,
      vk_token: answer.code,
      tg_channel_url: '',
    }).then((res) => {
      if (res) {
        me.value.vk_channel_url = answer.answer
        me.value.vk_channel_code = answer.code
      } else {
        Notify.create({
          message:
            'Произошла ошибка при привязке аккаунта. Пожалуйста, убедитесь, что вы выполнили все шаги инструкции, и попробуйте еще раз',
          position: 'top',
          color: 'negative',
        })
      }
    })
  }
  handlerCloseDialog()
}

const load = () => {
  getMe()
    .then((res) => {
      me.value = res
    })
    .finally(() => {
      loading.value = false
    })
}

const navigateTo = (path: string) => {
  router.push(path)
}

const handleLogout = () => {
  Cookies.remove('refresh_token')
  Cookies.remove('atoken')
  navigateTo('/login')
}

const changePwd = () => {
  apiSendLink(me.value?.email).then((res) => {
    if (res) {
      Notify.create({
        message: 'Ссылка для смены пароля отправлена на вашу почту',
        position: 'top',
        color: 'positive',
      })
    } else {
      Notify.create({
        message: 'Произошла ошибка при отправке письма. Попробуйте еще раз',
        position: 'top',
        color: 'negative',
      })
    }
  })
}

onMounted(() => {
  loading.value = true
  load()
})
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);

  .loading {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    margin-left: 50%;
    transform: translateX(-50%);
    color: #4e4571;
  }

  .description {
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: #b8b8b8;
    text-decoration: underline;
    line-height: var(--line-height-sm);
  }

  .name {
    padding-top: var(--spacing-sm);
    font-size: var(--font-size-md);
    font-weight: 500;
    margin: 0;
  }

  .header {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    margin-right: var(--spacing-sm);
    align-items: start;
    .title {
      font-size: var(--font-size-title);
      font-weight: 500;
      margin: 0;
    }
  }

  .int-container {
    margin-top: var(--spacing-sm);
    background-color: rgba(255, 255, 255, 0.08);
    user-select: none;
    border-radius: 10px;
    width: fit-content;
    padding: var(--spacing-xs);
    padding-right: var(--spacing-md);

    .description {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #b8b8b8;
      text-decoration: none;
      margin-top: var(--spacing-xs);
    }

    .icon-container-tg {
      border-radius: 16px;
      background-color: #34abdf;
      width: calc(var(--spacing-sm) + var(--spacing-xs));
      height: calc(var(--spacing-sm) + var(--spacing-xs));
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .icon-container-vk {
      border-radius: 16px;
      background-color: #0077ff;
      width: calc(var(--spacing-sm) + var(--spacing-xs));
      height: calc(var(--spacing-sm) + var(--spacing-xs));
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        padding-right: 0px !important;
      }
    }
    .icon {
      width: var(--spacing-sm);
      height: var(--spacing-sm);
      padding-right: 2px;
    }

    .link {
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #29c2e8;
      cursor: pointer;
      text-decoration: underline;
      margin-top: var(--spacing-xxs);
      line-height: var(--line-height-sm);
      gap: 6px;
      img {
        width: var(--line-height-sm);
        height: var(--line-height-sm);
      }
    }
  }
  .container {
    margin-top: var(--spacing-md);
    background-color: rgba(255, 255, 255, 0.08);
    user-select: none;
    border-radius: 10px;
    width: 50%;
    padding: var(--spacing-xs);

    .title {
      font-size: var(--font-size-md);
      font-weight: 600;
      margin: 0;
    }

    .description {
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #b8b8b8;
      text-decoration: none;
      margin-top: var(--spacing-xxs);
    }

    .link {
      display: flex;
      align-items: center;
      font-size: var(--font-size-sm);
      font-weight: 500;
      color: #29c2e8;
      cursor: pointer;
      text-decoration: underline;
      margin-top: var(--spacing-xxs);
      line-height: var(--line-height-sm);
      gap: 6px;
      img {
        width: var(--line-height-sm);
        height: var(--line-height-sm);
      }
    }
  }
}

@media screen and (max-width: 576px) {
  .app {
    padding-left: var(--spacing-xs);
    padding-right: var(--spacing-xs);

    .container {
      width: 100%;
    }

    .integrations {
      width: 100% !important;

      .int-container {
        width: 100% !important;
      }

      .icon-container-tg,
      .icon-container-vk {
        width: calc(var(--spacing-md) + var(--spacing-sm) + var(--spacing-xs)) !important;
        height: calc(var(--spacing-md) + var(--spacing-sm) + var(--spacing-xs)) !important;
        border-radius: 24px;
      }

      .icon {
        width: var(--spacing-md);
        height: var(--spacing-md);
        padding-right: 2px;
      }
    }
  }
}
</style>

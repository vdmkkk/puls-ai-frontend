<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Управление подпиской</p>
      </div>
      <div v-if="me?.days_left > 0">
        <FancyButtonComponent
          label="Перейти в профиль"
          @click="navigateTo('/profile')"
          style="width: max-content !important; margin-bottom: var(--spacing-xs)"
        />
        <p class="subtitle">Текущая подписка</p>
        <div class="container">
          <p class="title">{{ subs[me?.tariff]?.name }}</p>
          <p class="description">
            осталось
            {{ me?.gen_point_amount }}/{{ subs[me?.tariff]?.generations }}
            <img style="vertical-align: sub" :src="boltIcon" /> генераций
          </p>
          <p class="description">осталось {{ me?.days_left }} дней подписки</p>
          <p class="description">Автосписание включается автоматически при оплате подписки</p>
          <!-- <FancyButtonComponent
            style="width: max-content !important"
            label="Отключить автосписание"
            :disabled="!me?.is_with_auto_payment"
            @click="handleDisableAutoPayment"
          >
            <q-tooltip v-if="!me?.is_with_auto_payment">Автосписание отключено</q-tooltip>
          </FancyButtonComponent> -->
        </div>
        <DefaultButton
          style="margin-top: var(--spacing-xs)"
          label="Перейти в профиль"
          @click="navigateTo('/')"
        />
      </div>
      <DefaultButton
        v-else
        style="margin-bottom: var(--spacing-xs); align-self: start"
        label="Сменить аккаунт"
        @click="handleLogout"
      />

      <div>
        <p class="subtitle" style="margin-top: var(--spacing-xs)">Ввести промокод</p>
        <div class="row" style="gap: var(--spacing-xs); margin-top: var(--spacing-sm)">
          <InputComponent
            :modelValue="promo"
            type="text"
            class="link-input"
            @update:model-value="promo = $event"
          />
          <FancyButtonComponent label="Применить" @click="applyPromo" />
        </div>
      </div>
      <div>
        <q-expansion-item v-model="open" style="margin-top: var(--spacing-xs)">
          <template v-slot:header>
            <p class="subtitle">Приобрести подписку</p>
          </template>
          <div class="containers row no-wrap" style="gap: var(--spacing-xs)">
            <SubComponent v-for="(sub, key) in subs" :subs="subs" :key="key" :chosenSub="key" />
          </div>
        </q-expansion-item>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useContent from 'src/api/composables/useContent'
import useProfile from 'src/api/composables/useProfile'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import boltIcon from 'src/assets/icons/energy.svg'
import InputComponent from 'src/components/InputComponent.vue'
import usePayment from 'src/api/composables/usePayment'
import DefaultButton from 'src/components/DefaultButton.vue'
import SubComponent from 'src/components/SubComponent.vue'
import Cookies from 'js-cookie'
import useTariffs from 'src/api/composables/useTariffs'

const { getMe } = useProfile()
const router = useRouter()
const loading = ref(false)

const open = ref(true)

const me = ref()

const promo = ref('')

const { getRates } = useTariffs()

const subs = ref({
  '1': {
    title: 'Пробный тариф',
    days: '7',
    gens: '6',
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '1',
  },
  '2': {
    title: 'Старт',
    days: '30',
    gens: '14',
    desc: 'создание фото, создание текста поста',
    cost: '690',
  },
  '3': {
    title: 'Прорыв',
    days: '30',
    gens: '28',
    desc: 'создание фото, создание текста поста, контент-план',
    cost: '1590',
  },
  '4': {
    title: 'Мастер',
    days: '30',
    gens: '40',
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '2490',
  },
})

const { apiUsePromocode, apiCreatePayment, apiDisableAutoPayment } = usePayment()

const applyPromo = () => {
  apiUsePromocode(promo.value).then((res) => {
    if (res) {
      load()
      promo.value = ''
      getRates().then((res) => {
        subs.value = {}
        res!.forEach((tariff) => {
          subs.value[tariff.tariff_id] = { ...tariff }
        })
      })
      //   navigateTo('/profile')
    }
  })
}

const createPayment = (key: string) => {
  apiCreatePayment(parseInt(key)).then((res) => {
    if (res) {
      res.confirmation_url && window.open(res.confirmation_url)
      //   navigateTo('/profile')
    }
  })
}

const handleLogout = () => {
  Cookies.remove('refresh_token')
  Cookies.remove('atoken')
  navigateTo('/login')
}

const handleDisableAutoPayment = () => {
  apiDisableAutoPayment().then(() => {
    load()
  })
}

const load = () => {
  getMe()
    .then((res) => {
      me.value = res
      if (me.value.tarrif !== 0) {
        open.value = false
      }
    })
    .finally(() => {
      loading.value = false
    })
}

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  loading.value = true
  load()
  getRates().then((res) => {
    subs.value = {}
    res!.forEach((tariff) => {
      subs.value[tariff.tariff_id] = { ...tariff }
    })
  })
})
</script>

<style lang="scss" scoped>
.q-expansion-item ::v-deep .q-item {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: fit-content;
}

.q-expansion-item ::v-deep .q-item:hover {
  background-color: transparent !important; // doesnt work damn
}
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);

  .subtitle {
    margin-bottom: 0;
    margin-top: 2px;
    // padding-left: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  .loading {
    margin-top: var(--spacing-lg);
    margin-bottom: var(--spacing-sm);
    margin-left: 50%;
    transform: translateX(-50%);
    color: #684485;
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

  .containers {
    margin: 20px 0;
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
    margin-top: var(--spacing-sm);
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
      margin-bottom: var(--spacing-xxs);
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

    .containers {
      display: grid !important;
      grid-template-columns: repeat(1, 1fr);
      margin-bottom: var(--spacing-lg);
      justify-items: center;
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
    .subtitle {
      margin-top: 6px;
    }
  }
}
</style>

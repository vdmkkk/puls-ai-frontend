<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Приобрести подписку</p>
      </div>
      <div v-if="me?.days_left > 0">
        <p class="subtitle">Текущая подписка</p>
        <div class="container">
          <p class="title">{{ subs[me?.tariff]?.title }}</p>
          <p class="description">
            осталось
            {{ me?.gen_point_amount }}/{{ subs[me?.tariff]?.gens }}
            <img style="vertical-align: sub" :src="boltIcon" /> генераций
          </p>
          <p class="description">осталось {{ me?.days_left }} дней подписки</p>
        </div>
        <DefaultButton
          style="margin-top: var(--spacing-xs)"
          label="Перейти в профиль"
          @click="navigateTo('/profile')"
        />
      </div>
      <div>
        <p class="subtitle">Ввести промокод</p>
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
        <p class="subtitle">Выбранная подписка</p>
        <div class="containers row no-wrap" style="gap: var(--spacing-xs)">
          <SubComponent :chosenSub="chosenSub" />
        </div>
        <DefaultButton
          style="margin-top: var(--spacing-xs)"
          label="Все тарифы"
          @click="navigateTo('/subscription')"
        />
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
import Cookies from 'js-cookie'
import SubComponent from 'src/components/SubComponent.vue'

const { getMe } = useProfile()
const router = useRouter()
const loading = ref(false)
const chosenSub = ref('2')

const me = ref()

const promo = ref('')

const subs = {
  '2': {
    title: 'Старт',
    days: '30',
    gens: '14',
    desc: 'создание фото, создание текста поста',
    cost: '990',
  },
  '3': {
    title: 'Прорыв',
    days: '30',
    gens: '28',
    desc: 'создание фото, создание текста поста, контент-план',
    cost: '2490',
  },
  '4': {
    title: 'Мастер',
    days: '30',
    gens: '40',
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '3990',
  },
  '1': {
    title: 'Пробный тариф',
    days: '7',
    gens: '6',
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '1',
  },
}

const { apiUsePromocode, apiCreatePayment } = usePayment()

const applyPromo = () => {
  apiUsePromocode(promo.value).then((res) => {
    if (res) {
      load()
      promo.value = ''
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

onMounted(() => {
  const sub = Cookies.get('sub')
  if (sub) {
    chosenSub.value = sub
    Cookies.remove('sub')
  } else {
    navigateTo('/subscription')
  }
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

  .subtitle {
    margin-bottom: 0;
    margin-top: var(--spacing-xs);
    // padding-left: var(--spacing-xxs);
    font-size: var(--font-size-sm);
    font-weight: 500;
    margin-bottom: 6px;
  }

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
  }
}
</style>

<template>
  <q-layout view="lHh lpR fFf">
    <q-header elevated>
      <q-toolbar
        style="background-color: #1e1e29"
        :class="$q.screen.xs ? 'justify-between' : 'justify-end'"
      >
        <q-btn
          v-if="$q.screen.xs"
          flat
          round
          dense
          icon="menu"
          class="q-mr-sm"
          @click="toggleLeftDrawer"
        />

        <div class="actions" style="justify-self: flex-end">
          <q-icon v-if="!loading" name="bolt" style="scale: 1.3" /> {{ me?.gen_point_amount }}
          <q-spinner-puff v-if="loading" color="primary" size="10px" />
        </div>
        <!-- <q-btn @click="navigateTo('profile')" flat round dense icon="person" /> -->
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above style="background-color: #2a2a32">
      <!-- <a class="drawer-title">Меню</a> -->

      <div class="row drawer-title">
        <q-avatar square>
          <img :src="logo" />
        </q-avatar>

        <a class="title">puls.</a>
      </div>

      <q-list>
        <template v-for="(menuItem, index) in links" :key="index">
          <q-item
            clickable
            v-ripple
            :class="{ 'menu-item': true, active: isActive(menuItem.to) }"
            :disable="menuItem.disabled"
            @click="navigateTo(menuItem.to)"
          >
            <q-item-section avatar>
              <img :src="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.name }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="app">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// @ts-nocheck //
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import mane from 'src/assets/icons/mane.svg'
import plan from 'src/assets/icons/plan.svg'
import text from 'src/assets/icons/text.svg'
import image2 from 'src/assets/icons/image2.svg'
import autoposting from 'src/assets/icons/autoposting.svg'
import profile from 'src/assets/icons/profile.svg'
import projects from 'src/assets/icons/projects.svg'
import logo from 'src/assets/svg/logo.svg'
import useProfile from 'src/api/composables/useProfile'
import { useErrorStore } from 'src/stores/error-store'

const router = useRouter()
const store = useErrorStore()

const navigateTo = (path: string) => {
  router.push(path)
}

const me = ref()
const leftDrawerOpen = ref(false)

const links = computed(() => [
  {
    name: 'Главная',
    to: '/',
    icon: mane,
    disabled: false,
  },
  {
    name: 'Контент-план',
    to: '/content-plan',
    icon: plan,
    disabled: me.value?.tariff != 4 && me.value?.tariff != 3 && me.value?.tariff != 1,
  },
  {
    name: 'Авторские темы',
    to: '/texts',
    icon: text,
    disabled: false,
  },
  // {
  //   name: 'Изображения',
  //   to: 'images',
  //   icon: image2,
  // },
  {
    name: 'Автопостинг',
    to: '/posting',
    icon: autoposting,
    disabled: me.value?.tariff != 4 && me.value?.tariff != 1,
  },
  {
    name: 'Профиль',
    to: '/profile',
    icon: profile,
    disabled: false,
  },
])

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const isActive = (to: string) => {
  console.log(router.currentRoute.value.path, to)
  return (
    (router.currentRoute.value.path.includes(to) && to != '/') ||
    (to == '/' && router.currentRoute.value.path == '/')
  )
}

const { getMe } = useProfile()
const loading = ref(false)

const load = () => {
  getMe()
    .then((res) => {
      me.value = res
      if (res?.days_left == 0) {
        router.push('/subscription')
      }
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  loading.value = true
  load()
})

watch(
  () => store.genCounter,
  () => {
    load()
  },
  { deep: true },
)

onMounted(() => {
  const jwt = Cookies.get('refresh_token')
  // console.log()
  if (!jwt) {
    router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
.app {
  background-color: #12121b;
  height: 100%;
}

.active {
  background-color: rgba(255, 255, 255, 0.05);
}

.actions {
  background-color: #323253;
  padding: 10px;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 10px;
  margin-right: 10px;
}

.menu-item {
  color: white;
  width: 80%;
  margin-left: 10%;
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-xxs);
  border-radius: 10px;
  font-weight: 500;
}

.drawer-title {
  img {
    height: var(--font-size-lg) !important;
    width: var(--font-size-lg) !important;
  }

  .title {
    font-size: var(--font-size-md);
    margin-top: auto;
    margin-bottom: auto;
    font-weight: 400;
    color: white;
  }

  margin-left: 10%;
  padding-top: var(--spacing-sm);
  padding-bottom: var(--spacing-sm);
}

@media screen and (max-width: 576px) {
  .menu-item {
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-sm);
  }
}
</style>

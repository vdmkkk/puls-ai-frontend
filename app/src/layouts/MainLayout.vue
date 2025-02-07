<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar style="background-color: #1e1e29">
        <q-btn flat round dense icon="menu" class="q-mr-sm" @click="toggleLeftDrawer" />
        <q-avatar square>
          <img src="/src/assets/svg/logo.svg" />
        </q-avatar>

        <q-toolbar-title>puls.</q-toolbar-title>
        <div class="actions"><q-icon name="bolt" style="scale: 1.3" /> 10</div>
        <q-btn flat round dense icon="person" />
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above style="background-color: #2d2d37">
      <!-- <a class="drawer-title">Меню</a> -->
      <q-list>
        <template v-for="(menuItem, index) in links" :key="index">
          <q-item clickable v-ripple class="menu-item" @click="navigateTo(menuItem.to)">
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>
            <q-item-section>
              {{ menuItem.name }}
            </q-item-section>
          </q-item>
          <q-separator style="height: 2px" v-if="index != links.length - 1" />
        </template>
      </q-list>
    </q-drawer>

    <q-page-container class="app">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

const leftDrawerOpen = ref(false)

const links = [
  {
    name: 'Главная',
    to: '',
    icon: 'school',
  },
  {
    name: 'Контент-план',
    to: 'content-plan',
    icon: 'event_available',
  },
  {
    name: 'Тексты вне контент-плана',
    to: 'texts',
    icon: 'edit_note',
  },
  {
    name: 'Изображения',
    to: 'images',
    icon: 'image',
  },
  {
    name: 'Автопостинг',
    to: 'posting',
    icon: 'schedule_send',
  },
  {
    name: 'Проекты',
    to: 'projects',
    icon: 'folder',
  },
]

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

onMounted(() => {
  const jwt = Cookies.get('jwtToken')
  if (!jwt) {
    router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
.app {
  background-color: #12121b;
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
  height: 70px;
}

.drawer-title {
  font-size: 24px;
  color: white;
  margin: 0;
  text-align: center;
  width: 100%;
  display: block;
  padding-top: 10px;
  padding-bottom: 20px;
}
</style>

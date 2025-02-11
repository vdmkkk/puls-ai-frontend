<template>
  <q-layout>
    <q-page-container class="app">
      <BlobComponent />
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// @ts-nocheck //
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'
import BlobComponent from 'src/components/BlobComponent.vue'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  const jwt = Cookies.get('jwtToken')
  if (jwt) {
    router.push('/')
  }
})
</script>

<style lang="scss">
.app {
  height: 100vh;
}
</style>

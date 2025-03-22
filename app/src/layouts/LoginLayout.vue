<template>
  <q-layout>
    <q-page-container class="app">
      <!-- <BlobComponent /> -->
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
  const jwt = Cookies.get('refresh_token')
  if (jwt) {
    router.push('/')
  }
})
</script>

<style scoped lang="scss">
.app {
  height: 100%;
  background-color: #12121b;
}
</style>

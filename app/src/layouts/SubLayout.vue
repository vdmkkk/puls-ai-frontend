<template>
  <q-layout>
    <q-page-container class="app">
      <!-- <BlobComponent /> -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()

onMounted(() => {
  const jwt = Cookies.get('refresh_token')
  // console.log()
  if (!jwt) {
    router.push('/login')
  }
  const sub = Cookies.get('sub')
  if (sub) {
    router.push('/cart')
  }
})
</script>

<style scoped lang="scss">
.app {
  height: 100%;
  background-color: #12121b;
}
</style>

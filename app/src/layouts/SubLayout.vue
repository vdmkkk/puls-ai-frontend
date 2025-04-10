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
import { useRoute, useRouter } from 'vue-router'
import Cookies from 'js-cookie'

const router = useRouter()
const route = useRoute()

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
  const subParam = route.query.sub
  if (subParam) {
    Cookies.set('sub', String(subParam))
  }
})
</script>

<style scoped lang="scss">
.app {
  height: 100%;
  background-color: #12121b;
}
</style>

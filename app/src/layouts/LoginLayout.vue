<template>
  <q-page-container>
    <router-view />
  </q-page-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Cookies from 'js-cookie'

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

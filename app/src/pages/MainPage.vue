<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Профиль</p>
        <p class="name">{{ me?.first_name }} {{ me?.last_name }}</p>
        <p class="description">
          {{ me?.email }}
        </p>
      </div>
      <DefaultButton label="Сменить пароль" style="align-self: flex-start" />
      <div>
        <p>Прорыв</p>
        <p>45 генераций</p>
        <p>Управлять подпиской <img :src="arrowRight" /></p>
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
import arrowRight from 'src/assets/icons/arrow_right.svg'

const { getMe } = useProfile()
const router = useRouter()
const loading = ref(false)

const me = ref()

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

    .name {
      padding-top: var(--spacing-sm);
      font-size: var(--font-size-md);
      font-weight: 500;
      margin: 0;
    }
  }
  .containers {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-xs);

    .date {
      padding-top: var(--spacing-xs);
      padding-bottom: var(--spacing-xxs);
      margin-bottom: 0;
    }
  }
}
</style>

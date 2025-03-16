<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <div class="column header">
        <p class="title">Контент-план</p>
        <p class="description">
          Здесь вы можете автоматически создать шесть уникальных постов на разные темы в рамках
          единого контент-плана. Каждый пост можно легко отредактировать вручную, дополнить
          изображением или полностью изменить тему по вашему желанию.
        </p>
        <FancyButtonComponent
          label="Создать"
          style="
            margin-top: var(--spacing-sm);
            margin-bottom: var(--spacing-sm);
            align-self: self-start;
          "
          @click="create"
        />
      </div>
      <!-- <p class="title">Контент-план</p>
      <p class="subtitle">
        Здесь вы можете автоматически создать шесть уникальных постов на разные темы в рамках
        единого контент-плана. Каждый пост можно легко отредактировать вручную, дополнить
        изображением или полностью изменить тему по вашему желанию.
      </p> -->
      <div v-if="loading">
        <q-spinner-puff class="loading" size="50px" />
      </div>
      <div v-else class="containers">
        <ContainerComponent
          v-for="plan in contentPlan"
          class="container"
          :text="`Неделя ${plan.week_id}`"
          @click="navigateTo(`/content-plan/${plan.week_id}`)"
        >
          <p class="date description">Дата создания: {{ plan.created_at }}</p>
        </ContainerComponent>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import useContent from 'src/api/composables/useContent'
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { apiGetContentPlan, apiCreateContentPlan } = useContent()
const router = useRouter()
const loading = ref(false)

const contentPlan = ref([])

const getContentPlan = () => {
  apiGetContentPlan()
    .then((res) => {
      contentPlan.value = res.toSorted((a, b) => {
        return b.week_id - a.week_id
      })
    })
    .finally(() => {
      loading.value = false
    })
}

const navigateTo = (path: string) => {
  router.push(path)
}

const create = () => {
  loading.value = true
  apiCreateContentPlan()
    .then(() => {
      getContentPlan()
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  loading.value = true
  getContentPlan()
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
    font-weight: 500;
    color: #b8b8b8;
  }

  .header {
    margin-top: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    margin-right: var(--spacing-sm);
    align-items: start;
    .title {
      font-size: var(--font-size-title);
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

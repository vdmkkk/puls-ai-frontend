<template>
  <q-page style="color: white" class="column justify-between">
    <div class="column no-wrap app">
      <a class="title">Привет, Артем! 👋</a>
      <a class="email">pluzhnikov.artem2005@gmail.com</a>
      <div class="row projects">
        <q-select
          v-model="chosenProject"
          :options="projectOptions"
          label="Активный проект"
          dark
          filled
          style="width: 200px"
          color="blue-grey-4"
        >
          <template v-slot:selected>
            {{ chosenProject?.label }}
          </template>
        </q-select>
        <q-btn
          no-caps
          flat
          label="Управлять проектами"
          icon-right="trending_flat"
          style="color: #6262ad"
        />
      </div>
      <div class="rates">
        <a class="title">Ваш тарифный план</a>
        <div class="rate">
          <a class="title">30 текстов, 1 проект</a>
          <a class="description">Подписка с автоматическим продлением</a>
        </div>
      </div>
      <div class="restrictions">
        <a class="title">Возможности вашей подписки</a>
        <a style="margin-top: 6px" class="description"
          >Каждый месяц у вас есть возможность сгенерировать до 30 текстов или иллюстраций.</a
        >
        <a class="description"
          >Подписка закончится через <span style="font-weight: 800">20</span> дней</a
        >
      </div>
    </div>

    <div class="row justify-between buttons" style="gap: 12px; width: fit-content">
      <q-btn
        label="Управлять подпиской"
        icon="open_in_new"
        flat
        no-caps
        style="border: 2px solid #6262ad; color: #6262ad"
      />
      <q-btn label="Выйти" icon="logout" color="red" flat no-caps @click="handlerLogout" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'

const router = useRouter()

const projectOptions = [
  { value: { id: 1, name: 'Проект 1' }, label: 'Проект 1' },
  { value: { id: 2, name: 'Проект 2' }, label: 'Проект 2' },
  { value: { id: 3, name: 'Проект 3' }, label: 'Проект 3' },
]

const chosenProject = ref(projectOptions[0])

const handlerLogout = () => {
  Cookies.remove('jwtToken')
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.app {
  padding-left: 7%;
  padding-right: 7%;
  padding-top: 50px;
  .title {
    font-size: 40px;
    font-weight: 400;
  }
  .email {
    font-size: 14px;
    margin-top: 6px;
    font-weight: 500;
  }

  .projects {
    margin-top: 60px;
    gap: 10px;
  }

  .rates {
    margin-top: 60px;

    .title {
      font-size: 30px;
      font-weight: 500;
    }
    .rate {
      margin-top: 30px;
      border: 2px solid #323249;

      border-radius: 12px;
      display: flex;
      flex-direction: column;
      padding: 20px;
      padding-bottom: 26px;
      padding-top: 26px;
      gap: 6px;
      width: 40%;
      .title {
        font-size: 22px;
        font-weight: 500;
      }
      .description {
        font-size: 14px;
        font-weight: 400;
      }
    }
  }

  .restrictions {
    margin-top: 60px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .title {
      font-size: 30px;
      font-weight: 500;
    }

    .description {
      font-size: 14px;
      font-weight: 400;
    }
  }

  .buttons {
    padding-left: 7%;
    padding-right: 7%;
    margin-bottom: 40px;
  }
}
</style>

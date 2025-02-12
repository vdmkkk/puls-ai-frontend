<template>
  <BlobComponent />
  <q-page style="color: white" class="column justify-between">
    <div class="app">
      <p class="title">Контент-план</p>
      <FancyButtonComponent
        label="Сгенерировать контент-план"
        style="margin-top: 30px; margin-bottom: 90px"
      />
      <div class="containers">
        <ContainerComponent class="container" text="Название поста 1">
          <p>Текст поста 1</p>
        </ContainerComponent>
        <ContainerComponent class="container" text="Название поста 2">
          <p>Текст поста 2</p>
        </ContainerComponent>
        <ContainerComponent class="container" text="Название поста 3">
          <p>Текст поста 3</p>
        </ContainerComponent>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import BlobComponent from 'src/components/BlobComponent.vue'
import ContainerComponent from 'src/components/ContainerComponent.vue'
import FancyButtonComponent from 'src/components/FancyButtonComponent.vue'
</script>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20vw;
  padding-right: 20vw;

  .title {
    font-size: var(--font-size-title);
    font-weight: 600;
    text-align: center;
    margin-top: 100px;
  }

  .containers {
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: row;
    justify-content: start;
    gap: 30px;
    .container {
      width: -webkit-fill-available;
    }
  }
}
</style>

<template>
  <div class="card-container">
    <!-- Header (title + gens) -->
    <div class="card-header">
      <p class="title">{{ subs[chosenSub]?.title }}</p>
      <p class="gens">
        {{ subs[chosenSub]?.gens }}
        <img :src="boltIcon" alt="bolt icon" /> генераций
      </p>
      <ul class="feature-list">
        <li v-for="(feature, index) in subs[chosenSub]?.desc.split(', ')" :key="index">
          {{ feature }}
        </li>
      </ul>
    </div>

    <!-- Bullet list of features -->
    <!-- We split the comma-separated string into an array -->

    <!-- Pricing + button -->
    <div class="card-footer">
      <!-- Price row -->
      <div class="price-row">
        <span class="new-price"> {{ subs[chosenSub]?.cost }} ₽/мес </span>
        <!-- Display oldCost only if it exists (Мастер plan, etc.) -->
        <span v-if="subs[chosenSub]?.oldCost" class="old-price">
          {{ subs[chosenSub]?.oldCost }} ₽/мес
        </span>
      </div>

      <!-- Button -->
      <!-- You can keep the dynamic cost label, or set a static label like "Получить" -->
      <DefaultButton class="default-btn" label="Купить" @click="createPayment(chosenSub)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import usePayment from 'src/api/composables/usePayment'
import boltIcon from 'src/assets/icons/energy.svg'
import DefaultButton from './DefaultButton.vue'

const { chosenSub } = defineProps<{
  chosenSub: string
}>()

const subs = {
  '1': {
    title: 'Пробный тариф',
    days: '7',
    gens: '6',
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '1', // No oldCost => no strike-through
  },
  '2': {
    title: 'Старт',
    days: '30',
    gens: '14',
    // Keep desc a comma-separated string
    desc: 'создание фото, создание текста поста',
    cost: '690', // No oldCost => no strike-through,
    oldCost: '990', // Old price to display as strikethrough
  },
  '3': {
    title: 'Прорыв',
    days: '30',
    gens: '28',
    desc: 'создание фото, создание текста поста, контент-план',
    cost: '1590', // No oldCost => no strike-through
    oldCost: '2490', // Old price to display as strikethrough
  },
  '4': {
    title: 'Мастер',
    days: '30',
    gens: '40',
    // We’ll split these into bullet points in the template
    desc: 'создание фото, создание текста поста, контент-план, автопостинг',
    cost: '2490', // New discounted price
    oldCost: '3990', // Old price to display as strikethrough
  },
}

const { apiCreatePayment } = usePayment()

const createPayment = (key: string) => {
  apiCreatePayment(parseInt(key)).then((res) => {
    if (res) {
      res.confirmation_url && window.open(res.confirmation_url)
      //   navigateTo('/profile')
    }
  })
}
</script>

<style scoped lang="scss">
.card-container {
  width: 320px;
  background-color: rgba(32, 32, 41, 0.7);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header Section: Title & Gens */
.card-header {
  margin-bottom: 16px;

  .title {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 8px;
    text-align: center;
  }

  .gens {
    font-size: 16px;
    font-weight: 400;
    color: #fff;
    text-align: center;
    background-color: #36454c;
    padding-top: var(--spacing-xxs);
    padding-bottom: var(--spacing-xxs);
    width: 100%;
    border-radius: 10px;

    img {
      width: 24px;
      height: 24px;
      padding-bottom: 5px;
      margin: 0;
      vertical-align: middle;
    }
  }
}

/* Feature List (bullet points) */
.feature-list {
  list-style: none;
  margin: 0;
  padding: 0;
  margin-bottom: 24px;

  li {
    position: relative;
    padding-left: 20px;
    font-size: 14px;
    color: #bdbdbd;
    line-height: 1.5;
    margin-bottom: 8px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 7px; /* tweak as needed to vertically center the bullet */
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #8c93fe;
    }
  }
}

/* Footer Section: Pricing + Button */
.card-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .price-row {
    margin-bottom: 16px; /* space between prices and the button */
    display: flex;
    align-items: baseline;
    gap: 12px; /* space between new price and old price */
    align-self: center;

    .new-price {
      font-size: 20px;
      font-weight: 600;
      color: #8c93fe;
    }
    .old-price {
      font-size: 14px;
      color: #bdbdbd;
      text-decoration: line-through;
    }
  }

  .default-btn {
    // width: 100%;
    align-self: center;
    margin-top: var(--spacing-xxs);
    // text-align: center;
  }
}
</style>

<template>
    <div class="cards-container">
      <div class="cards-grid">
        <CardComponent
          v-for="(card, index) in cards"
          :key="index"
          :image-url="card.imageUrl"
          :title="card.title"
          :button-text="card.buttonText"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import CardComponent from './CardComponent.vue';
  
  export default {
    components: {
      CardComponent
    },
    setup() {
      const cards = ref([])
  
      onMounted(async () => {
        const [caseCouple, case4, case5, caseKpop] = await Promise.all([
          import('@/image/casing/Couple Case.jpg'),
          import('@/image/casing/case4.jpg'),
          import('@/image/casing/case5.jpg'),
          import('@/image/casing/case_kpop-removebg-preview.png'),
        ])
  
        cards.value = [
          {
            imageUrl: case5.default,
            title: 'Custom',
            buttonText: 'Lihat >>'
          },
          {
            imageUrl: case4.default,
            title: 'Anime',
            buttonText: 'Lihat >>'
          },
          {
            imageUrl: caseKpop.default,
            title: 'KPOP',
            buttonText: 'Lihat >>'
          },
          {
            imageUrl: caseCouple.default,
            title: 'Couple',
            buttonText: 'Lihat >>'
          },
        ]
      })
  
      return { cards }
    }
  }
  </script>
  
  <style scoped>
  .cards-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .cards-grid {
    display: grid;
    gap: 20px;
    justify-content: center;
  }
  
  @media (min-width: 768px) {
    .cards-grid {
      grid-template-columns: repeat(2, minmax(250px, 1fr));
    }
  }
  
  @media (min-width: 1024px) {
    .cards-grid {
      grid-template-columns: repeat(3, minmax(250px, 1fr));
    }
  
    .cards-grid > *:nth-child(4):last-child {
      grid-column: 2;
    }
  }
  </style>
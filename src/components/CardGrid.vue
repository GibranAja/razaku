<template>
  <div class="cards-container">
    <div class="cards-grid" v-if="!isLoading">
      <CardComponent
        v-for="card in themeData"
        :key="card.id"
        :image-url="card.imageBase64"
        :title="card.name"
      />
    </div>
    <div v-else class="loader"></div>

    <div v-if="hasMore && !isLoading" class="load-more">
      <button @click="loadMoreThemes">Load More</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useThemeStore } from '@/store/ThemeStore'
import CardComponent from './CardComponent.vue'

// Use the theme store
const themeStore = useThemeStore()

// Destructure store properties with computed for reactivity
const themeData = computed(() => themeStore.themeData)
const isLoading = computed(() => themeStore.isLoading)
const hasMore = computed(() => themeStore.hasMore)

// Fetch initial themes on component mount
onMounted(() => {
  themeStore.fetchThemes()
})

// Method to load more themes
const loadMoreThemes = () => {
  themeStore.fetchThemes()
}
</script>

<style scoped>
.cards-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative; /* Tambahkan ini */
  min-height: 30px; /* Opsional, untuk memastikan ruang untuk loader */
}

.cards-grid {
  display: grid;
  gap: 20px;
  justify-content: center;
}

.loading,
.load-more {
  text-align: center;
  margin-top: 20px;
}

/* HTML: <div class="loader"></div> */
.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  display: flex;
  align-items: flex-start;
  aspect-ratio: 1;
}
.loader:before,
.loader:after {
  content: '';
  flex: 1;
  aspect-ratio: 1;
  --g: conic-gradient(from -90deg at 10px 10px, #000 90deg, #0000 0);
  background: var(--g), var(--g), var(--g);
  filter: drop-shadow(30px 30px 0 #000);
  animation: l20 1s infinite;
}
.loader:after {
  transform: scaleX(-1);
}
@keyframes l20 {
  0% {
    background-position:
      0 0,
      10px 10px,
      20px 20px;
  }
  33% {
    background-position: 10px 10px;
  }
  66% {
    background-position:
      0 20px,
      10px 10px,
      20px 0;
  }
  100% {
    background-position:
      0 0,
      10px 10px,
      20px 20px;
  }
}

.load-more button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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

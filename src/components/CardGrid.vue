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

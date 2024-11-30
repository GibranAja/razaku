<template>
  <div class="case-category-container">
    <h1>{{ category }} Cases</h1>
    <div class="casings-grid">
      <CasingCard 
        v-for="casing in filteredCasings" 
        :key="casing.id" 
        :casing="casing"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useCasingStore } from '@/store/CasingStore'
import CasingCard from '@/components/CasingCard.vue'

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const casingStore = useCasingStore()

// Computed property to filter casings based on the theme
const filteredCasings = computed(() => {
  // If the category is a theme, filter casings by that theme
  return casingStore.casingData.filter(casing => 
    casing.themes.some(theme => 
      theme.toLowerCase() === props.category.toLowerCase()
    )
  )
})

// Fetch casings when component is mounted
onMounted(async () => {
  // Reset any previous data and fetch fresh
  await casingStore.resetStore()
  await casingStore.fetchCasings(50) // Fetch more items to ensure we get all casings
})
</script>

<style scoped>
.case-category-container {
  padding: 20px;
}

.casings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
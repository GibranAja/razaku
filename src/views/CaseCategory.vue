<template>
  <div class="page-wrapper">
    <NavbarComponent />
    
    <div class="case-category-container">
      <!-- Show loader while loading -->
      <div v-if="isLoading" class="loader-container">
        <div class="loader"></div>
      </div>

      <!-- Show content when loaded -->
      <template v-else>
        <h1 class="judul">{{ category }} Cases</h1>
        
        <!-- No casings message -->
        <div v-if="filteredCasings.length === 0" class="no-casings-message">
          No Casings in this theme
        </div>
        
        <div v-else class="casings-grid">
          <CasingCard 
            v-for="casing in filteredCasings" 
            :key="casing.id" 
            :casing="casing"
          />
        </div>
      </template>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useCasingStore } from '@/store/CasingStore'
import { useThemeStore } from '@/store/ThemeStore'
import CasingCard from '@/components/CasingCard.vue'
import FooterComponent from '@/components/FooterComponent.vue';
import NavbarComponent from '@/components/NavbarComponent.vue';

const props = defineProps({
  category: {
    type: String,
    required: true
  }
})

const casingStore = useCasingStore()
const themeStore = useThemeStore()
const isLoading = ref(true)
const themes = ref({})

// Fetch theme data and create a mapping
const loadThemes = async () => {
  try {
    isLoading.value = true
    await themeStore.fetchThemes(50)
    themeStore.themeData.forEach(theme => {
      themes.value[theme.id] = theme.name
    })
    await casingStore.resetStore()
    await casingStore.fetchCasings(50)
  } finally {
    isLoading.value = false
  }
}


const filteredCasings = computed(() => {
  return casingStore.casingData.filter(casing => 
    casing.themes?.some(themeId => 
      themes.value[themeId]?.toLowerCase() === props.category.toLowerCase()
    )
  )
})

onMounted(async () => {
  window.scrollTo(0, 0)
  await loadThemes()
  await casingStore.resetStore()
  await casingStore.fetchCasings(50)
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

.judul {
  margin-top: 7rem;
  margin-bottom: 2rem;
}

.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.case-category-container {
  flex: 1;
  padding: 20px;
}

.no-casings-message {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  margin: 40px 0;
}
</style>
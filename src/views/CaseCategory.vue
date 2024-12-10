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
        
        <div v-else class="cards-grid">

          <ModalDetailCasing 
            :show="showModal"
            :casing="selectedCasing"
            @close="closeModal"
            v-if="selectedCasing"
          />

          <CasingCard 
            v-for="casing in filteredCasings" 
            :key="casing.id" 
            :casing="casing"
            @click="openModal(casing)"
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
import ModalDetailCasing from '@/components/ModalDetailCasing.vue';

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
const showModal = ref(false)
const selectedCasing = ref(null)

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

const openModal = (casing) => {
  selectedCasing.value = casing
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
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

.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2 columns for mobile */
  gap: 8px; /* Small gap for mobile */
  padding: 8px;
}

/* Tablet */
@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
    gap: 16px;
    padding: 16px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(4, 1fr); /* 4 columns */
    gap: 24px;
    padding: 24px;
  }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .cards-grid {
    grid-template-columns: repeat(5, 1fr); /* 5 columns */
    max-width: 1400px;
    margin: 0 auto;
  }
}
</style>
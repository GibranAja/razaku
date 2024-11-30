<template>
  <div class="casing-catalog-container">
    <div class="catalog-header">
      <h1 class="gradient-text">Casing Catalog</h1>
      <div class="header-actions">
        <button @click="openCreateModal" class="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
          Add New Casing
        </button>
        <div class="search-sort-wrapper">
          <div class="search-container">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search casings..." 
              class="search-input"
              @input="filterCasings"
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <select v-model="sortOption" @change="sortCasings" class="sort-select">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modal and other existing sections remain the same -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="closeCreateModal">
      <div class="modal-content card-elevated" @click.stop>
        <button class="modal-close" @click="closeCreateModal">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <CreateCasingComponent 
          :initial-data="editingCasing" 
          @submit="handleModalSubmit"
        />
      </div>
    </div>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Loading Casings...</p>
    </div>

    <!-- Casing Grid -->
    <div v-else-if="displayedCasings.length" class="casing-grid">
      <div 
        v-for="item in displayedCasings" 
        :key="item.id" 
        class="casing-card card-hover"
      >
        <div class="card-image-container">
          <img 
            :src="item.imageBase64" 
            :alt="item.name" 
            class="card-image" 
            @error="handleImageError"
          />
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.name }}</h3>
          <p class="card-description">{{ item.description }}</p>

          <div class="card-pricing">
            <div class="price-container">
              <p v-if="item.discount > 0" class="original-price">
                Rp {{ item.price.toLocaleString() }}
              </p>
              <p class="final-price">Rp {{ item.finalPrice.toLocaleString() }}</p>
              <span v-if="item.discount > 0" class="discount-badge">
                {{ item.discount }}% OFF
              </span>
            </div>

            <div class="card-actions">
              <button 
                @click="editCasing(item)" 
                class="action-btn edit-btn" 
                title="Edit"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button 
                @click="deleteCasing(item.id)" 
                class="action-btn delete-btn" 
                title="Delete"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state card-elevated">
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
        <line x1="7" y1="7" x2="7.01" y2="7"></line>
      </svg>
      <p>No casings found. Add your first casing!</p>
      <button @click="openCreateModal" class="btn-secondary">
        Add Casing
      </button>
    </div>

    <!-- Load More -->
    <div v-if="hasMore && !isLoading" class="load-more-container">
      <button 
        @click="loadMoreCasings" 
        class="btn-outline"
      >
        Load More Casings
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCasingStore } from '@/store/CasingStore'
import CreateCasingComponent from '@/components/admin/CreateCasingComponent.vue'

// Store and Refs
const casingStore = useCasingStore()
const { 
  casingData, 
  isLoading, 
  hasMore 
} = storeToRefs(casingStore)

const { 
  fetchCasings, 
  deleteHandling 
} = casingStore

// Modal and Editing State
const showCreateModal = ref(false)
const editingCasing = ref(null)

// Search and Sort
const searchQuery = ref('')
const sortOption = ref('newest')
const displayedCasings = computed(() => {
  let results = casingData.value

  // Search Filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    results = results.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    )
  }

  // Sort Logic
  switch(sortOption.value) {
    case 'price-low':
      return results.sort((a, b) => a.finalPrice - b.finalPrice)
    case 'price-high':
      return results.sort((a, b) => b.finalPrice - a.finalPrice)
    case 'discount':
      return results.sort((a, b) => b.discount - a.discount)
    default:
      return results.sort((a, b) => b.createdAt - a.createdAt)
  }
})

// Methods
const loadMoreCasings = () => {
  if (!isLoading.value && hasMore.value) {
    fetchCasings()
  }
}

const openCreateModal = () => {
  editingCasing.value = null
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const editCasing = (item) => {
  editingCasing.value = { ...item }
  showCreateModal.value = true
}

const deleteCasing = (id) => {
  if (confirm('Are you sure you want to delete this casing?')) {
    deleteHandling(id)
  }
}

const handleModalSubmit = () => {
  closeCreateModal();
  fetchCasings(10, true);
};

const handleImageError = (event) => {
  event.target.src = '/path/to/default/image.png' // Fallback image
}

const filterCasings = () => {
  // Trigger computed property
}

const sortCasings = () => {
  // Trigger computed property
}

// Lifecycle Hooks
onMounted(async () => {
  await fetchCasings(10, true)
})

onUnmounted(() => {
  // Optional: Reset store state if needed
  casingStore.resetStore()
})
</script>

<style scoped>
:root {
  --primary-color: #3B82F6;
  --secondary-color: #10B981;
  --background-color: #F3F4F6;
  --text-primary: #1F2937;
  --text-secondary: #6B7280;
  --card-background: #FFFFFF;
  --border-color: #E5E7EB;
}

* {
  box-sizing: border-box;
  transition: all 0.3s ease;
}

body {
  background-color: var(--background-color);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.casing-catalog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--primary-color);
}

.gradient-text {
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  background-clip: var(--primary-color-color);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 2.5rem;
  font-weight: 800;
}

.catalog-header {
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #3B82F6;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  cursor: pointer;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 20px -4px rgba(59, 130, 246, 0.4);
}

.search-sort-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  width: 250px;
  background-color: white;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
}

.sort-select {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background-color: white;
}

.casing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.casing-card {
  background-color: var(--card-background);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.card-hover {
  transition: all 0.4s ease;
}

.card-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
}

.card-image-container {
  height: 280px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.casing-card:hover .card-image {
  transform: scale(1.1);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
}

.card-description {
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.price-container {
  display: flex;
  flex-direction: column;
}

.original-price {
  color: var(--text-secondary);
  text-decoration: line-through;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.final-price {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 1.1rem;
}

.discount-badge {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.8rem;
  align-self: flex-start;
  margin-top: 0.5rem;
}

.card-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  background-color: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.delete-btn:hover {
  border-color: #EF4444;
  color: #EF4444;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--card-background);
  border-radius: 16px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
}

.loader {
  border: 4px solid var(--background-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
}

.loading-text {
  margin-top: 1rem;
  color: var(--text-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  background-color: var(--card-background);
  border-radius: 16px;
  border: 1px solid var(--border-color);
}

.empty-icon {
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.btn-secondary {
  background-color: var(--secondary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background-color: #059669;
  transform: translateY(-2px);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
}

/* Additional Utilities */
.card-elevated {
  box-shadow: 0 20px 40px -14px rgba(0, 0, 0, 0.08), 
              0 10px 20px -10px rgba(0, 0, 0, 0.05);
}

/* Responsive Adjustments */
@media screen and (max-width: 768px) {
  .catalog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .search-sort-wrapper {
    width: 100%;
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .casing-grid {
    grid-template-columns: 1fr;
  }
}

/* Dark Mode Support (Optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #60A5FA;
    --secondary-color: #34D399;
    --background-color: #111827;
    --text-primary: #F9FAFB;
    --text-secondary: #9CA3AF;
    --card-background: #1F2937;
    --border-color: #374151;
  }

  body {
    color: var(--text-primary);
  }

  .casing-card {
    background-color: var(--card-background);
  }
}

@media screen and (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
    width: 100%;
  }

  .search-sort-wrapper {
    display: flex;
    flex-direction: row; /* Pastikan tetap horizontal */
    width: 100%;
    gap: 1rem;
  }
}
</style>
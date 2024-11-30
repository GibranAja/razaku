<template>
  <div class="casing-form-container">
    <div class="form-wrapper">
      <h2 class="form-title">{{ casing.isUpdate ? 'Update' : 'Add New' }} Casing</h2>
      <form @submit.prevent="submitForm" class="casing-form">
        <div class="form-row">
          <div class="form-group">
            <label>Casing Name</label>
            <input v-model="casing.name" type="text" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Stock</label>
            <input v-model.number="casing.stock" type="number" required class="form-input" />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Description</label>
          <textarea v-model="casing.description" required class="form-textarea" rows="4"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price</label>
            <input v-model.number="casing.price" type="number" required class="form-input" />
          </div>
          <div class="form-group">
            <label>Discount (%)</label>
            <input
              v-model.number="casing.discount"
              type="number"
              min="0"
              max="100"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label>Final Price</label>
            <input
              :value="calculateFinalPrice(casing.price, casing.discount)"
              disabled
              class="form-input disabled"
            />
          </div>
        </div>

        <div class="form-group full-width">
          <label>Themes</label>
          <div class="theme-dropdown" @click.stop="toggleThemeDropdown">
            <div class="theme-dropdown-header">
              {{ selectedThemes.length }} theme(s) selected
            </div>
            <div v-if="isThemeDropdownOpen" class="theme-dropdown-list">
              <label 
                v-for="theme in themeStore.themeData" 
                :key="theme.id" 
                class="theme-checkbox"
              >
                <input 
                  type="checkbox" 
                  :value="theme.id" 
                  v-model="selectedThemes"
                  @click.stop
                />
                {{ theme.name }}
              </label>
            </div>
          </div>
        </div>

        <div class="form-group full-width">
          <label>Image</label>
          <input type="file" @change="handleFileUpload" accept="image/*" class="form-file-input" />
          <div v-if="casing.imageBase64" class="image-preview-container">
            <img :src="casing.imageBase64" alt="Preview" class="image-preview" />
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="clearForm" class="btn btn-secondary">Clear</button>
          <button type="submit" class="btn btn-primary">
            {{ casing.isUpdate ? 'Update' : 'Add' }} Casing
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useCasingStore } from '@/store/CasingStore'
import { useThemeStore } from '@/store/ThemeStore'
import { useRoute } from 'vue-router'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const route = useRoute()
const casingStore = useCasingStore()
const themeStore = useThemeStore()

const { casing, handleSubmit, clearHandling, updateHandling, calculateFinalPrice } = casingStore

const selectedThemes = ref([])
const imageFile = ref(null)
const isThemeDropdownOpen = ref(false)

onMounted(async () => {
  await themeStore.fetchThemes()
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    isThemeDropdownOpen.value = false
  })
})

const toggleThemeDropdown = () => {
  isThemeDropdownOpen.value = !isThemeDropdownOpen.value
}

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const submitForm = () => {
  casing.themes = selectedThemes.value
  handleSubmit(imageFile.value)
}

const clearForm = () => {
  clearHandling()
  imageFile.value = null
  selectedThemes.value = []
}

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      casing.isUpdate = true
      casing.id = newData.id
      casing.name = newData.name
      casing.description = newData.description
      casing.price = newData.price
      casing.discount = newData.discount
      casing.stock = newData.stock
      casing.imageBase64 = newData.imageBase64

      if (newData.themes) {
        selectedThemes.value = newData.themes
      }
    }
  },
  { immediate: true }
)

onMounted(async () => {
  const casingId = route.params.id
  if (casingId) {
    await updateHandling(casingId)
  }
})
</script>

<style scoped>
.theme-dropdown {
  position: relative;
  cursor: pointer;
}

.theme-dropdown-header {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

.theme-dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-top: none;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.theme-checkbox {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.theme-checkbox:hover {
  background-color: #f0f0f0;
}

.theme-checkbox input {
  margin-right: 0.5rem;
}

.casing-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-wrapper {
  animation: fadeIn 0.5s ease-out;
}

.form-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
}

.casing-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  width: 100%;
}

label {
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input,
.form-textarea,
.form-file-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-file-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
}

.image-preview-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.image-preview {
  max-width: 300px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #4a90e2;
  color: white;
}

.btn-primary:hover {
  background-color: #357abd;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

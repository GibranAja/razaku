<template>
    <div class="casing-form-container">
      <div class="form-wrapper">
        <h2 class="form-title">{{ theme.isUpdate ? 'Update' : 'Add New' }} Theme</h2>
        <form @submit.prevent="submitForm" class="casing-form">
          <div class="form-group full-width">
            <label>Theme Name</label>
            <input 
              v-model="theme.name" 
              type="text" 
              required 
              class="form-input"
            />
          </div>
  
          <div class="form-group full-width">
            <label>Image</label>
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept="image/*"
              class="form-file-input"
            />
            <div v-if="theme.imageBase64" class="image-preview-container">
              <img 
                :src="theme.imageBase64" 
                alt="Preview" 
                class="image-preview"
              />
            </div>
          </div>
  
          <div class="form-actions">
            <button 
              type="button" 
              @click="clearForm" 
              class="btn btn-secondary"
            >
              Clear
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
            >
              {{ theme.isUpdate ? 'Update' : 'Add' }} Theme
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted, watch, defineEmits } from 'vue'
import { useThemeStore } from '@/store/ThemeStore'
import { useRoute } from 'vue-router'

// Tambahkan emit untuk submit
const emit = defineEmits(['submit'])

// Tambahkan prop untuk menerima data awal
const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
})

const route = useRoute()
const themeStore = useThemeStore()

const { 
  theme, 
  handleSubmit, 
  updateHandling 
} = themeStore

const imageFile = ref(null)

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const submitForm = async () => {
  await handleSubmit(imageFile.value)
  emit('submit')  // Emit event setelah submit berhasil
}

const clearForm = () => {
  themeStore.resetTheme()
  imageFile.value = null
}

// Tambahkan watcher untuk menangani data awal
watch(() => props.initialData, (newData) => {
  if (newData) {
    // Set mode update
    theme.isUpdate = true
    
    // Isi data dari props
    theme.id = newData.id
    theme.name = newData.name
    theme.imageBase64 = newData.imageBase64
  }
}, { immediate: true })

onMounted(async () => {
  const themeId = route.params.id
  if (themeId) {
    await updateHandling(themeId)
  }
})
</script>
  
<style scoped>
/* Gunakan style yang sama dengan CreateCasingComponents.vue */
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

.form-group {
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
.form-file-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-input:focus, 
.form-file-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
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
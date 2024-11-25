<template>
    <div class="mt-8 max-w-2xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nama Casing -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama Casing</label>
            <input 
              type="text"
              v-model="casing.name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Masukkan nama casing"
            >
            <span v-if="errors.name" class="text-red-500 text-sm">{{ errors.name }}</span>
          </div>
  
          <!-- Kategori Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Kategori</label>
            <select
              v-model="casing.categoryId"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              :class="{ 'border-red-500': errors.categoryId }"
            >
              <option value="" disabled>Pilih kategori</option>
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <span v-if="errors.categoryId" class="text-red-500 text-sm">{{ errors.categoryId }}</span>
          </div>
  
          <!-- Deskripsi -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
            <textarea 
              v-model="casing.description"
              rows="4"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              :class="{ 'border-red-500': errors.description }"
              placeholder="Masukkan deskripsi casing"
            ></textarea>
            <span v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</span>
          </div>
  
          <!-- Harga -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Harga</label>
            <input 
              type="number"
              v-model="casing.price"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              :class="{ 'border-red-500': errors.price }"
              placeholder="Masukkan harga"
            >
            <span v-if="errors.price" class="text-red-500 text-sm">{{ errors.price }}</span>
          </div>
  
          <!-- Diskon -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Diskon (%)</label>
            <input 
              type="number"
              v-model="casing.discount"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              min="0"
              max="100"
              placeholder="Masukkan diskon (optional)"
            >
          </div>
  
          <!-- Stok -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Stok</label>
            <input 
              type="number"
              v-model="casing.stock"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
              :class="{ 'border-red-500': errors.stock }"
              placeholder="Masukkan jumlah stok"
            >
            <span v-if="errors.stock" class="text-red-500 text-sm">{{ errors.stock }}</span>
          </div>
  
          <!-- Upload Gambar -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Gambar Casing</label>
            <input 
              type="file"
              @change="handleImageChange"
              accept="image/*"
              class="mt-1 block w-full"
            >
            <span v-if="errors.image" class="text-red-500 text-sm">{{ errors.image }}</span>
            
            <!-- Preview Gambar -->
            <div v-if="casing.imageBase64" class="mt-2">
              <img 
                :src="casing.imageBase64"
                alt="Preview"
                class="h-32 w-32 object-cover rounded-lg"
              >
            </div>
          </div>
  
          <!-- Tombol Submit -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
              {{ isSubmitting ? 'Menyimpan...' : (casing.isUpdate ? 'Update' : 'Submit') }}
            </button>
            
            <button
              type="button"
              @click="handleBack"
              class="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
            >
              {{ isFormFilled ? 'Batal' : 'Kembali' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { useCasingStore } from '@/stores/CasingStore'
  import { useCategoryStore } from '@/stores/CategoryStore'
  
  const router = useRouter()
  const casingStore = useCasingStore()
  const categoryStore = useCategoryStore()
  const { casing } = storeToRefs(casingStore)
  const categories = ref([])
  
  const isSubmitting = ref(false)
  const errors = ref({})
  
  // Load categories when component mounts
  onMounted(async () => {
    await categoryStore.getAllCategories()
    categories.value = categoryStore.categoryData
  })
  
  // Validasi form
  const validateForm = () => {
    errors.value = {}
    
    if (!casing.value.name) {
      errors.value.name = 'Nama casing harus diisi'
    }
    
    if (!casing.value.categoryId) {
      errors.value.categoryId = 'Kategori harus dipilih'
    }
    
    if (!casing.value.description) {
      errors.value.description = 'Deskripsi harus diisi'
    }
    
    if (!casing.value.price || casing.value.price <= 0) {
      errors.value.price = 'Harga harus lebih dari 0'
    }
    
    if (!casing.value.stock || casing.value.stock < 0) {
      errors.value.stock = 'Stok tidak boleh negatif'
    }
  
    return Object.keys(errors.value).length === 0
  }
  
  // Handle submit form
  const handleSubmit = async () => {
    if (!validateForm()) return
  
    try {
      isSubmitting.value = true
      await casingStore.handleSubmit()
      router.push({ name: 'Casing' })
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      isSubmitting.value = false
    }
  }
  
  // Handle perubahan gambar
  const handleImageChange = async (event) => {
    const file = event.target.files[0]
    if (!file) return
  
    // Validasi ukuran file (maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      errors.value.image = 'Ukuran gambar maksimal 2MB'
      return
    }
  
    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      errors.value.image = 'File harus berupa gambar'
      return
    }
  
    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        casing.value.imageBase64 = reader.result
      }
    } catch (error) {
      console.error('Error reading image:', error)
      errors.value.image = 'Gagal membaca gambar'
    }
  }
  
  // Cek apakah form sudah diisi
  const isFormFilled = computed(() => {
    return (
      casing.value.name ||
      casing.value.description ||
      casing.value.categoryId ||
      casing.value.price ||
      casing.value.stock ||
      casing.value.imageBase64
    )
  })
  
  // Handle tombol kembali/batal
  const handleBack = () => {
    if (isFormFilled.value) {
      if (confirm('Apakah Anda yakin ingin membatalkan? Perubahan akan hilang.')) {
        router.go(-1)
      }
    } else {
      router.go(-1)
    }
  }
  </script>
  
  <style scoped>
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
  }
  </style>
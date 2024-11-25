import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { db } from '../config/firebase'
import { useAuthStore } from './AuthStore'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export const useCategoryStore = defineStore('Category', () => {
  // State
  const category = reactive({
    id: '',
    name: '',
    description: '',
    imageBase64: '', // Untuk menyimpan gambar dalam format base64
    isUpdate: false
  })

  // Refs
  const formInput = ref(false)
  const categoryData = ref(null)
  const detailCategory = ref(null)

  // Store
  const authStore = useAuthStore()

  // Collection
  const categoryCollection = collection(db, 'categories')

  // Convert image file to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle submit form
  const handleSubmit = async (imageFile) => {
    try {
      let imageBase64 = category.imageBase64

      // Convert image ke base64 jika ada file baru
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile)
      }

      const categoryData = {
        name: category.name,
        description: category.description,
        imageBase64: imageBase64, // Image bersifat opsional
        updatedAt: Date.now()
      }

      if (category.isUpdate) {
        // Update existing category
        await updateDoc(doc(categoryCollection, category.id), categoryData)
        alert('Success updating category')
      } else {
        // Add new category
        categoryData.createdAt = Date.now()
        categoryData.createdBy = {
          id: authStore.currentUser.id,
          name: authStore.currentUser.name,
          email: authStore.currentUser.email
        }

        await addDoc(categoryCollection, categoryData)
        alert('Success adding new category')
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert('Error processing category data')
    }
  }

  // Get all categories
  const getAllCategories = async () => {
    const fetchedCategories = await getDocs(categoryCollection)
    categoryData.value = fetchedCategories.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  // Get category detail
  const getCategoryDetail = async (categoryId) => {
    const docRef = doc(categoryCollection, categoryId)
    const docDetail = await getDoc(docRef)
    detailCategory.value = { ...docDetail.data(), id: docDetail.id }
  }

  // Clear form
  const clearForm = () => {
    category.id = ''
    category.name = ''
    category.description = ''
    category.imageBase64 = ''
    category.isUpdate = false
  }

  // Set update mode
  const setUpdateMode = async (categoryId) => {
    const docRef = doc(categoryCollection, categoryId)
    const docDetail = await getDoc(docRef)
    const data = docDetail.data()

    category.id = docRef.id
    category.name = data.name
    category.description = data.description
    category.imageBase64 = data.imageBase64
    category.isUpdate = true
  }

  // Delete category
  const deleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(categoryCollection, categoryId))
      alert('Delete Category Success')
      getAllCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category')
    }
  }

  return {
    // State
    category,
    formInput,
    categoryData,
    detailCategory,

    // Methods
    handleSubmit,
    getAllCategories,
    getCategoryDetail,
    clearForm,
    setUpdateMode,
    deleteCategory,
    convertToBase64
  }
})
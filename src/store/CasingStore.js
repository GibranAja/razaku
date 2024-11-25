import { ref, reactive } from 'vue'
import { defineStore } from 'pinia'
import { db } from '../config/firebase'
import { useAuthStore } from './AuthStore'
import { useRouter } from 'vue-router'
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

export const useCasingStore = defineStore('Casing', () => {
  // State
  const casing = reactive({
    id: '',
    name: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    imageBase64: '', // Menggunakan base64 string untuk gambar
    isUpdate: false
  })

  const formInput = ref(false)
  const casingData = ref(null)
  const detailCasing = ref(null)

  // Router
  const router = useRouter()

  // Storage
  const authStore = useAuthStore()

  // Collection
  const casingCollection = collection(db, 'casings')

  // Fungsi untuk menghitung harga setelah diskon
  const calculateFinalPrice = (originalPrice, discountPercentage) => {
    if (discountPercentage <= 0) return originalPrice
    const discountAmount = (originalPrice * discountPercentage) / 100
    return originalPrice - discountAmount
  }

  // Fungsi untuk mengkonversi file gambar ke base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (imageFile) => {
    try {
      let imageBase64 = casing.imageBase64

      // Convert image ke base64 jika ada file baru
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile)
      }

      const casingData = {
        name: casing.name,
        description: casing.description,
        price: Number(casing.price),
        discount: Number(casing.discount),
        finalPrice: calculateFinalPrice(Number(casing.price), Number(casing.discount)),
        stock: Number(casing.stock),
        imageBase64: imageBase64,
        updatedAt: Date.now()
      }

      if (casing.isUpdate) {
        // Update Data
        await updateDoc(doc(casingCollection, casing.id), casingData)
        alert('Success updating casing')
      } else {
        // Add Data
        casingData.createdAt = Date.now()
        casingData.createdBy = {
          id: authStore.currentUser.id,
          name: authStore.currentUser.name,
          email: authStore.currentUser.email
        }

        await addDoc(casingCollection, casingData)
        alert('Success adding new casing')
      }

      router.push({ name: 'Casing' })
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      alert('Error processing casing data')
    }
  }

  const allCasings = async () => {
    const fetchedCasings = await getDocs(casingCollection)
    casingData.value = fetchedCasings.docs
      .map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          finalPrice: calculateFinalPrice(data.price, data.discount)
        }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  const detailHandling = async (idParams) => {
    const docRef = doc(casingCollection, idParams)
    const docDetail = await getDoc(docRef)
    detailCasing.value = { ...docDetail.data(), id: docDetail.id }
  }

  const clearHandling = () => {
    casing.id = ''
    casing.name = ''
    casing.description = ''
    casing.price = 0
    casing.discount = 0
    casing.stock = 0
    casing.imageBase64 = ''
    casing.isUpdate = false
  }

  const updateHandling = async (idParams) => {
    const docRef = doc(casingCollection, idParams)
    const docDetail = await getDoc(docRef)
    const data = docDetail.data()

    casing.id = docRef.id
    casing.name = data.name
    casing.description = data.description
    casing.price = data.price
    casing.discount = data.discount
    casing.stock = data.stock
    casing.imageBase64 = data.imageBase64
    casing.isUpdate = true
  }

  const deleteHandling = async (idParams) => {
    try {
      await deleteDoc(doc(casingCollection, idParams))
      alert('Delete Casing Success')
      allCasings()
    } catch (error) {
      console.error('Error deleting casing:', error)
      alert('Error deleting casing')
    }
  }

  return {
    casing,
    formInput,
    handleSubmit,
    casingData,
    allCasings,
    detailCasing,
    detailHandling,
    clearHandling,
    updateHandling,
    deleteHandling,
    calculateFinalPrice
  }
})
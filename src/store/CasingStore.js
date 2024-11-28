import { ref, reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { db } from '../config/firebase'
import { useAuthStore } from './AuthStore'
import { useRouter } from 'vue-router'
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore'

export const useCasingStore = defineStore('Casing', () => {
  // State
  const casing = reactive({
    id: '',
    name: '',
    description: '',
    price: 0,
    discount: 0,
    stock: 0,
    imageBase64: '',
    themes: [],
    isUpdate: false
  })

  const casingData = ref([])
  const detailCasing = ref(null)
  const lastDocument = ref(null)
  const hasMore = ref(true)
  const isLoading = ref(false)

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

  // Optimized data fetching with pagination
  const fetchCasings = async (pageSize = 10, reset = false) => {
    if (isLoading.value) return
    isLoading.value = true

    try {
      let q
      if (reset) {
        // Reset the state for initial load
        casingData.value = []
        lastDocument.value = null
        hasMore.value = true
      }

      if (lastDocument.value) {
        // Fetch next page
        q = query(
          casingCollection, 
          orderBy('createdAt', 'desc'), 
          startAfter(lastDocument.value), 
          limit(pageSize)
        )
      } else {
        // First page
        q = query(
          casingCollection, 
          orderBy('createdAt', 'desc'), 
          limit(pageSize)
        )
      }

      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const newCasings = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            ...data,
            id: doc.id,
            finalPrice: calculateFinalPrice(data.price, data.discount)
          }
        })

        // Append or set new casings
        if (reset) {
          casingData.value = newCasings
        } else {
          casingData.value = [...casingData.value, ...newCasings]
        }

        // Update last document for next pagination
        lastDocument.value = snapshot.docs[snapshot.docs.length - 1]
        
        // Check if we've reached the end of the collection
        hasMore.value = snapshot.docs.length === pageSize
      } else {
        hasMore.value = false
      }
    } catch (error) {
      console.error('Error fetching casings:', error)
      hasMore.value = false
    } finally {
      isLoading.value = false
    }
  }

  // Cached computed properties for performance
  const sortedCasings = computed(() => {
    return [...casingData.value].sort((a, b) => b.createdAt - a.createdAt)
  })

  const totalCasingsCount = computed(() => casingData.value.length)

  // Rest of the existing methods remain the same...
  const handleSubmit = async (imageFile) => {
    try {
      let imageBase64 = casing.imageBase64;
  
      // Convert image to base64 if a new file is provided
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile);
      }
  
      const casingData = {
        name: casing.name,
        description: casing.description,
        price: Number(casing.price),
        discount: Number(casing.discount),
        finalPrice: calculateFinalPrice(Number(casing.price), Number(casing.discount)),
        stock: Number(casing.stock),
        imageBase64: imageBase64,
        themes: casing.themes,
        updatedAt: Date.now()
      };
  
      if (casing.isUpdate) {
        // Update Data
        await updateDoc(doc(casingCollection, casing.id), casingData);
        alert('Success updating casing');
      } else {
        // Add Data
        casingData.createdAt = Date.now();
        casingData.createdBy = {
          id: authStore.currentUser.id,
          name: authStore.currentUser.name,
          email: authStore.currentUser.email
        };
  
        await addDoc(casingCollection, casingData);
        alert('Success adding new casing');
      }
  
      // Fetch casings again to refresh the data in the store
      await fetchCasings(10, true);
      
      // Reset the casing state
      resetCasing();
  
      // Redirect or update UI as necessary
      router.push({ name: 'CasingView' });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Error processing casing data');
    }
  };
  
  // Reset the casing state after successful submission
  const resetCasing = () => {
    casing.id = '';
    casing.name = '';
    casing.description = '';
    casing.price = 0;
    casing.discount = 0;
    casing.stock = 0;
    casing.imageBase64 = '';
    casing.themes = [];
    casing.isUpdate = false;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const updateHandling = async (idParams) => {
    try {
      const docRef = doc(casingCollection, idParams)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        
        // Reset dan isi ulang objek casing
        Object.keys(casing).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            casing[key] = data[key]
          }
        })
        
        // Set mode update
        casing.isUpdate = true
        casing.id = idParams
      }
    } catch (error) {
      console.error('Error fetching casing details:', error)
    }
  }

  // Existing methods with minor modifications
  const detailHandling = async (idParams) => {
    const docRef = doc(casingCollection, idParams)
    const docDetail = await getDoc(docRef)
    detailCasing.value = { ...docDetail.data(), id: docDetail.id }
  }

  const deleteHandling = async (idParams) => {
    try {
      await deleteDoc(doc(casingCollection, idParams))
      alert('Delete Casing Success')
      
      // Refresh data after deleting
      await fetchCasings(10, true)
    } catch (error) {
      console.error('Error deleting casing:', error)
      alert('Error deleting casing')
    }
  }

  // Reset method for clearing states
  const resetStore = () => {
    casingData.value = []
    lastDocument.value = null
    hasMore.value = true
    isLoading.value = false
  }

  return {
    casing,
    casingData,
    detailCasing,
    isLoading,
    hasMore,
    sortedCasings,
    totalCasingsCount,
    fetchCasings,
    handleSubmit,
    detailHandling,
    updateHandling,
    deleteHandling,
    resetStore,
    calculateFinalPrice
  }
})
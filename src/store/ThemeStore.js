import { ref, reactive } from 'vue'
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

export const useThemeStore = defineStore('Theme', () => {
  // State
  const theme = reactive({
    id: '',
    name: '',
    imageBase64: '',
    isUpdate: false
  })

  const themeData = ref([])
  const detailTheme = ref(null)
  const lastDocument = ref(null)
  const hasMore = ref(true)
  const isLoading = ref(false)

  // Router
  const router = useRouter()

  // Storage
  const authStore = useAuthStore()

  // Collection
  const themeCollection = collection(db, 'themes')

  // Optimized data fetching with pagination
  const fetchThemes = async (pageSize = 10, reset = false) => {
    if (isLoading.value) return
    isLoading.value = true
  
    try {
      let q
      if (reset) {
        themeData.value = []
        lastDocument.value = null
        hasMore.value = true
      }
  
      if (lastDocument.value) {
        q = query(
          themeCollection, 
          orderBy('createdAt', 'desc'), 
          startAfter(lastDocument.value), 
          limit(pageSize)
        )
      } else {
        q = query(
          themeCollection, 
          orderBy('createdAt', 'desc'), 
          limit(pageSize)
        )
      }
  
      const snapshot = await getDocs(q)
      
      if (!snapshot.empty) {
        const newThemes = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id
          }))
          // Remove potential duplicates
          .filter(theme => 
            !themeData.value.some(existingTheme => existingTheme.id === theme.id)
          )
  
        // Append new unique themes
        themeData.value = reset 
          ? newThemes 
          : [...themeData.value, ...newThemes]
  
        // Update last document for next pagination
        lastDocument.value = snapshot.docs[snapshot.docs.length - 1]
        
        // Check if we've reached the end of the collection
        hasMore.value = snapshot.docs.length === pageSize
      } else {
        hasMore.value = false
      }
    } catch (error) {
      console.error('Error fetching themes:', error)
      hasMore.value = false
    } finally {
      isLoading.value = false
    }
  }

  // Handle Submit (Create/Update)
  const handleSubmit = async (imageFile) => {
    try {
      let imageBase64 = theme.imageBase64;
  
      // Convert image to base64 if a new file is provided
      if (imageFile) {
        imageBase64 = await convertToBase64(imageFile);
      }
  
      const themeData = {
        name: theme.name,
        imageBase64: imageBase64,
        updatedAt: Date.now()
      };
  
      if (theme.isUpdate) {
        // Update Data
        await updateDoc(doc(themeCollection, theme.id), themeData);
        alert('Success updating theme');
      } else {
        // Add Data
        themeData.createdAt = Date.now();
        themeData.createdBy = {
          id: authStore.currentUser.id,
          name: authStore.currentUser.name,
          email: authStore.currentUser.email
        };
  
        await addDoc(themeCollection, themeData);
        alert('Success adding new theme');
      }
  
      // Fetch themes again to refresh the data in the store
      await fetchThemes(10, true);
      
      // Reset the theme state
      resetTheme();
  
      // Redirect or update UI as necessary
      router.push({ name: 'ThemeView' });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      alert('Error processing theme data');
    }
  };
  
  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Reset the theme state
  const resetTheme = () => {
    theme.id = '';
    theme.name = '';
    theme.imageBase64 = '';
    theme.isUpdate = false;
  };

  // Update handling for editing
  const updateHandling = async (idParams) => {
    try {
      const docRef = doc(themeCollection, idParams)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        
        // Reset dan isi ulang objek theme
        Object.keys(theme).forEach(key => {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            theme[key] = data[key]
          }
        })
        
        // Set mode update
        theme.isUpdate = true
        theme.id = idParams
      }
    } catch (error) {
      console.error('Error fetching theme details:', error)
    }
  }

  // Detail handling
  const detailHandling = async (idParams) => {
    const docRef = doc(themeCollection, idParams)
    const docDetail = await getDoc(docRef)
    detailTheme.value = { ...docDetail.data(), id: docDetail.id }
  }

  // Delete handling
  const deleteHandling = async (idParams) => {
    try {
      await deleteDoc(doc(themeCollection, idParams))
      alert('Delete Theme Success')
      
      // Refresh data after deleting
      await fetchThemes(10, true)
    } catch (error) {
      console.error('Error deleting theme:', error)
      alert('Error deleting theme')
    }
  }

  // Reset method for clearing states
  const resetStore = () => {
    themeData.value = []
    lastDocument.value = null
    hasMore.value = true
    isLoading.value = false
  }

  return {
    theme,
    themeData,
    detailTheme,
    isLoading,
    hasMore,
    fetchThemes,
    handleSubmit,
    detailHandling,
    updateHandling,
    deleteHandling,
    resetStore
  }
})
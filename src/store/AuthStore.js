import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const toast = useToast()
  const currentUser = ref(null)
  const userCollection = collection(db, 'users')
  const isLoading = ref(true) // Tambahkan ini untuk handling loading state

  const user = reactive({
    name: '',
    email: '',
    password: '',
    profilePhoto: ''
  })
  
  const isLoggedIn = ref(false)
  const isError = ref(false)
  const message = ref('')

  // Fungsi untuk inisialisasi state auth
  const initializeAuthState = () => {
    onAuthStateChanged(auth, async (user) => {
      isLoading.value = true // Set loading ke true saat memulai pengecekan
      try {
        if (user) {
          const queryId = query(userCollection, where('uid', '==', user.uid))
          const queryData = await getDocs(queryId)

          if (!queryData.empty) {
            const queryUser = queryData.docs[0].data()
            currentUser.value = {
              email: user.email,
              id: user.uid,
              name: queryUser.name,
              isAdmin: queryUser.isAdmin,
              profilePhoto: queryUser.profilePhoto || ''
            }
            isLoggedIn.value = true
          } else {
            console.error('User document not found in Firestore')
            currentUser.value = null
            isLoggedIn.value = false
          }
        } else {
          currentUser.value = null
          isLoggedIn.value = false
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        currentUser.value = null
        isLoggedIn.value = false
      } finally {
        isLoading.value = false // Set loading ke false setelah selesai
      }
    })
  }

  const authUser = async (isLogin = false) => {
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          user.email,
          user.password
        )
        if (userCredential) {
          isLoggedIn.value = true
          toast.success("Successfully logged in!")
          router.push('/')
        }
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        )
        if (userCredential) {
          await addDoc(collection(db, 'users'), {
            uid: userCredential.user.uid,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto || '',
            isAdmin: false
          })
          toast.success("Successfully registered!")
          router.push('/login')
        }
      }
    } catch (error) {
      isError.value = true
      message.value = error.message
      toast.error(error.message)
    }
  }

  const logoutUser = async () => {
    try {
      await signOut(auth)
      currentUser.value = null
      isLoggedIn.value = false
      toast.success("Successfully logged out!")
      router.push('/login')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const clearError = () => {
    isError.value = false
    message.value = ''
  }

  return {
    user,
    isLoggedIn,
    isError,
    message,
    currentUser,
    isLoading,
    authUser,
    logoutUser,
    clearError,
    initializeAuthState
  }
})
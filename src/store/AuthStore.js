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
  const isLoading = ref(true)

  const user = reactive({
    name: '',
    email: '',
    password: '',
    profilePhoto: ''
  })
  
  const isLoggedIn = ref(false)
  const isError = ref(false)
  const message = ref('')

  const redirectBasedOnRole = async (isAdmin, currentPath) => {
    // Hanya redirect dan munculkan toast jika sedang di halaman login atau register
    if (currentPath === '/login' || currentPath === '/register') {
      await router.push({ name: 'Home' })
      // toast.info('You are already logged in')
      return
    }
  
    if (isAdmin) {
      // Jika admin mencoba mengakses halaman admin, biarkan
      if (currentPath.startsWith('/admin')) {
        toast.success('Welcome back, Admin!')
        return
      }
      // Jika dari halaman lain, arahkan ke dashboard
      await router.push({ name: 'DashboardAdmin' })
      toast.success('Welcome back, Admin!')
    } else {
      // Jika user biasa mencoba akses halaman admin, redirect ke home
      if (currentPath.startsWith('/admin')) {
        await router.push({ name: 'Home' })
      }
      // toast.success('Welcome back!')
    }
  }

  const initializeAuthState = () => {
    onAuthStateChanged(auth, async (user) => {
      isLoading.value = true
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

            // Check current path when auth state initializes
            const currentPath = router.currentRoute.value.path
            await redirectBasedOnRole(queryUser.isAdmin, currentPath)
          } else {
            console.error('User document not found in Firestore')
            await handleAuthFailure()
          }
        } else {
          await handleAuthFailure()
        }
      } catch (error) {
        console.error('Error initializing auth state:', error)
        await handleAuthFailure()
      } finally {
        isLoading.value = false
      }
    })
  }

  const handleAuthFailure = async () => {
    currentUser.value = null
    isLoggedIn.value = false
    const currentPath = router.currentRoute.value.path
    
    // Jika user mencoba akses halaman admin tanpa auth
    if (currentPath.startsWith('/admin')) {
      await router.push({ name: 'notFound' })
    }
  }

  const authUser = async (isLogin = false) => {
    try {
      isLoading.value = true
      isError.value = false
      message.value = ''

      if (isLogin) {
        // Tambahkan pengecekan login di sini
        if (isLoggedIn.value) {
          await router.push({ name: 'Home' })
          toast.info('You are already logged in')
          return
        }

        // Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          user.email,
          user.password
        )
        
        if (userCredential) {
          const queryId = query(userCollection, where('uid', '==', userCredential.user.uid))
          const queryData = await getDocs(queryId)

          if (!queryData.empty) {
            const userData = queryData.docs[0].data()
            currentUser.value = {
              email: userCredential.user.email,
              id: userCredential.user.uid,
              name: userData.name,
              isAdmin: userData.isAdmin,
              profilePhoto: userData.profilePhoto || ''
            }
            isLoggedIn.value = true
            
            // Get current path before redirect
            const currentPath = router.currentRoute.value.path
            await redirectBasedOnRole(userData.isAdmin, currentPath)
          }
        }
      } else {
        // Tambahkan pengecekan register di sini
        if (isLoggedIn.value) {
          await router.push({ name: 'Home' })
          toast.info('You are already logged in')
          return
        }

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
          toast.success("Registration successful! Please login.")
          await router.push('/login')
        }
      }

      // Reset form
      user.name = ''
      user.email = ''
      user.password = ''
      user.profilePhoto = ''

    } catch (error) {
      isError.value = true
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message.value = 'Invalid email or password'
          break
        case 'auth/email-already-in-use':
          message.value = 'Email is already registered'
          break
        case 'auth/invalid-email':
          message.value = 'Invalid email format'
          break
        case 'auth/weak-password':
          message.value = 'Password should be at least 6 characters'
          break
        default:
          message.value = error.message
      }
      toast.error(message.value)
    } finally {
      isLoading.value = false
    }
  }

  const logoutUser = async () => {
    try {
      isLoading.value = true
      await signOut(auth)
      currentUser.value = null
      isLoggedIn.value = false
      toast.success("Successfully logged out!")
      await router.push('/login')
    } catch (error) {
      toast.error(error.message)
    } finally {
      isLoading.value = false
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
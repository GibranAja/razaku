import { auth, db } from '../config/firebase.js'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth'
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
// import DialogComponents from '@/components/dashboard/DialogComponents.vue'

export const useAuthStore = defineStore('auth', () => {
  const formInput = ref(false)
  const router = useRouter()

  const currentUser = ref(null)
  const userCollection = collection(db, 'users')

  const user = reactive({
    name: '',
    email: '',
    password: ''
  })

  const isError = ref(false)
  const message = ref(null)

  // Toast
  const toast = useToast()

  // Dialog
  const dialogLogout = ref(false)

  const userHandler = () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const queryId = query(userCollection, where('uid', '==', user.uid))
        const queryData = await getDocs(queryId)

        if (!queryData.empty) {
          const queryUser = queryData.docs[0].data()
          currentUser.value = {
            email: user.email,
            id: user.uid,
            name: queryUser.name,
            isAdmin: queryUser.isAdmin
          }
        } else {
          console.error('User document not found in Firestore')
          currentUser.value = null
        }
      } else {
        currentUser.value = null
      }
    })
  }

  const confirmLogout = () => {
    dialogLogout.value = true
  }

  const logOutUser = async () => {
    try {
      await signOut(auth)
      dialogLogout.value = false
      router.push({ name: 'HomePublic' }).then(() => {
        toast.success(`Kamu berhasil logout!`, {
          timeout: 3000,
          position: "top-right",
          pauseOnHover: false
        })
      })
    } catch (error) {
      console.error('Logout error:', error)
      isError.value = true
      message.value = 'Failed to log out. Please try again.'
    }
  }

  const authUser = async (isLogin = false) => {
    try {
      isError.value = false
      message.value = null

      if (isLogin) {
        await signInWithEmailAndPassword(auth, user.email, user.password)
      } else {
        const { user: createdUser } = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        )
        await addDoc(userCollection, {
          name: user.name,
          isAdmin: false,
          uid: createdUser.uid
        })
      }

      const queryId = query(userCollection, where('uid', '==', auth.currentUser.uid))
      const queryData = await getDocs(queryId)

      if (!queryData.empty) {
        const queryUser = queryData.docs[0].data()
        currentUser.value = {
          email: auth.currentUser.email,
          id: auth.currentUser.uid,
          name: queryUser.name,
          isAdmin: queryUser.isAdmin
        }

        // Toaster
        toast.success(`Hai, ${currentUser.value.name}!`, {
          timeout: 3000,
          position: "top-right",
        })

        // Route 
        if (queryUser.isAdmin) {
          router.push({ name: 'Home' })
        } else {
          router.push({ name: 'HomePublic' })
        }
      } else {
        console.error('User document not found in Firestore')
        currentUser.value = null
        router.push({ name: 'HomePublic' })
      }

      user.name = ''
      user.email = ''
      user.password = ''

    } catch (error) {
      isError.value = true

      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          message.value = 'Login Failed : Email or Password wrong'
          break
        case 'auth/invalid-email':
          message.value = 'Email not valid.'
          break
        case 'auth/email-already-in-use':
          message.value = 'Register failed: Email Registered'
          break
        case 'auth/weak-password':
          message.value = 'Register Failed: Minimal Password 8 Characters'
          break
        default:
          message.value = `${isLogin ? 'Login' : 'Register'} Failed: ${error.message}`
      }

      console.error('Authentication error:', error)
    }
  }

  return {
    formInput,
    user,
    authUser,
    userHandler,
    currentUser,
    logOutUser,
    isError,
    message,
    dialogLogout,
    confirmLogout
  }
})
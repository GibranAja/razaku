<!-- NavbarComponent.vue -->
<template>
  <nav
    class="navbar"
    :class="{ glassmorphism: isScrolled && !isHidden }"
    :style="{ transform: isHidden ? 'translateY(-100%)' : 'translateY(0)' }"
  >
    <div class="navbar-logo">
      <img src="../image/Logo Razaku Bersih.png" alt="Logo" class="logo" />
    </div>
    
    <div class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>
    
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <ul class="nav-links">
        <li><a href="#home" @click="closeMenu">Beranda</a></li>
        <li><a href="#products" @click="closeMenu">Produk</a></li>
        <li><a href="#testimoni" @click="closeMenu">Testimoni</a></li>
      </ul>
      
      <!-- Login Button or User Avatar -->
      <div v-if="!isLoggedIn" class="auth-buttons">
        <router-link to="/login" class="login-btn" @click="closeMenu">
          Login
        </router-link>
      </div>
      <div v-else class="user-avatar" @click="toggleUserMenu">
        <img 
          :src="displayedPhoto" 
          alt="User" 
          class="avatar-image"
        />
        <div class="user-menu" v-if="showUserMenu">
          <ul>
            <li @click="openProfileModal">Profile</li>
            <li>Settings</li>
            <li @click="openLogoutModal">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Profile Modal -->
  <ModalProfile 
    v-if="showProfileModal"
    @close="closeProfileModal"
  />

  <!-- Logout Modal -->
  <LogoutModal
    :show="showLogoutModal"
    :onLogout="handleLogout"
    @close="closeLogoutModal"
  />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/store/AuthStore.js'
import { storeToRefs } from 'pinia'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import ModalProfile from './ModalProfileComponent.vue'
import LogoutModal from './LogoutModalComponent.vue'

const defaultAvatar = '/images/default-avatar.png'

const authStore = useAuthStore()
const { isLoggedIn, currentUser } = storeToRefs(authStore)

// Refs for UI states
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const isHidden = ref(false)
const lastScrollPosition = ref(0)
const showUserMenu = ref(false)
const userProfilePhoto = ref(null)
const showProfileModal = ref(false)
const showLogoutModal = ref(false)

// Computed property untuk menampilkan foto
const displayedPhoto = computed(() => {
  return userProfilePhoto.value || currentUser.value?.profilePhoto || defaultAvatar
})

// Menu toggles
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.classList.toggle('no-scroll', isMenuOpen.value)
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.classList.remove('no-scroll')
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

// Profile modal controls
const openProfileModal = () => {
  showProfileModal.value = true
  showUserMenu.value = false
  document.body.classList.add('no-scroll')
}

const closeProfileModal = () => {
  showProfileModal.value = false
  document.body.classList.remove('no-scroll')
}

// Logout modal controls
const openLogoutModal = () => {
  showLogoutModal.value = true
  showUserMenu.value = false
  document.body.classList.add('no-scroll')
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
  document.body.classList.remove('no-scroll')
}

// Logout handling
const handleLogout = async () => {
  try {
    await authStore.logoutUser()
    closeLogoutModal()
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Scroll handling
const handleScroll = () => {
  const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
  isScrolled.value = currentScrollPosition > 0

  if (currentScrollPosition < 0) return

  if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60) return

  isHidden.value = currentScrollPosition > lastScrollPosition.value
  lastScrollPosition.value = currentScrollPosition
}

// Fetch user profile photo
const fetchUserProfilePhoto = async () => {
  if (isLoggedIn.value) {
    const user = auth.currentUser
    if (user) {
      try {
        const userQuery = query(collection(db, 'users'), where('uid', '==', user.uid))
        const querySnapshot = await getDocs(userQuery)
        
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data()
          userProfilePhoto.value = userData.profilePhoto || null
        }
      } catch (error) {
        console.error('Error fetching profile photo:', error)
        userProfilePhoto.value = null
      }
    }
  }
}

// Profile update handler
const handleProfileUpdate = () => {
  fetchUserProfilePhoto()
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('profile-updated', handleProfileUpdate)
  fetchUserProfilePhoto()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('profile-updated', handleProfileUpdate)
})
</script>

<style scoped>
.navbar {
  display: flex;
  font-size: 1.01rem;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.glassmorphism {
  background: rgba(245, 245, 245, 0.7) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.navbar-logo .logo {
  height: 60px;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin-right: 2rem;
}

.nav-links li {
  margin-left: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #000033;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #0000ff;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 100;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #000033;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 11;
  }

  .navbar-menu.is-active {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
    margin-bottom: 2rem;
    padding: 0;
  }

  .nav-links li {
    margin: 1rem 0;
    text-align: center;
  }

  .hamburger.is-active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.is-active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

.no-scroll {
  overflow: hidden;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.login-btn {
  padding: 0.5rem 1.5rem;
  background: #007bff;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  transition: background 0.3s;
}

.login-btn:hover {
  background: #0056b3;
}

.user-avatar {
  position: relative;
  cursor: pointer;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 10px;
  min-width: 150px;
}

.user-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-menu li {
  padding: 10px 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.user-menu li:hover {
  background: #f5f5f5;
}

@media (max-width: 768px) {
  .user-menu {
    position: fixed;
    top: auto;
    bottom: 20px;
    right: 20px;
  }
}
</style>
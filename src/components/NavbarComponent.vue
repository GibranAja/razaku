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
      <!-- Desktop Navigation Links -->
      <ul class="nav-links" v-if="!isMobile">
        <li><router-link to="/" @click="scrollToTop">Beranda</router-link></li>
        <li><a href="#products" @click.prevent="scrollToProducts">Produk</a></li>
        <li><router-link to="/orders">Pesananku</router-link></li>
      </ul>

      <!-- Mobile User Navigation Links (Only when logged in) -->
      <ul v-else-if="isMobile && isLoggedIn" class="mobile-user-nav-links">
        <li @click="openProfileModal">Profile</li>
        <li><router-link to="/orders">Pesananku</router-link></li>
        <li @click="openLogoutModal">Logout</li>
      </ul>

      <!-- Login Button or User Avatar -->
      <div v-if="!isLoggedIn" class="auth-buttons">
        <router-link to="/login" class="login-btn" @click="closeMenu"> Login </router-link>
      </div>
      <div v-else class="user-avatar-container">
        <div class="user-avatar" @click="toggleUserMenu">
          <img :src="displayedPhoto" alt="User" class="avatar-image" />
          <div class="mobile-dropdown-icon" v-if="isMobile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>

        <!-- Mobile User Menu Dropdown -->
        <div
          class="user-menu-mobile"
          v-if="isMobile && showUserMenu"
          :class="{
            'menu-enter': showUserMenu,
            'menu-exit': !showUserMenu,
            'menu-visible': showUserMenu
          }"
        >
          <div class="user-menu-mobile-content">
            <div class="user-menu-header">
              <img :src="displayedPhoto" alt="User" class="mobile-menu-avatar" />
              <div class="user-info">
                <span class="user-name">{{ currentUser?.displayName || 'User' }}</span>
                <span class="user-email">{{ currentUser?.email }}</span>
              </div>
              <button class="close-mobile-menu" @click="toggleUserMenu">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Existing Mobile User Menu -->
            <ul class="mobile-user-menu-list">
              <li @click="openProfileModal">Profile</li>
              <li @click="openLogoutModal">Logout</li>
            </ul>
          </div>
        </div>

        <!-- Desktop User Menu -->
        <div v-if="!isMobile && showUserMenu" class="user-menu">
          <ul>
            <li @click="openProfileModal">Profile</li>
            <li @click="openLogoutModal">Logout</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- Profile Modal -->
  <ModalProfile v-if="showProfileModal" @close="closeProfileModal" />

  <!-- Logout Modal -->
  <LogoutModal :show="showLogoutModal" :onLogout="handleLogout" @close="closeLogoutModal" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useAuthStore } from '@/store/AuthStore.js'
import { storeToRefs } from 'pinia'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import ModalProfile from './ModalProfileComponent.vue'
import LogoutModal from './LogoutModalComponent.vue'

import defaultAvatar from '../image/default-avatar.png'

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
const isMobile = ref(false)

// Check if it's mobile view
const checkMobileView = () => {
  const newIsMobile = window.innerWidth <= 768
  isMobile.value = newIsMobile
}

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

  // Add/remove no-scroll for mobile menu
  if (isMobile.value) {
    document.body.classList.toggle('no-scroll', showUserMenu.value)
  }
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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
  closeMenu()
}

const scrollToProducts = () => {
  const productsSection = document.querySelector('#products')
  if (productsSection) {
    productsSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
  closeMenu()
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('profile-updated', handleProfileUpdate)
  window.addEventListener('resize', checkMobileView)
  fetchUserProfilePhoto()
  checkMobileView() // Initial check
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('profile-updated', handleProfileUpdate)
  window.removeEventListener('resize', checkMobileView)
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
  position: relative;
  text-decoration: none;
  color: #000033;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #000033;
  transition: width 0.3s ease;
}

.nav-links a:hover::after {
  width: 100%;
}

.nav-links .router-link-active {
  color: #0000ff;
}

.nav-links .router-link-active::after {
  width: 100%;
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
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

/* Mobile User Menu Styles */
.user-avatar-container {
  position: relative;
}

.mobile-dropdown-icon {
  display: none;
}

.user-menu-mobile {
  display: none;
}

.mobile-user-nav-links {
  display: flex;
  flex-direction: column;
  list-style: none;
  width: 100%;
  padding: 0;
  margin: 0;
}

.mobile-user-nav-links li {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.mobile-user-nav-links li:hover {
  background-color: #f5f5f5;
}

.nav-icon {
  margin-right: 15px;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navbar-menu {
    justify-content: flex-start;
    padding-top: 80px; /* Sesuaikan dengan tinggi navbar */
  }
}

@media (max-width: 768px) {
  .user-avatar-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .user-avatar {
    display: flex;
    align-items: center;
  }

  .user-menu-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: white;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    z-index: 1000;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }

  .user-menu-mobile.menu-visible {
    transform: translateY(0);
  }

  .user-menu-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    gap: 15px;
  }

  .mobile-menu-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #f0f0f0;
  }

  .user-info {
    flex-grow: 1;
  }

  .user-name {
    display: block;
    font-weight: 600;
    font-size: 1rem;
    color: #333;
  }

  .user-email {
    display: block;
    color: #777;
    font-size: 0.85rem;
  }

  .close-mobile-menu {
    background: none;
    border: none;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .close-mobile-menu:hover {
    opacity: 1;
  }

  .mobile-user-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .mobile-user-menu-list li {
    padding: 12px 0;
    border-top: 1px solid #f0f0f0;
    color: #333;
    font-weight: 500;
    cursor: pointer;
    transition: color 0.3s;
  }

  .mobile-user-menu-list li:first-child {
    border-top: none;
  }

  .mobile-user-menu-list li:hover {
    color: #007bff;
  }
}
</style>

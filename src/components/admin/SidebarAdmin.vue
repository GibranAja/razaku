<template>
  <div class="sidebar" :class="{ 'collapsed': !isOpen }">
    <div class="logo">
      <div class="logo-content">
        <div class="logo-icon">
          <i class="fas fa-layer-group"></i>
        </div>
        <h2 :class="{ 'hide-text': !isOpen }">Admin Razaku</h2>
      </div>
    </div>

    <ListSidebar :items="items" :collapsed="!isOpen" />

    <div class="user-profile">
      <div class="profile-content">
        <div class="profile-icon">
          <i class="fas fa-user"></i>
        </div>
        <div class="profile-info" :class="{ 'hide-text': !isOpen }">
          <h4>{{ currentUser.name }}</h4>
          <p>Admin</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListSidebar from './ListSidebar.vue'
import { useAuthStore } from '@/store/AuthStore';

const authStore = useAuthStore()
const { currentUser } = authStore

defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
})

const items = ref([
  { text: 'Dashboard', icon: 'fas fa-home', pathName: 'DashboardAdmin' },
  { text: 'Orders', icon: 'fas fa-shopping-cart', pathName: 'OrderCasing' },
  { text: 'Casing', icon: 'fas fa-mobile-alt', pathName: 'CasingView' },
  { text: 'Voucher', icon: 'fas fa-tag', pathName: 'VoucherView' },
  { text: 'Home', icon: 'fas fa-arrow-left', pathName: 'Home' }
])
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #1e1e2d 0%, #1a1a27 100%);
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
  z-index: 20;
}

.sidebar.collapsed {
  width: 80px;
}

.logo {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.logo-icon {
  min-width: 32px;
  height: 32px;
  background-color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon i {
  color: #1e1e2d;
  font-size: 1.2em;
}

.logo h2 {
  color: white;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: opacity 0.3s ease;
}

.user-profile {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
}

.profile-content {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-icon {
  min-width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-icon i {
  color: white;
}

.profile-info {
  transition: opacity 0.3s ease;
}

.profile-info h4 {
  color: white;
  font-size: 15px;
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
}

.profile-info p {
  color: #a2a3b7;
  font-size: 13px;
  margin: 4px 0 0 0;
  white-space: nowrap;
}

.hide-text {
  opacity: 0;
  visibility: hidden;
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px !important;
  }
  
  .hide-text {
    opacity: 1;
    visibility: visible;
  }
}
</style>
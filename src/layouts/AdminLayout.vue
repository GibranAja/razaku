<template>
  <div class="admin-layout">
    <!-- Sidebar with transition -->
    <SidebarAdmin 
      :is-open="isSidebarOpen" 
      class="sidebar-transition"
      :class="{ 'sidebar-collapsed': !isSidebarOpen }"
    />
    
    <div 
      class="main-content"
      :class="{ 'sidebar-open': isSidebarOpen }"
    >
      <!-- Navbar -->
      <nav class="admin-navbar">
        <button class="toggle-btn" @click="toggleSidebar">
          <i class="fas fa-bars" :class="{ 'rotate': !isSidebarOpen }"></i>
        </button>
        <div class="admin-nav-content">
          <!-- Add any navbar content here -->
        </div>
      </nav>

      <!-- Main Content Area -->
      <main class="content-area">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SidebarAdmin from '../components/admin/SidebarAdmin.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  position: relative;
}

.main-content {
  flex: 1;
  margin-left: 280px; /* Full sidebar width */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content:not(.sidebar-open) {
  margin-left: 80px; /* Collapsed sidebar width */
}

.admin-navbar {
  height: 64px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.toggle-btn i {
  transition: transform 0.3s ease;
}

.toggle-btn i.rotate {
  transform: rotate(180deg);
}

.content-area {
  padding: 1.5rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 64px);
}

/* Sidebar transition class */
.sidebar-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 280px;
  overflow: hidden;
}

.sidebar-collapsed {
  width: 80px !important;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
  }
  
  .sidebar-transition {
    transform: translateX(-100%);
  }
  
  .sidebar-transition:not(.sidebar-collapsed) {
    transform: translateX(0);
  }
}
</style>
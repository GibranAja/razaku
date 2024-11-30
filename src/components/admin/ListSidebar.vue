<template>
    <div class="sidebar-menu">
      <RouterLink
        v-for="item in items"
        :key="item.pathName"
        :to="{ name: item.pathName }"
        class="menu-item"
        :class="{ 
          'collapsed': collapsed,
          'active': isActiveRoute(item.pathName)
        }"
      >
        <div class="icon-container">
          <i :class="item.icon"></i>
        </div>
        <span class="menu-text" :class="{ 'hide-text': collapsed }">
          {{ item.text }}
        </span>
        
        <!-- Tooltip for collapsed state -->
        <div 
          v-if="collapsed" 
          class="tooltip"
        >
          {{ item.text }}
        </div>
      </RouterLink>
    </div>
  </template>
  
  <script setup>
  import { RouterLink, useRoute } from 'vue-router'
  
  defineProps({
    items: {
      type: Array,
      required: true
    },
    collapsed: {
      type: Boolean,
      default: false
    }
  })
  
  const route = useRoute()
  
  const isActiveRoute = (pathName) => {
    return route.name === pathName
  }
  </script>
  
  <style scoped>
  .sidebar-menu {
    padding: 1rem 0;
    max-height: calc(100vh - 180px);
    overflow-y: auto;
  }
  
  .menu-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    color: #a2a3b7;
    text-decoration: none;
    transition: all 0.3s ease;
    gap: 12px;
    margin-bottom: 8px;
    border-radius: 12px;
  }
  
  .menu-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .menu-item.active {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .menu-item.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: white;
    border-radius: 0 4px 4px 0;
  }
  
  .icon-container {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    flex-shrink: 0;
    transition: transform 0.3s ease, background-color 0.3s ease;
  }
  
  .menu-item:hover .icon-container {
    transform: translateX(5px);
    background-color: rgba(255, 255, 255, 0.15);
  }
  
  .menu-item.active .icon-container {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .menu-text {
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
    transition: opacity 0.3s ease;
    letter-spacing: 0.3px;
  }
  
  .hide-text {
    opacity: 0;
    visibility: hidden;
  }
  
  /* Tooltip styling */
  .tooltip {
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    background-color: #1e1e2d;
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    font-size: 0.875rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s ease;
    margin-left: 10px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  
  .menu-item:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
  
  .tooltip::before {
    content: '';
    position: absolute;
    left: -4px;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px 6px 6px 0;
    border-style: solid;
    border-color: transparent #1e1e2d transparent transparent;
  }
  
  /* Scrollbar styles */
  .sidebar-menu::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar-menu::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar-menu::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  .sidebar-menu::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    .tooltip {
      display: none;
    }
  }
  </style>
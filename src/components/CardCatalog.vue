<template>
    <div class="card-catalog">
      <img :src="imageUrl" :alt="title" class="card-image">
      <div class="card-content">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-description">{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    imageUrl: String,
    title: String,
    description: String
  })
  </script>
  
  <style scoped>
  .card-catalog {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .card-catalog:hover {
    transform: translateY(-5px);
  }
  
  .card-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  .card-content {
    padding: 15px;
  }
  
  .card-title {
    margin: 0 0 10px;
    font-size: 1.2rem;
  }
  
  .card-description {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }
  </style>
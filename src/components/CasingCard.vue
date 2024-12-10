<template>
  <div 
    class="casing-card" 
    :class="{ 'out-of-stock': isOutOfStock }"
    @click="handleClick"
  >
    <div class="card">
      <div class="card-image-container">
        <img :src="casing.imageBase64" :alt="casing.name" class="card-image">
        <div v-if="isOutOfStock" class="out-of-stock-overlay">
          <span>Out of Stock</span>
        </div>
      </div>
      <div class="card-details">
        <h3 class="card-title">{{ casing.name }}</h3>
        <div class="card-price">
          <span class="original-price" v-if="casing.discount > 0">
            {{ formatCurrency(casing.price) }}
          </span>
          <span class="final-price">
            {{ formatCurrency(casing.finalPrice) }}
          </span>
        </div>
        <div class="card-themes" v-if="casing.themes?.length">
          <span 
            class="theme-tag" 
            v-for="theme in casing.themes" 
            :key="theme"
          >
            {{ theme }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  casing: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const isOutOfStock = computed(() => {
  return props.casing.stock <= 0
})

const handleClick = () => {
  if (!isOutOfStock.value) {
    emit('click', props.casing)
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value)
}
</script>

<style scoped>
.casing-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.casing-card:not(.out-of-stock):hover {
  transform: scale(1.02);
}

.out-of-stock {
  cursor: not-allowed;
  opacity: 0.8;
}

.card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-image-container {
  height: 150px; /* Reduced height for mobile */
  overflow: hidden;
  position: relative;
}

@media (min-width: 768px) {
  .card-image-container {
    height: 200px; /* Larger height for tablets */
  }
}

@media (min-width: 1024px) {
  .card-image-container {
    height: 250px; /* Original height for desktop */
  }
}

.out-of-stock-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.out-of-stock-overlay span {
  background-color: #dc3545;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Rest of the existing styles remain the same */
.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-details {
  padding: 8px; /* Reduced padding for mobile */
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 0.9rem; /* Smaller font for mobile */
  font-weight: 600;
  /* Prevent text overflow */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.2;
}

.card-price {
  display: flex;
  flex-direction: column; /* Stack prices on mobile */
  gap: 2px;
  margin-bottom: 4px;
}

.original-price {
  text-decoration: line-through;
  color: #888;
  font-size: 0.8rem;
}

.final-price {
  font-weight: bold;
  color: #000;
  font-size: 0.95rem;
}

.card-themes {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.theme-tag {
  background-color: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  white-space: nowrap;
}

/* Tablet and up adjustments */
@media (min-width: 768px) {
  .card-details {
    padding: 12px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-price {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .original-price {
    font-size: 0.9rem;
  }

  .final-price {
    font-size: 1.1rem;
  }

  .theme-tag {
    font-size: 0.8rem;
    padding: 3px 8px;
  }
}

/* Add touch-friendly tap targets for mobile */
@media (max-width: 767px) {
  .card {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}
</style>
<template>
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-content">
          <!-- Close Button -->
          <button class="close-btn" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
  
          <div class="product-details">
            <!-- Image Section -->
            <div class="image-container">
              <img :src="casing.imageBase64" :alt="casing.name" class="product-image">
            </div>
  
            <!-- Info Section -->
            <div class="info-section">
              <h2 class="product-name">{{ casing.name }}</h2>
              
              <!-- Price Section -->
              <div class="price-section">
                <span v-if="casing.discount > 0" class="original-price">
                  {{ formatPrice(casing.price) }}
                </span>
                <span class="final-price">{{ formatPrice(casing.finalPrice) }}</span>
                <span v-if="casing.discount > 0" class="discount-badge">
                  {{ casing.discount }}% OFF
                </span>
              </div>
  
              <!-- Description -->
              <div class="description-section">
                <h3>Description</h3>
                <p>{{ casing.description }}</p>
              </div>
  
              <!-- Action Buttons -->
              <div class="action-buttons">
                <button class="cart-btn" title="Add to Cart">
                  <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="checkout-btn" title="Checkout Now">
                  <i class="fas fa-shopping-bag"></i>
                  Checkout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    show: {
      type: Boolean,
      default: false
    },
    casing: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['close'])
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-container {
    background: white;
    width: 90%;
    max-width: 1000px;
    border-radius: 12px;
    padding: 2rem;
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    transition: color 0.3s;
  }
  
  .close-btn:hover {
    color: #000;
  }
  
  .product-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .image-container {
    width: 100%;
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .product-name {
    font-size: 1.8rem;
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .price-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .original-price {
    color: #999;
    text-decoration: line-through;
    font-size: 1.1rem;
  }
  
  .final-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: #000033;
  }
  
  .discount-badge {
    background-color: #10B981;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  .description-section h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #333;
  }
  
  .description-section p {
    color: #666;
    line-height: 1.6;
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    margin-top: auto;
  }
  
  .cart-btn, .checkout-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .cart-btn {
    background-color: #F3F4F6;
    color: #000033;
  }
  
  .cart-btn:hover {
    background-color: #E5E7EB;
  }
  
  .checkout-btn {
    background-color: #000033;
    color: white;
    flex: 1;
  }
  
  .checkout-btn:hover {
    background-color: #000066;
  }
  
  @media (max-width: 768px) {
    .product-details {
      grid-template-columns: 1fr;
    }
  
    .modal-container {
      padding: 1rem;
      margin: 1rem;
    }
  
    .action-buttons {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: white;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      margin: 0;
    }
  }
  </style>
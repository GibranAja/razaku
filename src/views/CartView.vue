<template>
  <div class="cart-container">
    <NavbarComponent />
    
    <div class="content-wrapper">
      <h1 class="page-title">Shopping Cart</h1>

      <!-- Loading State -->
      <div v-if="cartStore.isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading your cart...</p>
      </div>

      <!-- Empty Cart State -->
      <div v-else-if="!cartStore.cartItems.length" class="empty-state">
        <i class="fas fa-shopping-cart empty-icon"></i>
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart and they will appear here</p>
        <router-link to="/" class="browse-btn">Browse Products</router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartStore.cartItems" 
               :key="item.id" 
               class="cart-item"
          >
            <div class="item-image">
              <img :src="item.casing.imageBase64" :alt="item.casing.name">
            </div>
            
            <div class="item-details">
              <h3 class="item-name">{{ item.casing.name }}</h3>
              
              <div class="price-section">
                <p v-if="item.casing.price !== item.casing.finalPrice" class="original-price">
                  {{ formatPrice(item.casing.price) }}
                </p>
                <p class="final-price">{{ formatPrice(item.casing.finalPrice) }}</p>
              </div>

              <div class="quantity-controls">
                <button 
                  @click="updateQuantity(item.id, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                  class="quantity-btn"
                >
                  <i class="fas fa-minus"></i>
                </button>
                
                <span class="quantity">{{ item.quantity }}</span>
                
                <button 
                  @click="updateQuantity(item.id, item.quantity + 1)"
                  :disabled="item.quantity >= item.casing.stock"
                  class="quantity-btn"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>
            </div>

            <div class="item-actions">
              <p class="item-subtotal">
                {{ formatPrice(item.casing.finalPrice * item.quantity) }}
              </p>
              <button 
                @click="removeItem(item.id)"
                class="remove-btn"
                :disabled="isProcessing"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-item">
            <span>Subtotal ({{ cartStore.cartCount }} items)</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item total">
            <span>Total</span>
            <span>{{ formatPrice(cartStore.cartTotal) }}</span>
          </div>
          <button 
            @click="handleCheckout"
            class="checkout-btn"
            :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : 'Proceed to Checkout' }}
          </button>
        </div>
      </div>
    </div>

    <ModalDetailCasing
      v-if="showDetailModal"
      :show="showDetailModal"
      :casing="selectedCasing"
      @close="showDetailModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/store/CartStore'
import ModalDetailCasing from '@/components/ModalDetailCasing.vue'
import NavbarComponent from '@/components/NavbarComponent.vue'
// import { useRouter } from 'vue-router'

const cartStore = useCartStore()
// const router = useRouter()
const isProcessing = ref(false)
const showDetailModal = ref(false)
const selectedCasing = ref(null)

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const updateQuantity = async (itemId, newQuantity) => {
  isProcessing.value = true
  try {
    await cartStore.updateQuantity(itemId, newQuantity)
  } finally {
    isProcessing.value = false
  }
}

const removeItem = async (itemId) => {
  if (confirm('Are you sure you want to remove this item?')) {
    isProcessing.value = true
    try {
      await cartStore.removeFromCart(itemId)
    } finally {
      isProcessing.value = false
    }
  }
}

const handleCheckout = () => {
  const firstCartItem = cartStore.cartItems[0]
  if (firstCartItem) {
    selectedCasing.value = {
      ...firstCartItem.casing,
      stock: firstCartItem.casing.stock,
      id: firstCartItem.casingId
    }
    showDetailModal.value = true
  }
}

onMounted(() => {
  cartStore.fetchCartItems()
})
</script>

<style scoped>
.cart-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 7rem;
}

.page-title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
}

.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #000033;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #000033;
  margin-bottom: 1rem;
}

.browse-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #000033;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 1rem;
  transition: transform 0.2s;
}

.browse-btn:hover {
  transform: translateY(-2px);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-name {
  font-size: 1.1rem;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.final-price {
  font-size: 1.1rem;
  font-weight: 600;
  color: #000033;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #000033;
  color: #000033;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-size: 1rem;
  min-width: 40px;
  text-align: center;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.item-subtotal {
  font-weight: 600;
  color: #000033;
  font-size: 1.1rem;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s;
}

.remove-btn:hover:not(:disabled) {
  color: #c82333;
}

.cart-summary {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-divider {
  border-top: 1px solid #eee;
  margin: 1rem 0;
}

.summary-item.total {
  font-size: 1.2rem;
  font-weight: 600;
  color: #000033;
}

.checkout-btn {
  width: 100%;
  padding: 1rem;
  background-color: #000033;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.checkout-btn:hover:not(:disabled) {
  background-color: #000066;
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
    padding-top: 6rem;
  }

  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: auto 1fr;
    gap: 1rem;
    position: relative;
  }

  .item-image {
    width: 80px;
    height: 80px;
  }

  .item-actions {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .cart-summary {
    position: static;
    margin-top: 1rem;
  }
}
</style>
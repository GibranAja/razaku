<template>
  <div class="my-orders-container">
    <NavbarComponent />
    
    <div class="content-wrapper">
      <h1 class="page-title">My Orders</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loader"></div>
        <p>Loading your orders...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <i class="fas fa-shopping-bag empty-icon"></i>
        <h2>No Orders Yet</h2>
        <p>Looks like you haven't made any orders yet.</p>
        <router-link to="/" class="browse-btn">Browse Products</router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-grid">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span class="order-id">Order #{{ order.id.slice(0, 8) }}</span>
            <span :class="['status-badge', order.status]">{{ order.status }}</span>
          </div>

          <div class="order-content">
            <div class="product-info">
              <h3>{{ order.casingName }}</h3>
              <p class="quantity">Quantity: {{ order.quantity }}</p>
            </div>

            <div class="price-info">
              <p class="label">Total Amount:</p>
              <p class="amount">{{ formatPrice(order.totalAmount) }}</p>
            </div>

            <div class="delivery-info">
              <p class="label">Delivery Address:</p>
              <p class="address">
                {{ order.shippingAddress.details }},
                {{ order.shippingAddress.city }},
                {{ order.shippingAddress.province }}
              </p>
            </div>

            <div class="date-info">
              <p class="label">Order Date:</p>
              <p>{{ formatDate(order.createdAt) }}</p>
            </div>
          </div>

          <div class="order-actions">
            <button 
              v-if="order.status === 'delivery'" 
              @click="completeOrder(order.id)"
              class="complete-btn"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Processing...' : 'Complete Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/AuthStore'
import { useToast } from 'vue-toastification'
import NavbarComponent from '@/components/NavbarComponent.vue'

const authStore = useAuthStore()
const toast = useToast()
const orders = ref([])
const isLoading = ref(true)
const isProcessing = ref(false)

const fetchOrders = async () => {
  try {
    const orderCollection = collection(db, 'orders')
    const q = query(
      orderCollection,
      where('userId', '==', authStore.currentUser.id),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q)
    
    orders.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load your orders')
  } finally {
    isLoading.value = false
  }
}

const completeOrder = async (orderId) => {
  isProcessing.value = true
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      status: 'completed',
      completedAt: Date.now()
    })
    
    // Update local state
    const orderIndex = orders.value.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'completed'
    }
    
    toast.success('Order marked as completed')
  } catch (error) {
    console.error('Error completing order:', error)
    toast.error('Failed to complete order')
  } finally {
    isProcessing.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price)
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.my-orders-container {
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

.orders-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.order-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-4px);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.order-id {
  font-weight: 600;
  color: #1a1a1a;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.processing {
  background-color: #cce5ff;
  color: #004085;
}

.status-badge.delivery {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #1b5e20;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-info h3 {
  font-size: 1.1rem;
  margin: 0;
}

.quantity {
  color: #666;
  margin: 0.25rem 0;
}

.label {
  color: #666;
  margin-bottom: 0.25rem;
}

.amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #000033;
}

.address {
  font-size: 0.9rem;
  line-height: 1.4;
}

.order-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.complete-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #000033;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.complete-btn:hover:not(:disabled) {
  background-color: #000066;
}

.complete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1rem;
    padding-top: 6rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }
}
</style>
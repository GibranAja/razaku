<template>
  <div class="order-container">
    <h1 class="page-title">Order Management</h1>

    <div class="table-wrapper">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-spinner"></div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="empty-state">
        <p>No orders found</p>
      </div>

      <!-- Orders Table -->
      <table v-else class="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Payment Proof</th> <!-- New column -->
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id">
            <td>{{ order.id.slice(0, 8) }}...</td>
            <td>{{ order.userName }}</td>
            <td>{{ order.casingName }}</td>
            <td>{{ order.quantity }}</td>
            <td>{{ formatPrice(order.totalAmount) }}</td>
            <td>
              <span :class="['status-badge', order.status]">
                {{ order.status }}
              </span>
            </td>
            <td>
              <div v-if="order.paymentProof" class="payment-proof">
                <img 
                  :src="order.paymentProof" 
                  alt="Payment Proof" 
                  class="payment-proof-thumb"
                  @click="openPaymentProof(order.paymentProof)"
                />
              </div>
              <span v-else>No proof</span>
            </td>
            <td>{{ formatDate(order.createdAt) }}</td>
            <td>
              <button 
                @click="openStatusModal(order)"
                class="action-btn"
                :disabled="order.status === 'cancelled'"
              >
                Update Status
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Status Update Modal -->
    <div v-if="showStatusModal" class="modal-overlay" @click.self="closeStatusModal">
      <div class="modal-container">
        <h2 class="modal-title">Update Order Status</h2>
        <p class="order-info">
          Order ID: {{ selectedOrder?.id.slice(0, 8) }}...
        </p>
        <p class="order-info">
          Current Status: 
          <span :class="['status-badge', selectedOrder?.status]">
            {{ selectedOrder?.status }}
          </span>
        </p>

        <div class="status-actions">
          <button 
            @click="updateOrderStatus('cancelled')"
            class="cancel-btn"
            :disabled="isProcessing"
          >
            Cancel Order
          </button>
          <button 
            @click="updateOrderStatus(selectedOrder?.status === 'processing' ? 'delivery' : 'processing')"
            class="process-btn"
            :disabled="isProcessing"
          >
            {{ selectedOrder?.status === 'processing' ? 'Mark as Delivery' : 'Process Order' }}
          </button>
        </div>

        <button @click="closeStatusModal" class="close-btn">Close</button>
      </div>
    </div>

    <!-- Add this after the Status Update Modal -->
    <div v-if="showRejectModal" class="modal-overlay" @click.self="closeRejectModal">
      <div class="modal-container">
        <h2 class="modal-title">Cancel Order</h2>
        <p class="order-info">
          Order ID: {{ selectedOrder?.id.slice(0, 8) }}...
        </p>

        <div class="form-group">
          <label class="form-label">Reason for Cancellation</label>
          <textarea 
            v-model="rejectionReason"
            class="rejection-reason"
            placeholder="Please provide a reason for cancellation..."
            rows="4"
          ></textarea>
        </div>

        <div class="status-actions">
          <button 
            @click="closeRejectModal"
            class="secondary-btn"
          >
            Back
          </button>
          <button 
            @click="confirmReject"
            class="cancel-btn"
            :disabled="!rejectionReason.trim() || isProcessing"
          >
            {{ isProcessing ? 'Cancelling...' : 'Confirm Cancellation' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useToast } from 'vue-toastification'

const toast = useToast()
const orders = ref([])
const showStatusModal = ref(false)
const showRejectModal = ref(false) // Add this
const selectedOrder = ref(null)
const isProcessing = ref(false)
const rejectionReason = ref('') // Add this

// Add loading state
const isLoading = ref(false)

const fetchOrders = async () => {
  isLoading.value = true
  try {
    const orderCollection = collection(db, 'orders')
    const q = query(orderCollection, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    
    orders.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error('Failed to load orders')
  } finally {
    isLoading.value = false
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

const openStatusModal = (order) => {
  selectedOrder.value = order
  showStatusModal.value = true
}

const closeStatusModal = () => {
  selectedOrder.value = null
  showStatusModal.value = false
}

// Modify updateOrderStatus function
const updateOrderStatus = async (newStatus) => {
  if (!selectedOrder.value) return

  if (newStatus === 'cancelled') {
    showStatusModal.value = false
    showRejectModal.value = true
    return
  }

  isProcessing.value = true
  try {
    const orderRef = doc(db, 'orders', selectedOrder.value.id)
    await updateDoc(orderRef, {
      status: newStatus
    })
    
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = newStatus
    }
    
    toast.success(`Order status updated to ${newStatus}`)
    closeStatusModal()
  } catch (error) {
    console.error('Error updating order status:', error)
    toast.error('Failed to update order status')
  } finally {
    isProcessing.value = false
  }
}

// Add these new functions
const closeRejectModal = () => {
  showRejectModal.value = false
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) return

  isProcessing.value = true
  try {
    const orderRef = doc(db, 'orders', selectedOrder.value.id)
    await updateDoc(orderRef, {
      status: 'cancelled',
      rejectionReason: rejectionReason.value.trim(),
      cancelledAt: Date.now()
    })
    
    const orderIndex = orders.value.findIndex(o => o.id === selectedOrder.value.id)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
      orders.value[orderIndex].rejectionReason = rejectionReason.value.trim()
    }
    
    toast.success('Order cancelled successfully')
    closeRejectModal()
  } catch (error) {
    console.error('Error cancelling order:', error)
    toast.error('Failed to cancel order')
  } finally {
    isProcessing.value = false
  }
}

const openPaymentProof = (imageUrl) => {
  // Create a link element
  const link = document.createElement('a')
  link.href = imageUrl
  link.target = '_blank'
  
  if (imageUrl.startsWith('data:image')) {
    // Create a new window/tab and write the image as HTML content
    const newWindow = window.open()
    newWindow.document.write(`
      <html>
        <head>
          <title>Payment Proof</title>
        </head>
        <body style="margin:0;display:flex;justify-content:center;align-items:center;background:#f1f1f1;">
          <img src="${imageUrl}" style="max-width:100%;max-height:100vh;object-fit:contain;" />
        </body>
      </html>
    `)
    newWindow.document.close()
  } else {
    link.click()
  }
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.order-container {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  color: #1F2937;
  margin-bottom: 2rem;
}

.table-wrapper {
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.order-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.order-table th,
.order-table td {
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
}

.order-table th {
  background-color: #F9FAFB;
  font-weight: 600;
  color: #374151;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-badge.pending {
  background-color: #FEF3C7;
  color: #92400E;
}

.status-badge.processing {
  background-color: #DBEAFE;
  color: #1E40AF;
}


.status-badge.delivery {
  background-color: #f4e0ff; /* Light indigo background */
  color: #a838ca; /* Darker indigo text */
}

.status-badge.cancelled {
  background-color: #FEE2E2;
  color: #991B1B;
}

.action-btn {
  background-color: #3B82F6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.action-btn:hover:not(:disabled) {
  background-color: #2563EB;
}

.action-btn:disabled {
  background-color: #E5E7EB;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-title {
  font-size: 1.5rem;
  color: #1F2937;
  margin-bottom: 1rem;
}

.order-info {
  margin-bottom: 1rem;
  color: #4B5563;
}

.status-actions {
  display: flex;
  gap: 1rem;
  margin: 1.5rem 0;
}

.cancel-btn,
.process-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.cancel-btn {
  background-color: #EF4444;
  color: white;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #DC2626;
}

.process-btn {
  background-color: #10B981;
  color: white;
}

.process-btn:hover:not(:disabled) {
  background-color: #059669;
}

.close-btn {
  width: 100%;
  padding: 0.75rem;
  background-color: #F3F4F6;
  border: none;
  border-radius: 6px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #E5E7EB;
}

.cancel-btn:disabled,
.process-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty state styles */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6B7280;
}

/* Loading state styles */
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.payment-proof {
  display: flex;
  justify-content: center;
  align-items: center;
}

.payment-proof-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.payment-proof-thumb:hover {
  transform: scale(1.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.rejection-reason {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  resize: vertical;
  min-height: 100px;
  font-size: 0.875rem;
  line-height: 1.5;
}

.rejection-reason:focus {
  outline: none;
  border-color: #3B82F6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.secondary-btn {
  padding: 0.75rem 1.5rem;
  background-color: #F3F4F6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.secondary-btn:hover {
  background-color: #E5E7EB;
}
</style>
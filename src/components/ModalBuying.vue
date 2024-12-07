<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <button class="close-btn" @click="$emit('close')">
        <i class="fas fa-times"></i>
      </button>

      <div class="payment-content">
        <h2 class="payment-title">Payment Details</h2>
        
        <!-- Total Amount -->
        <div class="amount-section">
          <h3>Total Payment</h3>
          <p class="amount">{{ formatPrice(totalAmount) }}</p>
        </div>

        <!-- QRIS Image -->
        <div class="qris-section">
          <h3>Scan QRIS to Pay</h3>
          <img src="@/image/qris.jpeg" alt="QRIS Code" class="qris-image">
        </div>

        <!-- Payment Instructions -->
        <div class="instructions-section">
          <h3>Payment Instructions</h3>
          <ol class="instruction-list">
            <li>Open your mobile banking or e-wallet app</li>
            <li>Select QRIS payment or scan QR</li>
            <li>Scan the QRIS code above</li>
            <li>Check the payment details and amount</li>
            <li>Complete the payment in your app</li>
            <li>Upload proof of payment below</li>
          </ol>
        </div>

        <!-- Payment Proof Upload -->
        <div class="upload-section">
          <h3>Upload Payment Proof</h3>
          <input 
            type="file" 
            @change="handleFileUpload" 
            accept="image/*"
            ref="fileInput"
            class="file-input"
          >
          <div v-if="paymentProof" class="preview-container">
            <img :src="paymentProof" alt="Payment Proof" class="proof-preview">
          </div>
        </div>

        <!-- Confirm Button -->
        <button 
          class="confirm-btn"
          :disabled="!paymentProof"
          @click="confirmPayment"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  totalAmount: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'confirm']);

const paymentProof = ref(null);
const fileInput = ref(null);

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      paymentProof.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const confirmPayment = () => {
  emit('confirm', paymentProof.value);
};
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
  max-width: 600px;
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

.payment-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.payment-title {
  text-align: center;
  font-size: 1.8rem;
  color: #000033;
  margin-bottom: 1rem;
}

.amount-section {
  text-align: center;
}

.amount {
  font-size: 2rem;
  font-weight: bold;
  color: #000033;
  margin-top: 0.5rem;
}

.qris-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.qris-image {
  max-width: 300px;
  width: 100%;
  height: auto;
}

.instructions-section {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.instruction-list {
  margin-top: 1rem;
  padding-left: 1.5rem;
}

.instruction-list li {
  margin-bottom: 0.75rem;
  color: #4a5568;
  line-height: 1.5;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  cursor: pointer;
}

.preview-container {
  max-width: 300px;
  margin: 1rem auto;
}

.proof-preview {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.confirm-btn {
  background-color: #000033;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-btn:hover {
  background-color: #000066;
}

.confirm-btn:disabled {
  background-color: #cbd5e0;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-container {
    padding: 1rem;
    margin: 1rem;
  }

  .payment-title {
    font-size: 1.5rem;
  }

  .amount {
    font-size: 1.5rem;
  }
}
</style>
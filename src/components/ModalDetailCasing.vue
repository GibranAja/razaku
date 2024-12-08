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
            <img :src="casing.imageBase64" :alt="casing.name" class="product-image" />
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

            <!-- Location Selection -->
            <div class="location-section">
              <h3>Shipping Location</h3>

              <!-- Province Dropdown -->
              <div class="form-group">
                <label>Province</label>
                <div v-if="shippingStore.loading" class="loading-spinner">Loading...</div>
                <select
                  v-else
                  v-model="selectedProvince"
                  class="location-select"
                  @change="handleProvinceChange"
                >
                  <option value="">Select Province</option>
                  <option
                    v-for="prov in provinces"
                    :key="prov.province_id"
                    :value="prov.province_id"
                  >
                    {{ prov.province }}
                  </option>
                </select>
                <span v-if="shippingStore.error" class="error-message">
                  {{ shippingStore.error }}
                </span>
              </div>

              <!-- City Dropdown -->
              <div class="form-group">
                <label>City</label>
                <div v-if="shippingStore.loading" class="loading-spinner">Loading...</div>
                <select
                  v-else
                  v-model="selectedCity"
                  class="location-select"
                  :disabled="!selectedProvince"
                  @change="handleCityChange"
                >
                  <option value="">Select City</option>
                  <option v-for="city in cities" :key="city.city_id" :value="city">
                    {{ city.type }} {{ city.city_name }}
                  </option>
                </select>
              </div>

              <!-- Address Details -->
              <div class="form-group">
                <label>Detailed Address</label>
                <textarea
                  v-model="addressDetails"
                  placeholder="Enter your complete address..."
                  class="address-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <!-- Update the shipping cost section -->
            <div class="shipping-cost-section" v-if="selectedCity">
              <h3>Order Summary</h3>
              <div class="order-summary">
                <div class="summary-item">
                  <span>Product Price</span>
                  <span>{{ formatPrice(casing.finalPrice) }}</span>
                </div>
                <div class="summary-item">
                  <span>Shipping Cost</span>
                  <span>{{ formatPrice(shippingCost) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-item total">
                  <span>Total</span>
                  <span>{{ formatPrice(totalPrice) }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="cart-btn" title="Add to Cart" @click="handleAddToCart">
                <i class="fas fa-shopping-cart"></i>
              </button>
              <button
                class="checkout-btn"
                title="Checkout Now"
                :disabled="!isShippingComplete"
                :class="{ disabled: !isShippingComplete }"
                @click="handleCheckout"
              >
                <i class="fas fa-shopping-bag"></i>
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalBuying
    v-if="showBuyingModal"
    :total-amount="totalPrice"
    :order-data="{
      casing,
      shippingCost,
      totalAmount: totalPrice,
      shippingAddress: {
        province: provinces.find(p => p.province_id === selectedProvince)?.province,
        city: selectedCity.city_name,
        details: addressDetails
      }
    }"
    @close="showBuyingModal = false"
    @confirm="handlePaymentConfirmation"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ModalBuying from './ModalBuying.vue';
import { useShippingStore } from '@/store/ShippingStore'

const shippingStore = useShippingStore()
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  casing: {
    type: Object,
    required: true
  }
})
const showBuyingModal = ref(false)

// Add new refs for location data
const provinces = ref([])
const cities = ref([])
const selectedProvince = ref('')
const selectedCity = ref({})
const addressDetails = ref('')

defineEmits(['close'])

// Add new methods for handling location
const handleProvinceChange = async () => {
  selectedCity.value = {} // Reset selected city
  if (selectedProvince.value) {
    await shippingStore.fetchCities(selectedProvince.value) // Add this line
    cities.value = shippingStore.cities
  }
}

// Add computed property for shipping cost
const shippingCost = computed(() => shippingStore.calculateShippingCost)

// Add computed property for total price
const totalPrice = computed(() => {
  return (props.casing.finalPrice || 0) + (shippingCost.value || 0)
})

// Update handleCitySelection
const handleCityChange = () => {
  const selectedCityData = cities.value.find((city) => city.city_id === selectedCity.value.city_id)
  if (selectedCityData) {
    // Update the local ref with the full city data
    selectedCity.value = selectedCityData
    // Update the store
    shippingStore.setSelectedCity(selectedCityData)
  }
}

// Fetch provinces on mount
onMounted(async () => {
  await shippingStore.fetchProvinces()
  provinces.value = shippingStore.province
})

// Keep existing price formatter
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Add this computed property alongside your existing ones
const isShippingComplete = computed(() => {
  return (
    selectedProvince.value && selectedCity.value?.city_id && addressDetails.value.trim().length > 0
  )
})

// Add the handleCheckout method
const handleCheckout = () => {
  showBuyingModal.value = true
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
  background-color: #10b981;
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

.location-section {
  margin-top: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.location-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
}

.location-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.location-select:focus {
  outline: none;
  border-color: #000033;
}

.address-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.3s ease;
}

.address-textarea:focus {
  outline: none;
  border-color: #000033;
}

.shipping-cost-section {
  margin-top: 0.2rem;
  padding-top: 0.2rem;
  border-top: 1px solid #eee;
}

.order-summary {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.summary-divider {
  border-top: 1px solid #ddd;
  margin: 0.5rem 0;
}

.summary-item.total {
  font-weight: 600;
  color: #000033;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

.cart-btn,
.checkout-btn {
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
  background-color: #f3f4f6;
  color: #000033;
}

.cart-btn:hover {
  background-color: #e5e7eb;
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

  .location-section {
    margin-bottom: 80px; /* Add space for fixed action buttons */
  }

  .shipping-cost-section {
    margin-bottom: 80px; /* Add space for fixed action buttons */
  }
}

/* Add these styles */
.loading-spinner {
  font-size: 1rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.error-message {
  color: red;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Add these styles to your existing styles */
.checkout-btn:disabled {
  background-color: #bebebe; /* Light gray from the theme */
  cursor: not-allowed;
  opacity: 0.8;
}

.checkout-btn:disabled:hover {
  background-color: #bebebe;
  transform: none;
}

/* Add a tooltip style to show why button is disabled */
.checkout-btn.disabled {
  position: relative;
}

.checkout-btn.disabled:hover::after {
  content: 'Please complete shipping information';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f2937; /* Dark blue-gray from theme */
  color: #f9fafb; /* Light text color from theme */
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  margin-bottom: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>

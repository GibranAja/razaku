// src/store/ShippingStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { rajaOngkirApi } from '@/api/rajaOngkir'

export const useShippingStore = defineStore('shipping', () => {
  const province = ref([])
  const cities = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCity = ref(null)

  // Define shipping zones
  const JABODETABEK_CITIES = [
    'JAKARTA UTARA', 'JAKARTA SELATAN', 'JAKARTA TIMUR', 
    'JAKARTA BARAT', 'JAKARTA PUSAT', 'TANGERANG', 
    'TANGERANG SELATAN', 'BEKASI', 'DEPOK'
  ]

  // Shipping cost calculator
  const calculateShippingCost = computed(() => {
    if (!selectedCity.value) return 0

    const cityName = selectedCity.value.city_name.toUpperCase()
    const cityType = selectedCity.value.type.toUpperCase()
    
    // Check for Bogor (both Kabupaten and Kota)
    if (cityName === 'BOGOR' && (cityType === 'KABUPATEN' || cityType === 'KOTA')) {
      return 5000  // Return number explicitly
    }
    
    // Jabodetabek cities
    if (JABODETABEK_CITIES.includes(cityName)) {
      return 12000 // Return number explicitly
    }
    
    // Rest of Indonesia  
    return 20000  // Return number explicitly
  })

  // Optimized province fetching
  const fetchProvinces = async () => {
    if (province.value.length > 0) return // Return if data exists
    
    loading.value = true
    error.value = null

    try {
      const response = await rajaOngkirApi.getProvinces()
      
      if (response?.rajaongkir?.status?.code === 200) {
        province.value = response.rajaongkir.results
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      error.value = err.message
      province.value = []
    } finally {
      loading.value = false
    }
  }

  // Optimized city fetching
  const fetchCities = async (provinceId) => {
    if (!provinceId) return
    
    loading.value = true
    error.value = null
    cities.value = [] // Reset cities when province changes

    try {
      const response = await rajaOngkirApi.getCities(provinceId)
      
      if (response?.rajaongkir?.status?.code === 200) {
        cities.value = response.rajaongkir.results
      } else {
        throw new Error('Invalid API response')
      }
    } catch (err) {
      error.value = err.message
      cities.value = []
    } finally {
      loading.value = false
    }
  }

  // Reset store
  const resetStore = () => {
    province.value = []
    cities.value = []
    loading.value = false
    error.value = null
    rajaOngkirApi.clearCache()
  }

  return {
    province,
    cities,
    loading,
    error,
    selectedCity,
    calculateShippingCost,
    fetchProvinces,
    fetchCities,
    resetStore,
    setSelectedCity: (city) => selectedCity.value = city
  }
})
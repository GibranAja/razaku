import { defineStore } from 'pinia'
import { ref } from 'vue'
import { rajaOngkirApi } from '@/api/rajaOngkir'

export const useShippingStore = defineStore('shipping', () => {
  // State
  const province = ref([])
  const cities = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions

  const fetchProvinces = async () => {
    loading.value = true
    try {
      const data = await rajaOngkirApi.getProvince()
      province.value = data.rajaOngkirApi.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchCities = async (provinceId) => {
    loading.value = true
    try {
      const data = await rajaOngkirApi.getCities(provinceId)
      cities.value = data.rajaOngkirApi.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchCost = async (origin, destination, weight, courier) => {
    loading.value = true
    try {
      const data = await rajaOngkirApi.getCost(origin, destination, weight, courier)
      return data.rajaOngkirApi.results
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return {
    province,
    cities,
    loading,
    error,
    fetchProvinces,
    fetchCities,
    fetchCost
  }
})

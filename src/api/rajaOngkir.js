// src/api/rajaOngkir.js
const API_KEY = 'f5bbc8efa8f9454734a47ea7558f1737'
const BASE_URL = '/api'

const cache = {
  provinces: null,
  cities: new Map()
}

const headers = {
  'key': API_KEY,
  'content-type': 'application/json'
}

export const rajaOngkirApi = {
  async getProvinces() {
    try {
      if (cache.provinces) {
        return cache.provinces
      }

      const response = await fetch(`${BASE_URL}/province`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      cache.provinces = data
      return data

    } catch (error) {
      console.error('Province fetch error:', error)
      throw new Error('Failed to fetch provinces')
    }
  },

  async getCities(provinceId) {
    try {
      if (cache.cities.has(provinceId)) {
        return cache.cities.get(provinceId)
      }

      const response = await fetch(`${BASE_URL}/city?province=${provinceId}`, {
        method: 'GET',
        headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      cache.cities.set(provinceId, data)
      return data

    } catch (error) {
      console.error('City fetch error:', error)
      throw new Error('Failed to fetch cities')
    }
  },

  clearCache() {
    cache.provinces = null
    cache.cities.clear()
  }
}

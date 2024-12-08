// src/store/OrderStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from './AuthStore'
import { useToast } from 'vue-toastification'

export const useOrderStore = defineStore('order', () => {
  const isProcessing = ref(false)
  const authStore = useAuthStore()
  const toast = useToast()

  const createOrder = async (orderData) => {
    isProcessing.value = true
    
    try {
      // Create order document in Firestore
      const orderCollection = collection(db, 'orders')
      const order = {
        userId: authStore.currentUser.id,
        userName: authStore.currentUser.name,
        userEmail: authStore.currentUser.email,
        casingId: orderData.casing.id,
        casingName: orderData.casing.name,
        price: orderData.casing.finalPrice,
        shippingCost: orderData.shippingCost,
        totalAmount: orderData.totalAmount,
        shippingAddress: {
          province: orderData.shippingAddress.province,
          city: orderData.shippingAddress.city,
          details: orderData.shippingAddress.details
        },
        paymentProof: orderData.paymentProof,
        status: 'pending',
        createdAt: Date.now()
      }

      await addDoc(orderCollection, order)
      toast.success('Order successfully placed!')
      return true

    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to process order. Please try again.')
      return false
      
    } finally {
      isProcessing.value = false
    }
  }

  return {
    isProcessing,
    createOrder
  }
})
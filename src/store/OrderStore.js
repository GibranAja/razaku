// src/store/OrderStore.js

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from './AuthStore'
import { useToast } from 'vue-toastification'

export const useOrderStore = defineStore('order', () => {
  const isProcessing = ref(false)
  const authStore = useAuthStore()
  const toast = useToast()

  const updateCasingStock = async (casingId, quantity) => {
    const casingRef = doc(db, 'casings', casingId)
    const casingSnap = await getDoc(casingRef)
    
    if (casingSnap.exists()) {
      const currentStock = casingSnap.data().stock
      const newStock = currentStock - quantity
      
      if (newStock < 0) {
        throw new Error('Not enough stock available')
      }
      
      await updateDoc(casingRef, {
        stock: newStock
      })
    }
  }

  const createOrder = async (orderData) => {
    isProcessing.value = true
    
    try {
      // Check and update stock first
      await updateCasingStock(orderData.casing.id, orderData.quantity)
      
      // Create order document in Firestore
      const orderCollection = collection(db, 'orders')
      const order = {
        userId: authStore.currentUser.id,
        userName: authStore.currentUser.name,
        userEmail: authStore.currentUser.email,
        casingId: orderData.casing.id,
        casingName: orderData.casing.name,
        quantity: orderData.quantity,
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
      if (error.message === 'Not enough stock available') {
        toast.error('Sorry, not enough stock available.')
      } else {
        toast.error('Failed to process order. Please try again.')
      }
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
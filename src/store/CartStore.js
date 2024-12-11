// src/store/CartStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { collection, addDoc, deleteDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from './AuthStore'
import { useToast } from 'vue-toastification'

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([])
  const isLoading = ref(false)
  const authStore = useAuthStore()
  const toast = useToast()

  // Collection reference
  const cartCollection = collection(db, 'carts')

  // Computed total items in cart
  const cartCount = computed(() => {
    return cartItems.value.length
  })

  // Computed total price
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.casing.finalPrice * item.quantity)
    }, 0)
  })

  // Fetch cart items for current user
  const fetchCartItems = async () => {
    if (!authStore.isLoggedIn) return

    isLoading.value = true
    try {
      const q = query(
        cartCollection, 
        where('userId', '==', authStore.currentUser.id)
      )
      const snapshot = await getDocs(q)
      
      cartItems.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching cart:', error)
      toast.error('Failed to load cart items')
    } finally {
      isLoading.value = false
    }
  }

  // Add item to cart
  const addToCart = async (casing, quantity = 1) => {
    if (!authStore.isLoggedIn) {
      toast.error('Please login to add items to cart')
      return false
    }

    isLoading.value = true
    try {
      // Check if item already exists in cart
      const existingItem = cartItems.value.find(
        item => item.casingId === casing.id
      )

      if (existingItem) {
        toast.info('Item already in cart')
        return false
      }

      // Add new cart item
      const cartItem = {
        userId: authStore.currentUser.id,
        casingId: casing.id,
        casing: {
          name: casing.name,
          imageBase64: casing.imageBase64,
          price: casing.price,
          finalPrice: casing.finalPrice,
          stock: casing.stock
        },
        quantity: quantity,
        addedAt: Date.now()
      }

      const docRef = await addDoc(cartCollection, cartItem)
      cartItems.value.push({ id: docRef.id, ...cartItem })
      
      toast.success('Added to cart')
      return true
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    isLoading.value = true
    try {
      await deleteDoc(doc(cartCollection, cartItemId))
      cartItems.value = cartItems.value.filter(item => item.id !== cartItemId)
      toast.success('Item removed from cart')
      return true
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update item quantity
  const updateQuantity = async (cartItemId, newQuantity) => {
    const item = cartItems.value.find(item => item.id === cartItemId)
    if (!item) return false

    if (newQuantity > item.casing.stock) {
      toast.error('Not enough stock available')
      return false
    }

    try {
      await updateDoc(doc(cartCollection, cartItemId), {
        quantity: newQuantity
      })
      
      const itemIndex = cartItems.value.findIndex(item => item.id === cartItemId)
      if (itemIndex !== -1) {
        cartItems.value[itemIndex].quantity = newQuantity
      }
      
      return true
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast.error('Failed to update quantity')
      return false
    }
  }

  // Clear cart
  const clearCart = async () => {
    isLoading.value = true
    try {
      const deletePromises = cartItems.value.map(item => 
        deleteDoc(doc(cartCollection, item.id))
      )
      await Promise.all(deletePromises)
      cartItems.value = []
      return true
    } catch (error) {
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    fetchCartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  }
})
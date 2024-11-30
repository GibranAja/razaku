<!-- LogoutModal.vue -->
<template>
    <Transition name="modal-fade">
      <div v-if="show" class="modal-overlay" @click="$emit('close')">
        <div class="modal-container" @click.stop>
          <div class="modal-content">
            <h3 class="modal-title">Konfirmasi Logout</h3>
            <p class="modal-message">Apakah Anda yakin ingin keluar?</p>
            <div class="modal-buttons">
              <button 
                class="cancel-btn" 
                @click="$emit('close')"
              >
                Batal
              </button>
              <button 
                class="logout-btn" 
                :class="{ 'processing': isProcessing }"
                :disabled="isProcessing"
                @click="handleLogout"
              >
                {{ logoutButtonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      required: true
    },
    onLogout: {
      type: Function,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  const isProcessing = ref(false);
  
  const logoutButtonText = computed(() => {
    return isProcessing.value ? 'Logging out...' : 'Logout';
  });
  
  const handleLogout = async () => {
    isProcessing.value = true;
    try {
      await props.onLogout();
      emit('close');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      isProcessing.value = false;
    }
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
    border-radius: 8px;
    padding: 2rem;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .modal-content {
    text-align: center;
  }
  
  .modal-title {
    margin: 0 0 1rem;
    color: #333;
    font-size: 1.5rem;
  }
  
  .modal-message {
    margin-bottom: 1.5rem;
    color: #666;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
  
  .cancel-btn, .logout-btn {
    padding: 0.5rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .cancel-btn {
    background-color: #e0e0e0;
    color: #333;
  }
  
  .cancel-btn:hover {
    background-color: #d0d0d0;
  }
  
  .logout-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .logout-btn:hover:not(:disabled) {
    background-color: #c82333;
  }
  
  .logout-btn.processing {
    background-color: #b52a37;
    cursor: not-allowed;
  }
  
  /* Modal Animation */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: all 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .modal-fade-enter-to,
  .modal-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  </style>
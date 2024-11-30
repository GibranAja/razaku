<template>
  <div class="not-found-wrapper">
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="not-found-image-container">
          <img 
            :src="notFoundImage" 
            alt="Page Not Found" 
            class="not-found-image"
          />
        </div>
        
        <div class="not-found-text">
          <h1>Ups! Halaman Tidak Ditemukan</h1>
          <p>Sepertinya Anda telah tersesat di labirin digital kami. Jangan khawatir, mari kita temukan jalan kembali.</p>
          
          <div class="action-buttons">
            <button 
              @click="goBack" 
              class="btn-back"
            >
              Kembali
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button 
              @click="goHome" 
              class="btn-home"
            >
              Beranda
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import NotFound from '../../assets/NotFound.svg'

const notFoundImage = NotFound
const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push({ name: 'HomePublic' })
}
</script>

<style scoped>
.not-found-wrapper {
  background: linear-gradient(135deg, #f0f4f8 0%, #e6eaf3 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.not-found-container {
  max-width: 1000px;
  width: 100%;
  background-color: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(105, 120, 135, 0.1), 0 10px 20px rgba(105, 120, 135, 0.05);
  overflow: hidden;
  display: flex;
  animation: gentle-float 4s ease-in-out infinite;
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.not-found-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.not-found-image-container {
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
  padding: 40px;
}

.not-found-image {
  max-width: 500px;
  width: 100%;
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 15px 30px rgba(105, 120, 135, 0.1));
}

.not-found-text {
  flex: 1;
  padding: 40px;
  text-align: left;
}

h1 {
  color: #2c3e50;
  font-size: 2.75rem;
  margin-bottom: 20px;
  font-weight: 800;
  line-height: 1.2;
}

p {
  color: #6b7280;
  margin-bottom: 35px;
  line-height: 1.7;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.btn-back, .btn-home {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  gap: 10px;
  font-size: 1rem;
  color: white;
}

.btn-back {
  background-color: #4a90e2;
}

.btn-home {
  background-color: #34d399;
}

.btn-back:hover {
  background-color: #3a7bd5;
  transform: translateY(-3px);
}

.btn-home:hover {
  background-color: #2ac79c;
  transform: translateY(-3px);
}

.btn-back svg, .btn-home svg {
  stroke: white;
  margin-left: 5px;
}

@media (max-width: 900px) {
  .not-found-content {
    flex-direction: column;
    text-align: center;
  }

  .not-found-text {
    padding: 30px;
  }

  .action-buttons {
    justify-content: center;
  }

  .not-found-image-container {
    padding: 20px;
  }
}
</style>
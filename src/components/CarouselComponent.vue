<template>
  <div class="carousel-container" ref="container">
    <div class="carousel-aspect-ratio-box">
      <div
        class="carousel"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div v-for="(image, index) in images" :key="index" class="carousel-slide">
          <img
            :src="image"
            :alt="`Slide ${index + 1}`"
            class="carousel-image"
            @load="onImageLoad"
          />
        </div>
      </div>
      <button @click="prevSlide" class="carousel-button prev">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000033"
          width="24"
          height="24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>
      <button @click="nextSlide" class="carousel-button next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="#000033"
          width="24"
          height="24"
        >
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        </svg>
      </button>
      <div class="carousel-indicators">
        <span
          v-for="(_, index) in images"
          :key="index"
          :class="['indicator', { active: index === currentIndex }]"
          @click="goToSlide(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import image2 from '../image/2.png'
import image4 from '../image/4.png'
import image6 from '../image/6.png'
import image8 from '../image/8.png'

const images = ref([image2, image4, image6, image8])

const currentIndex = ref(0)
const timer = ref(null)
const aspectRatio = ref(16 / 9)
const touchStartX = ref(0)
const touchEndX = ref(0)
const container = ref(null)

const startTimer = () => {
  timer.value = setInterval(nextSlide, 4000)
}

const stopTimer = () => {
  clearInterval(timer.value)
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + images.value.length) % images.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const onImageLoad = (event) => {
  const img = event.target
  aspectRatio.value = img.naturalWidth / img.naturalHeight
  container.value.style.setProperty('--aspect-ratio', aspectRatio.value)
}

const touchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const touchMove = (e) => {
  touchEndX.value = e.touches[0].clientX
}

const touchEnd = () => {
  if (touchStartX.value - touchEndX.value > 50) {
    nextSlide()
  }
  if (touchEndX.value - touchStartX.value > 50) {
    prevSlide()
  }
}

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped>
.carousel-container {
  width: 100%;
  max-width: 100vw;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 20px;
}

.carousel-aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-top: calc(100% / var(--aspect-ratio, 16/9));
}

.carousel {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.5s ease;
}

.carousel-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #f5f5f5;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.carousel-button:hover {
  background: #e0e0e0;
  transform: translateY(-50%) scale(1.1);
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 10;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 2rem;
  background: #f5f5f5;
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}

.indicator.active {
  background: #000033;
  transform: scale(1.2);
}

@media (max-width: 1024px) {
  .carousel-container {
    border-radius: 10;
  }

  .carousel-aspect-ratio-box {
    padding-top: calc(100% / (4 / 3));
  }

  .carousel-image {
    border-radius: 0;
  }

  .carousel-button {
    display: none;
  }

  .carousel-indicators {
    display: none;
  }
}
</style>

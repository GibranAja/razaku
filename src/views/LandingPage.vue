<template>
  <div class="home">
    <nav>
      <NavbarComponent />
    </nav>
    <main>
      <section class="carousel">
        <CarouselComponent />
      </section>
      <div class="content-container">
        <h1 class="title">Hias Gadgetmu dengan Kreativitas Razaku</h1>
        <div class="divider"></div>
        <h2 class="subtitle">Jangan Basic, Buat Casingmu Menjadi Aesthetic</h2>
        <div class="paragraph">
          <p v-for="(paragraph, index) in paragraphs" :key="index">
            {{ paragraph }}
          </p>
        </div>
      </div>
      <div id="products" class="content-container">
        <h1 style="font-size: 2rem; padding-top: 1.2rem">Our Casing</h1>
        <CardGrid />
      </div>
    </main>
    <footer>
      <FooterComponent />
    </footer>
  </div>
</template>

<script>
import NavbarComponent from '../components/NavbarComponent.vue'
import CarouselComponent from '../components/CarouselComponent.vue'
import CardGrid from '@/components/CardGrid.vue'
import FooterComponent from '@/components/FooterComponent.vue'

export default {
  name: 'LandingPage',
  components: {
    NavbarComponent,
    CarouselComponent,
    CardGrid,
    FooterComponent
  },
  data() {
    return {
      paragraphs: [
        'Selamat datang di dunia Razaku - tempat di mana gaya bertemu perlindungan!   Razaku adalah surga bagi pecinta smartphone yang menginginkan lebih dari sekadar casing biasa. Kami menawarkan casing custom yang tidak hanya melindungi perangkat Anda, tetapi juga menjadi cerminan kepribadian unik Anda.',
        'Bayangkan smartphone Anda berbalut karya seni yang indah, elegan, dan sepenuhnya personal. Itulah yang Razaku berikan kepada Anda. Setiap casing kami adalah perpaduan sempurna antara keindahan desain dan perlindungan maksimal.'
      ]
    }
  }
}
</script>

<style scoped>
main {
  padding: 2rem;
}

.carousel {
  margin-top: 6.5rem;
}

.content-container {
  text-align: center;
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.divider {
  width: 50px;
  height: 3px;
  background-color: #333;
  margin: 1rem auto;
}

.subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  color: #666;
  line-height: 1.4;
}

.paragraph p {
  font-size: 1.01rem;
  font-weight: 200;
  text-align: justify;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }
}
</style>
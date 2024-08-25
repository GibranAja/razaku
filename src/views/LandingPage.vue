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
        </div>
        <div class="content-container">
          <h1 style="font-size: 2rem; padding-top: 1.2rem">Our Casing</h1>
        </div>
        <CardGrid />
      </main>
      <footer>
        <FooterComponent />
      </footer>
    </div>
  </template>
  
  <script>
  import NavbarComponent from '../components/NavbarComponent.vue'
  import CarouselComponent from '../components/CarouselComponent.vue'
  // import CardComponent from '../components/CardComponent.vue'
  import CardGrid from '@/components/CardGrid.vue'
  import FooterComponent from '@/components/FooterComponent.vue';
  
  export default {
    name: 'LandingPage',
    components: {
      NavbarComponent,
      CarouselComponent,
      CardGrid,
      FooterComponent
      // CardComponent
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
  
  @media (max-width: 768px) {
    .title {
      font-size: 1.5rem;
    }
  
    .subtitle {
      font-size: 0.9rem;
    }
  }
  </style>
  
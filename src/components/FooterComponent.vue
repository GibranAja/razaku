<template>
    <footer>
      <div class="footer-content">
        <img src="../image/Logo Razaku Bersih.png" class="image-razaku" alt="Logo Razaku">
        <div class="footer-text">
          <p>© {{ new Date().getFullYear() }} <strong>Razaku</strong></p>
          <p class="tagline">Jangan Basic, Buat Casingmu Aesthetic</p>
        </div>
        <div class="social-icons">
          <a href="#" class="icon" title="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
          <a href="#" class="icon" title="TikTok">
            <i class="fab fa-tiktok"></i>
          </a>
          <a href="#" class="icon" title="Shopee">
            <i class="fas fa-shopping-bag"></i>
          </a>
        </div>
      </div>
    </footer>
  </template>
  
  <style scoped>
  footer {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 2rem 0;
    font-family: 'Arial', sans-serif;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }
  
  .footer-text {
    text-align: center;
  }
  
  .footer-text p {
    margin: 0;
  }
  
  .tagline {
    font-style: italic;
    color: #bdc3c7;
    font-size: 0.9rem;
  }
  
  .social-icons {
    display: flex;
    gap: 2.5rem;
  }
  
  .icon {
    font-size: 1.5rem;
    color: #ecf0f1;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .icon:hover {
    color: #e74c3c;
  }
  
  .image-razaku {
    height: 6rem;
  }
  
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      gap: 1rem;
    }

    .image-razaku {
        height: 4.5rem;
    }
  }
  </style>
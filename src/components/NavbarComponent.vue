<template>
  <nav
    class="navbar"
    :class="{ glassmorphism: isScrolled && !isHidden }"
    :style="{ transform: isHidden ? 'translateY(-100%)' : 'translateY(0)' }"
  >
    <div class="navbar-logo">
      <img src="../image/Logo Razaku Bersih.png" alt="Logo" class="logo" />
    </div>
    <div class="hamburger" @click="toggleMenu" :class="{ 'is-active': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isMenuOpen }">
      <ul class="nav-links">
        <li><a href="#home" @click="closeMenu">Beranda</a></li>
        <li><a href="#products" @click="closeMenu">Produk</a></li>
        <li><a href="#testimoni" @click="closeMenu">Testimoni</a></li>
      </ul>
      <ReusableButton text="CS" icon="fas fa-headset" @click="openWhatsApp" />
    </div>
  </nav>
</template>

<script>
import ReusableButton from './ButtonComponent.vue'
import { ref, onMounted, onUnmounted } from 'vue'

export default {
  name: 'NavbarComponent',
  components: {
    ReusableButton
  },
  setup() {
    const isMenuOpen = ref(false)
    const isScrolled = ref(false)
    const isHidden = ref(false)
    const lastScrollPosition = ref(0)

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value
      document.body.classList.toggle('no-scroll', isMenuOpen.value)
    }

    const closeMenu = () => {
      isMenuOpen.value = false
      document.body.classList.remove('no-scroll')
    }

    const handleScroll = () => {
      const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
      isScrolled.value = currentScrollPosition > 0

      if (currentScrollPosition < 0) {
        return
      }

      if (Math.abs(currentScrollPosition - lastScrollPosition.value) < 60) {
        return
      }

      isHidden.value = currentScrollPosition > lastScrollPosition.value
      lastScrollPosition.value = currentScrollPosition
    }

    const openWhatsApp = () => {
      const phoneNumber = '62881012016987'
      const whatsappUrl = `https://wa.me/${phoneNumber}`
      window.open(whatsappUrl, '_blank')
    }

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      isMenuOpen,
      isScrolled,
      isHidden,
      toggleMenu,
      closeMenu,
      openWhatsApp
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  font-size: 1.01rem;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f5f5f5;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.glassmorphism {
  background: rgba(245, 245, 245, 0.7) !important;
  backdrop-filter: blur(10px) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
}

.navbar-logo .logo {
  height: 60px;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.nav-links {
  display: flex;
  list-style: none;
  margin-right: 2rem;
}

.nav-links li {
  margin-left: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #000033;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #0000ff;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  z-index: 100;
}

.hamburger span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: #000033;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .hamburger {
    display: flex;
  }

  .navbar-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: right 0.3s ease;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    z-index: 11;
  }

  .navbar-menu.is-active {
    right: 0;
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    margin-right: 0;
    margin-bottom: 2rem;
    padding: 0;
  }

  .nav-links li {
    margin: 1rem 0;
    text-align: center;
  }

  .hamburger.is-active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.is-active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}

.no-scroll {
  overflow: hidden;
}
</style>
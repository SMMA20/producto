<template>
  <div>
    <header class="header">
      <div class="logo">
        🌱 BONSAIS PARADISE
      </div>
      <button class="cart-icon" @click="toggleCart">
        🛒
        <span class="cart-count" :class="{ 'has-items': totalItems > 0 }">
          {{ totalItems }}
        </span>
      </button>
    </header>

    <div class="container">
      <h1 class="title">
        🌱 Colección Premium de Bonsáis 🌱
      </h1>
      <p class="subtitle">Descubre nuestra exclusiva selección de bonsáis auténticos</p>

      <div class="products-grid">
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
        >
          <div 
            v-if="product.badge" 
            class="product-badge" 
            :class="`badge-${product.badge.type}`"
          >
            {{ product.badge.text }}
          </div>
          <div class="product-image">
        <img :src="product.image" />
      </div>
          <h3 class="product-name">{{ product.name }}</h3>
          <div class="product-price">
            <span class="current-price">${{ product.price.toFixed(2) }}</span>
            <span 
              v-if="product.originalPrice" 
              class="original-price"
            >
              ${{ product.originalPrice.toFixed(2) }}
            </span>
          </div>
          <button 
            class="buy-btn"
            :class="{ 'btn-animation': animatingButtons[product.id] }"
            @click="addToCart(product.id)"
          >
            {{ buttonTexts[product.id] || '🛒 Comprar' }}
          </button>
        </div>
      </div>
    </div>

    <div 
      v-if="showCartModal" 
      class="cart-modal"
      @click="closeModalOnBackdrop"
    >
      <div class="cart-content" @click.stop>
        <div class="cart-header">
          <h2>🛒 Carrito de Compras</h2>
          <button class="close-btn" @click="toggleCart">×</button>
        </div>
        <div class="cart-body">
          <div class="cart-count-text">
            {{ totalItems }} productos en tu carrito
          </div>
          
          <div v-if="cart.length === 0" class="empty-cart">
            Tu carrito está vacío 🛒
          </div>
          
          <div v-else>
            <div 
              v-for="item in cart" 
              :key="item.id" 
              class="cart-item"
            >
              <div class="${producto.imagen}" alt="${producto.nombre}"></div>
              <div class="item-details">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">
                  ${{ item.price.toFixed(2) }} x {{ item.quantity }}
                </div>
              </div>
              <button class="remove-btn" @click="removeFromCart(item.id)">
                -
              </button>
            </div>
            
            <div class="cart-total">
              <div class="total-text">
                <span>Total:</span>
                <span>${{ totalAmount.toFixed(2) }}</span>
              </div>
              <div class="cart-actions">
                <button class="empty-cart-btn" @click="emptyCart">
                  🗑️ Vaciar Carrito
                </button>
                <button class="checkout-btn" @click="proceedToCheckout">
                  💳 Proceder al Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BonsaiStore',
  head() {
    return {
      title: 'Bonsais Paradise - Tienda Premium',
      meta: [
        { hid: 'description', name: 'description', content: 'Descubre nuestra exclusiva selección de bonsáis auténticos' }
      ]
    }
  },
  data() {
    return {
      showCartModal: false,
      animatingButtons: {},
      buttonTexts: {},
      cart: [],
      products: [
        {
          id: 1,
          name: "Bonsai de Cerezo 🌸",
          price: 850.00,
          originalPrice: 1000.00,
          image: "https://th.bing.com/th/id/OIP.gbYjH_djomY0RfWt3WOTsgHaHa?pid=ImgDet&w=191&h=191&c=7",
          badge: { text: "15%", type: "discount" }
        },
        {
          id: 2,
          name: "Bonsai de Pino Japonés 🌲",
          price: 1200.00,
          image: "https://th.bing.com/th/id/OIP.zgltMWYA0eNAB9ORn-xwCwHaFj?w=224&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
          badge: { text: "NEW", type: "new" }
        },
        {
          id: 3,
          name: "Bonsai de Arce Rojo 🍁",
          price: 975.00,
          originalPrice: 1300.00,
          image: "https://th.bing.com/th/id/OIP.xF_P1tTuZgXgHbihnxROowHaHt?w=178&h=185&c=7&r=0&o=7&pid=1.7&rm=3",
          badge: { text: "25%", type: "discount" }
        },
        {
          id: 4,
          name: "Bonsai Ficus Benjamina 🌿",
          price: 675.00,
          originalPrice: 750.00,
          image: "data:image/webp;base64,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",
          badge: { text: "10%", type: "discount" }
        },
        {
          id: 5,
          name: "Bonsai Olmo Chino Premium 🌳",
          price: 1850.00,
          image: "https://th.bing.com/th/id/OIP.wnckf8DwskaSue6407a9kgHaJ6?w=154&h=207&c=7&r=0&o=7&pid=1.7&rm=3",
          badge: { text: "VIP", type: "vip" }
        },
        {
          id: 6,
          name: "Bonsai Junípero Verde 🌲",
          price: 800.00,
          originalPrice: 1000.00,
          image: "data:image/webp;base64,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",
          badge: { text: "20%", type: "discount" }
        }
      ]
    }
  },
  computed: {
    totalItems() {
      return this.cart.reduce((sum, item) => sum + item.quantity, 0)
    },
    totalAmount() {
      return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }
  },
  methods: {
    addToCart(productId) {
      const product = this.products.find(p => p.id === productId)
      const existingItem = this.cart.find(item => item.id === productId)
      
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        this.cart.push({ ...product, quantity: 1 })
      }
      
      this.$set(this.animatingButtons, productId, true)
      this.$set(this.buttonTexts, productId, '✅ ¡Agregado!')
      
      setTimeout(() => {
        this.$set(this.animatingButtons, productId, false)
        this.$set(this.buttonTexts, productId, '🛒 Comprar')
      }, 1000)
    },
    
    removeFromCart(productId) {
      this.cart = this.cart.filter(item => item.id !== productId)
    },
    
    emptyCart() {
      this.cart = []
    },
    
    toggleCart() {
      this.showCartModal = !this.showCartModal
    },
    
    closeModalOnBackdrop(event) {
      if (event.target === event.currentTarget) {
        this.toggleCart()
      }
    },
    
    proceedToCheckout() {
      if (this.cart.length === 0) {
        alert('Tu carrito está vacío')
        return
      }
      
      alert(`¡Gracias por tu compra! Total: $${this.totalAmount.toFixed(2)}\n\nRedirigiendo al proceso de pago...`)
      
      this.emptyCart()
      this.toggleCart()
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%);
  min-height: 100vh;
}

.header {
  background: #2d5a2d;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cart-icon {
  background: #4a7c4a;
  padding: 0.8rem;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border: none;
  color: rgb(233, 220, 220);
  font-size: 1.2rem;
}

.cart-icon:hover {
  background: #5d9a5d;
  transform: scale(1.1);
}

.cart-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4757;
  color: rgb(231, 226, 226);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.cart-count.has-items {
  background: #2ed573;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.title {
  text-align: center;
  color: #2d5a2d;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-card {
  background: rgb(226, 216, 216);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

.product-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  color: rgb(241, 235, 235);
  font-size: 0.8rem;
  font-weight: bold;
}

.badge-discount { background: #ff4757; }
.badge-new { background: #2ed573; }
.badge-vip { background: #5f27cd; }

.product-image {
  width: 86%;
  height: 200px;
  background: #fdf1f1;
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  position: relative;
  overflow: hidden;
}

.product-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d5a2d;
  margin-bottom: 0.5rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.current-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d5a2d;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.buy-btn {
  width: 100%;
  background: #3498db;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.buy-btn:hover {
  background: #2980b9;
  transform: scale(1.02);
}

.buy-btn:active {
  transform: scale(0.98);
}

.cart-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.cart-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(255, 255, 255);
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
}

.cart-header {
  background: #2d5a2d;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 15px 15px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255,255,255,0.2);
}

.cart-body {
  padding: 1.5rem;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  background: #fafafa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.item-details {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.3rem;
}

.item-price {
  color: #2d5a2d;
  font-weight: bold;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: #ff3838;
}

.cart-total {
  padding: 1rem 0;
  border-top: 2px solid #eee;
  margin-top: 1rem;
}

.total-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2d5a2d;
}

.cart-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.empty-cart-btn {
  flex: 1;
  background: #ff4757;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.empty-cart-btn:hover {
  background: #ff3838;
}

.checkout-btn {
  flex: 1;
  background: #2ed573;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.checkout-btn:hover {
  background: #26d366;
}

.empty-cart {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.cart-count-text {
  color: #666;
  margin-bottom: 1rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { transform: translate(-50%, -60%); opacity: 0; }
  to { transform: translate(-50%, -50%); opacity: 1; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

.btn-animation {
  animation: bounce 0.6s ease;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .title {
    font-size: 2rem;
  }
}
</style>
class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartDisplay();
    }

    bindEvents() {
        // Cart icon click
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.openCart());
        }

        // Cart close button
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            const cartSidebar = document.getElementById('cartSidebar');
            const cartIcon = document.getElementById('cartIcon');

            if (cartSidebar && cartIcon &&
                !cartSidebar.contains(e.target) &&
                !cartIcon.contains(e.target)) {
                this.closeCart();
            }
        });
    }

    openCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('open');
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('open');
        }
    }

    addToCart(producto) {
        const existingItem = this.cart.find(item => item.id === producto.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                id: producto.id,
                nombre: producto.nombre,
                imagen: producto.imagen,
                precio: producto.precio,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();

        // Show feedback
        this.showAddToCartFeedback();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();

        // Solo cerrar el carrito si está vacío
        if (this.cart.length === 0) {
            this.closeCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartDisplay() {
        this.updateCartCount();
        this.updateCartContent();
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    updateCartContent() {
        const cartContent = document.getElementById('cartContent');
        const cartFooter = document.getElementById('cartFooter');

        if (!cartContent || !cartFooter) return;

        if (this.cart.length === 0) {
            cartContent.innerHTML = '<div class="cart-empty">No se han agregado productos al carrito</div>';
            cartFooter.innerHTML = '';
        } else {
            this.renderCartItems();
            this.renderCartFooter();
        }
    }

    renderCartItems() {
        const cartContent = document.getElementById('cartContent');
        if (!cartContent) return;

        let html = '';
        this.cart.forEach(item => {
            html += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        <div class="cart-item-price">${item.precio} x ${item.quantity}</div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeFromCart(${item.id})">Eliminar</button>
                </div>
            `;
        });
        cartContent.innerHTML = html;
    }

    renderCartFooter() {
        const cartFooter = document.getElementById('cartFooter');
        if (!cartFooter) return;

        const total = this.cart.reduce((sum, item) => {
            const price = parseInt(item.precio.replace(/[^0-9]/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        cartFooter.innerHTML = `
            <div class="cart-total">
                <span>Total:</span>
                <span>$${total}mxn</span>
            </div>
            <button class="confirm-order-btn" onclick="cart.confirmOrder()">Confirmar Orden</button>
        `;
    }

    showAddToCartFeedback() {
        // This will be called from the product rendering function
        // The actual feedback is handled in the productos.js file
    }

    confirmOrder() {
        console.log('Productos en el carrito:', this.cart);
        alert('Orden confirmada. Revisa la consola para ver los productos.');
    }

    getCart() {
        return this.cart;
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    getCartItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    getCartTotal() {
        return this.cart.reduce((sum, item) => {
            const price = parseInt(item.precio.replace(/[^0-9]/g, ''));
            return sum + (price * item.quantity);
        }, 0);
    }
}

// Create global cart instance
let cart;

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
});
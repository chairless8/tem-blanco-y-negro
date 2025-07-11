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

            // No cerrar si se hace click en botones de eliminar del carrito
            if (e.target.classList.contains('cart-item-remove')) {
                return;
            }

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
        // Crear una clave única que incluye talla y color para distinguir items
        const itemKey = this.createItemKey(producto);
        const existingItem = this.cart.find(item => this.createItemKey(item) === itemKey);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const cartItem = {
                id: producto.id,
                nombre: producto.nombre,
                imagen: producto.imagen,
                precio: producto.precio,
                quantity: 1
            };

            // Agregar talla si está seleccionada
            if (producto.tallaSeleccionada) {
                cartItem.tallaSeleccionada = producto.tallaSeleccionada;
            }

            // Agregar color si está seleccionado
            if (producto.colorSeleccionado) {
                cartItem.colorSeleccionado = producto.colorSeleccionado;
            }

            this.cart.push(cartItem);
        }

        this.saveCart();
        this.updateCartDisplay();

        // Show feedback
        this.showAddToCartFeedback();
    }

    // Método auxiliar para crear una clave única para cada item del carrito
    createItemKey(item) {
        let key = `${item.id}`;
        if (item.tallaSeleccionada) {
            key += `_${item.tallaSeleccionada}`;
        }
        if (item.colorSeleccionado) {
            key += `_${item.colorSeleccionado}`;
        }
        return key;
    }

    removeFromCart(productId, talla = null, color = null) {
        console.log('RemoveFromCart called with:', { productId, talla, color });
        console.log('Cart length before:', this.cart.length);

        // Crear la clave para identificar el item específico a eliminar
        const itemToRemove = {
            id: productId,
            tallaSeleccionada: talla === 'null' ? null : talla,
            colorSeleccionado: color === 'null' ? null : color
        };
        const itemKey = this.createItemKey(itemToRemove);
        console.log('Item key to remove:', itemKey);

        // Filtrar el item específico
        const initialLength = this.cart.length;
        this.cart = this.cart.filter(item => {
            const currentItemKey = this.createItemKey(item);
            console.log('Comparing keys:', currentItemKey, 'vs', itemKey);
            return currentItemKey !== itemKey;
        });

        console.log('Cart length after removal:', this.cart.length);
        console.log('Items removed:', initialLength - this.cart.length);

        this.saveCart();
        this.updateCartDisplay();

        // Pequeño delay antes de decidir si cerrar el carrito
        setTimeout(() => {
            if (this.cart.length === 0) {
                console.log('Cart is empty, closing cart');
                this.closeCart();
            } else {
                console.log('Cart still has', this.cart.length, 'items, keeping open');
            }
        }, 10);
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
            // Crear información adicional de talla y color
            let itemDetails = '';
            if (item.tallaSeleccionada || item.colorSeleccionado) {
                let details = [];
                if (item.tallaSeleccionada) {
                    details.push(`<div>Talla ${item.tallaSeleccionada}</div>`);
                }
                if (item.colorSeleccionado) {
                    // Mostrar el color como un pequeño círculo
                    details.push(`<div style="display: flex; align-items: center;">Color <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.colorSeleccionado}; border-radius: 50%; margin-left: 4px; border: 1px solid #ddd;"></span></div>`);
                }
                itemDetails = `<div class="cart-item-details" style="font-size: 0.85em; color: #666; margin-top: 2px;">${details.join('')}</div>`;
            }

            // Crear parámetros seguros para la función de eliminar
            const tallaParam = item.tallaSeleccionada ? `'${item.tallaSeleccionada}'` : 'null';
            const colorParam = item.colorSeleccionado ? `'${item.colorSeleccionado}'` : 'null';

            html += `
                <div class="cart-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nombre}</div>
                        ${itemDetails}
                        <div class="cart-item-price">${item.precio} <span class="cart-item-quantity">x ${item.quantity}</span></div>
                    </div>
                    <button class="cart-item-remove" onclick="cart.removeFromCart(${item.id}, ${tallaParam}, ${colorParam})">Eliminar</button>
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
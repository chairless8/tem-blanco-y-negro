class ShoppingCart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.emailjsInitialized = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateCartDisplay();
        this.createOrderModal();
        this.initEmailJS();
    }

        initEmailJS() {
        // Usar configuración del archivo separado
        if (window.EMAILJS_CONFIG) {
            this.EMAIL_CONFIG = window.EMAILJS_CONFIG;
        } else {
            console.error('No se encontró la configuración de EmailJS. Asegúrate de incluir emailjs-config.js');
            return;
        }

        // Verificar si EmailJS está configurado
        if (!window.EMAILJS_CONFIGURED) {
            console.warn('⚠️ EmailJS no está configurado. Revisa el archivo emailjs-config.js');
            return;
        }

        // Inicializar EmailJS cuando esté disponible
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.EMAIL_CONFIG.PUBLIC_KEY);
            this.emailjsInitialized = true;
            console.log('✅ EmailJS inicializado correctamente');
        } else {
            console.warn('EmailJS no está disponible. Asegúrate de incluir el script.');
        }
    }

    createOrderModal() {
        // Crear el modal HTML dinámicamente
        const modalHTML = `
            <div id="orderModal" class="order-modal" style="display: none;">
                <div class="order-modal-content">
                    <div class="order-modal-header">
                        <h2>Confirmar Orden</h2>
                        <span class="order-modal-close">&times;</span>
                    </div>
                    <div class="order-modal-body">
                        <div class="order-summary">
                            <h3>Resumen de tu orden:</h3>
                            <div id="orderSummaryContent"></div>
                            <div class="order-total-section">
                                <strong>Total: <span id="orderModalTotal">$0</span></strong>
                            </div>
                        </div>

                        <form id="orderForm" class="order-form">
                            <div class="form-group">
                                <label for="customerName">Nombre completo *</label>
                                <input type="text" id="customerName" name="customerName" required>
                            </div>

                            <div class="form-group">
                                <label for="customerEmail">Correo electrónico *</label>
                                <input type="email" id="customerEmail" name="customerEmail" required>
                            </div>

                            <div class="form-group">
                                <label for="customerPhone">Teléfono *</label>
                                <input type="tel" id="customerPhone" name="customerPhone" required>
                            </div>

                            <div class="form-group">
                                <label for="customerAddress">Dirección de envío</label>
                                <textarea id="customerAddress" name="customerAddress" rows="3" placeholder="Dirección completa para el envío"></textarea>
                            </div>

                            <div class="form-group">
                                <label for="orderNotes">Notas adicionales</label>
                                <textarea id="orderNotes" name="orderNotes" rows="2" placeholder="Comentarios especiales, instrucciones de entrega, etc."></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="button" class="btn-cancel" onclick="cart.closeOrderModal()">Cancelar</button>
                                <button type="submit" class="btn-confirm" id="confirmOrderBtn">
                                    <span class="btn-text">Enviar Orden</span>
                                    <span class="btn-loading" style="display: none;">Enviando...</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // Insertar el modal en el body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Agregar estilos CSS para el modal
        this.addModalStyles();

        // Bind events para el modal
        this.bindModalEvents();
    }

        addModalStyles() {
        // Los estilos del modal ahora están en cart.css
        // Esta función ya no es necesaria pero se mantiene para compatibilidad
        console.log('Estilos del modal cargados desde cart.css');
    }

    bindModalEvents() {
        // Close modal events
        const modal = document.getElementById('orderModal');
        const closeBtn = modal.querySelector('.order-modal-close');

        closeBtn.addEventListener('click', () => this.closeOrderModal());

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeOrderModal();
            }
        });

        // Form submission
        const orderForm = document.getElementById('orderForm');
        orderForm.addEventListener('submit', (e) => this.handleOrderSubmission(e));
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
        if (this.cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        this.openOrderModal();
    }

    openOrderModal() {
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
            orderModal.style.display = 'flex';
            this.updateOrderModalContent();
        }
    }

    closeOrderModal() {
        const orderModal = document.getElementById('orderModal');
        if (orderModal) {
            orderModal.style.display = 'none';
        }
    }

    updateOrderModalContent() {
        const orderModalTotal = document.getElementById('orderModalTotal');
        const orderSummaryContent = document.getElementById('orderSummaryContent');

        if (!orderModalTotal || !orderSummaryContent) return;

        const total = this.getCartTotal();
        orderModalTotal.textContent = `$${total.toLocaleString()}mxn`;

        let summaryHtml = '';
        this.cart.forEach(item => {
            let itemDetails = '';
            if (item.tallaSeleccionada || item.colorSeleccionado) {
                let details = [];
                if (item.tallaSeleccionada) {
                    details.push(`Talla: ${item.tallaSeleccionada}`);
                }
                if (item.colorSeleccionado) {
                    details.push(`Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.colorSeleccionado}; border-radius: 50%; margin-left: 4px; border: 1px solid #ddd;"></span>`);
                }
                itemDetails = `<div class="order-item-details">${details.join(' | ')}</div>`;
            }

            const itemPrice = parseInt(item.precio.replace(/[^0-9]/g, ''));
            summaryHtml += `
                <div class="order-item">
                    <div class="order-item-info">
                        <div class="order-item-name">${item.nombre} x${item.quantity}</div>
                        ${itemDetails}
                    </div>
                    <div class="order-item-price">$${(itemPrice * item.quantity).toLocaleString()}mxn</div>
                </div>
            `;
        });
        orderSummaryContent.innerHTML = summaryHtml;
    }

    generateOrderId() {
        const now = new Date();
        return `ICE-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    }

    buildCartEmailRows() {
        return this.cart.map(item => {
            let details = '';
            if (item.tallaSeleccionada || item.colorSeleccionado) {
                let detailsArray = [];
                if (item.tallaSeleccionada) {
                    detailsArray.push(`Talla: ${item.tallaSeleccionada}`);
                }
                if (item.colorSeleccionado) {
                    detailsArray.push(`Color: ${item.colorSeleccionado}`);
                }
                details = `<div style="font-size:12px;color:#666;margin-top:4px;">${detailsArray.join(' | ')}</div>`;
            }

            const itemPrice = parseInt(item.precio.replace(/[^0-9]/g, ''));
            return `
                <tr style="vertical-align:top">
                    <td style="padding:12px 8px;border-bottom:1px solid #eee;">
                        <div style="font-weight:500;">${item.nombre}</div>
                        ${details}
                        <div style="font-size:14px;color:#888;margin-top:4px;">Cantidad: ${item.quantity}</div>
                    </td>
                    <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;white-space:nowrap">
                        <strong>$${(itemPrice * item.quantity).toLocaleString()}mxn</strong>
                    </td>
                </tr>
            `;
        }).join('');
    }

    async handleOrderSubmission(e) {
        e.preventDefault();

        if (!this.emailjsInitialized) {
            alert('EmailJS no está inicializado. Asegúrate de que el script de EmailJS esté cargado.');
            return;
        }

        const orderForm = document.getElementById('orderForm');
        const formData = new FormData(orderForm);
        const customerData = Object.fromEntries(formData);

        const confirmOrderBtn = document.getElementById('confirmOrderBtn');
        const btnText = confirmOrderBtn.querySelector('.btn-text');
        const btnLoading = confirmOrderBtn.querySelector('.btn-loading');

        // Deshabilitar botón y mostrar loading
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-block';
        confirmOrderBtn.disabled = true;

        try {
            const orderId = this.generateOrderId();
            const cartRows = this.buildCartEmailRows();
            const total = this.getCartTotal();

            const templateParams = {
                to_email: 'icegreen.mx@gmail.com',
                order_id: orderId,
                customer_name: customerData.customerName,
                customer_email: customerData.customerEmail,
                customer_phone: customerData.customerPhone,
                customer_address: customerData.customerAddress || 'No especificada',
                order_notes: customerData.orderNotes || 'Sin notas adicionales',
                order_rows: cartRows,
                total: total.toLocaleString(),
                order_date: new Date().toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // Enviar email usando EmailJS
            const response = await emailjs.send(
                this.EMAIL_CONFIG.SERVICE_ID,
                this.EMAIL_CONFIG.TEMPLATE_ID_CART,
                templateParams
            );

            console.log('Email enviado con éxito:', response);

            // Mostrar mensaje de éxito
            alert(`¡Orden ${orderId} enviada con éxito!\n\nHemos enviado la confirmación a ${customerData.customerEmail}.\nNos pondremos en contacto contigo pronto al ${customerData.customerPhone}.`);

            // Limpiar carrito y cerrar modal
            this.clearCart();
            this.closeOrderModal();
            orderForm.reset();

        } catch (error) {
            console.error('Error al enviar el email:', error);
            alert('Hubo un error al enviar la orden. Por favor, verifica tus datos e intenta nuevamente.');
        } finally {
            // Restaurar estado del botón
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';
            confirmOrderBtn.disabled = false;
        }
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
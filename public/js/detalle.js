document.addEventListener('DOMContentLoaded', function() {
    // Obtener el id del producto de la URL
    function getIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id'), 10);
    }

    const id = getIdFromUrl();
    const contenedor = document.getElementById('detalle-producto');
    let producto = null;
    let imagenSeleccionada = null;
    let tallaSeleccionada = null;
    let colorSeleccionado = null;

    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            // Buscar producto por ID en lugar de por índice
            producto = data.find(p => p.id === id);
            if (!producto) {
                contenedor.innerHTML = '<div class="col-12 text-center"><h3>Producto no encontrado</h3></div>';
                return;
            }
            imagenSeleccionada = producto.imagen;
            // Inicializar selecciones por defecto
            tallaSeleccionada = producto.tallas && producto.tallas.length > 0 ? producto.tallas[0] : null;
            colorSeleccionado = producto.colors && producto.colors.length > 0 ? producto.colors[0] : null;
            renderDetalle();
        });

    function renderDetalle() {
        // Crear array de todas las imágenes disponibles con su información de padding
        const imagenes = [
            { src: producto.imagen, padding: producto.padding || 'center' }, // Imagen principal
            ...(producto.detalles || []) // Detalles ya son objetos con src y padding
        ];

        // Generar HTML para miniaturas
        let miniaturasHtml = imagenes.map(imgObj => `
            <div class="miniatura-img mb-2">
                <img src="${imgObj.src}" alt="miniatura" class="img-miniatura ${imgObj.src === imagenSeleccionada ? 'miniatura-activa' : ''}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${imgObj.src === imagenSeleccionada ? '#2cd502' : '#eee'};">
            </div>
        `).join('');

        // Encontrar el padding de la imagen seleccionada
        const imagenSeleccionadaObj = imagenes.find(img => img.src === imagenSeleccionada);
        const paddingOption = imagenSeleccionadaObj ? imagenSeleccionadaObj.padding : 'center';

        // Generar padding dinámico basado en la imagen seleccionada
        let extraPadding = '';
        switch (paddingOption) {
            case 'center':
                extraPadding = 'padding:0 50px;'; // 50 izquierda y derecha
                break;
            case 'left':
                extraPadding = 'padding:0 100px 0 0;'; // 100 a la derecha (imagen pegada a la izquierda)
                break;
            case 'right':
                extraPadding = 'padding:0 0 0 100px;'; // 100 a la izquierda (imagen pegada a la derecha)
                break;
            case 'none':
            default:
                extraPadding = '';
        }

        // Generar HTML para selección de tallas
        let tallasHtml = '';
        if (producto.tallas && producto.tallas.length > 0) {
            const tallasOptions = producto.tallas.map(talla => `
                <option value="${talla}" ${talla === tallaSeleccionada ? 'selected' : ''}>${talla}</option>
            `).join('');

            tallasHtml = `
                <div class="mb-3">
                    <label for="talla-select" class="form-label"><strong>Talla:</strong></label>
                    <select class="form-select" id="talla-select" style="max-width: 120px;">
                        ${tallasOptions}
                    </select>
                </div>
            `;
        }

        // Generar HTML para selección de colores
        let coloresHtml = '';
        if (producto.colors && producto.colors.length > 0) {
            const coloresSwatches = producto.colors.map(color => `
                <div class="color-swatch ${color === colorSeleccionado ? 'color-selected' : ''}"
                     data-color="${color}"
                     style="width: 30px; height: 30px; background-color: ${color}; border: 2px solid ${color === colorSeleccionado ? '#2cd502' : '#ddd'}; border-radius: 50%; cursor: pointer; margin-right: 8px; display: inline-block;">
                </div>
            `).join('');

            coloresHtml = `
                <div class="mb-3">
                    <label class="form-label"><strong>Color:</strong></label>
                    <div class="d-flex flex-wrap" id="color-swatches">
                        ${coloresSwatches}
                    </div>
                </div>
            `;
        }

        contenedor.innerHTML = `
            <div class="col-md-2 d-flex align-items-center detalle-miniaturas">
                ${miniaturasHtml}
            </div>
            <div class="col-md-6 d-flex align-items-center justify-content-center">
                <img src="${imagenSeleccionada}" alt="${producto.nombre}" class="img-fluid img-detalle-grande" style="${extraPadding}max-width:100%; max-height:400px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            </div>
            <div class="col-md-4 d-flex flex-column justify-content-center">
                <h3>${producto.nombre}</h3>
                <h4 class="text-success mb-3">${producto.precio}</h4>
                <p class="descripcion-producto">${producto.descripcion || ''}</p>

                ${tallasHtml}
                ${coloresHtml}

                <div class="mt-2">
                    <button class="primary-btn me-3 p-3" id="comprar-ya-btn">Comprar ya</button>
                </div>
                <div class="mt-2">
                    <button class="site-btn p-3" id="agregar-carrito-btn">Agregar al carrito</button>
                </div>

            </div>
        `;

        // Listeners para miniaturas
        document.querySelectorAll('.img-miniatura').forEach(img => {
            img.addEventListener('click', function() {
                imagenSeleccionada = this.getAttribute('src');
                renderDetalle(); // Re-renderizar para aplicar el nuevo padding
            });
        });

        // Listener para selección de talla
        const tallaSelect = document.getElementById('talla-select');
        if (tallaSelect) {
            tallaSelect.addEventListener('change', function() {
                tallaSeleccionada = this.value;
            });
        }

        // Listeners para selección de color
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', function() {
                colorSeleccionado = this.getAttribute('data-color');
                // Re-renderizar para actualizar la selección visual
                renderDetalle();
            });
        });

        // Listeners para botones del carrito
        setupCartButtons();
    }

    function setupCartButtons() {
        const agregarBtn = document.getElementById('agregar-carrito-btn');
        const comprarBtn = document.getElementById('comprar-ya-btn');

        if (agregarBtn) {
            agregarBtn.addEventListener('click', function() {
                if (typeof cart !== 'undefined' && cart && producto) {
                    // Crear copia del producto con las selecciones actuales
                    const productoConSelecciones = {
                        ...producto,
                        tallaSeleccionada: tallaSeleccionada,
                        colorSeleccionado: colorSeleccionado
                    };
                    cart.addToCart(productoConSelecciones);
                    showAddToCartFeedback(this, '¡Agregado!');
                } else {
                    console.error('Sistema de carrito no disponible');
                }
            });
        }

        if (comprarBtn) {
            comprarBtn.addEventListener('click', function() {
                if (typeof cart !== 'undefined' && cart && producto) {
                    // Crear copia del producto con las selecciones actuales
                    const productoConSelecciones = {
                        ...producto,
                        tallaSeleccionada: tallaSeleccionada,
                        colorSeleccionado: colorSeleccionado
                    };
                    cart.addToCart(productoConSelecciones);
                    //showAddToCartFeedback(this, '¡Agregado!');

                    // Abrir el carrito después de un pequeño delay
                    setTimeout(() => {
                        cart.openCart();
                    }, 500);
                } else {
                    console.error('Sistema de carrito no disponible');
                }
            });
        }
    }

    function showAddToCartFeedback(button, message) {
        const originalText = button.textContent;
        const originalColor = button.style.backgroundColor;

        button.textContent = message;
        button.style.backgroundColor = '#2cd502';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = originalColor;
            button.disabled = false;
        }, 1500);
    }
});
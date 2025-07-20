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

            // Si hay un color seleccionado por defecto (el primero), usar la imagen principal
            if (colorSeleccionado && producto.colors && producto.colors[0] === colorSeleccionado) {
                imagenSeleccionada = producto.imagen;
            }
            // Si no es el primer color, buscar si hay una imagen con el color seleccionado
            else if (colorSeleccionado && producto.detalles) {
                const imagenConColor = producto.detalles.find(detalle => detalle.color === colorSeleccionado);
                if (imagenConColor) {
                    imagenSeleccionada = imagenConColor.src;
                }
            }

            renderDetalle();
        });

    function renderDetalle() {
        // Crear array de todas las imágenes disponibles con su información de padding y color
        const imagenes = [
            { src: producto.imagen, padding: producto.padding || 'center' }, // Imagen principal
            ...(producto.detalles || []) // Detalles ya son objetos con src, padding y posiblemente color
        ];

        // Generar HTML para miniaturas
        let miniaturasHtml = imagenes.map(imgObj => `
            <div class="miniatura-img mb-2">
                <img src="${imgObj.src}" alt="miniatura" class="img-miniatura ${imgObj.src === imagenSeleccionada ? 'miniatura-activa' : ''}"
                     style="width:70px; height:70px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${imgObj.src === imagenSeleccionada ? '#2cd502' : '#eee'};"
                     data-color="${imgObj.color || ''}">
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

                // Definir tallas estáticas
        const TALLAS_FEMENINAS = [1, 3, 5, 7, 9, 11]; // 0-11
        const TALLAS_MASCULINAS = [28, 30, 32, 34, 36, 38];

        // Generar HTML para selección de tallas
        let tallasHtml = '';
        if (producto.tallas && producto.tallas.length > 0) {
            // Verificar si hay tallas especiales "Female" o "Male"
            const tieneF = producto.tallas.includes("Female");
            const tieneM = producto.tallas.includes("Male");

            // Si tiene tallas especiales (F o M)
            if (tieneF || tieneM) {
                // Determinar el género inicial
                let generoInicial = tieneF ? 'Female' : 'Male';

                // Selector de tipo de talla (género)
                let generoOptions = '';
                if (tieneF) generoOptions += '<option value="Female">F</option>';
                if (tieneM) generoOptions += '<option value="Male">M</option>';

                // Opciones para tallas femeninas
                const tallasFOptions = TALLAS_FEMENINAS.map(num =>
                    `<option value="${num}">${num}</option>`
                ).join('');

                // Opciones para tallas masculinas
                const tallasMOptions = TALLAS_MASCULINAS.map(num =>
                    `<option value="${num}">${num}</option>`
                ).join('');

                tallasHtml = `
                    <div class="row mb-3">
                        <div class="col-6">
                            <label class="form-label w-100"><strong>GENERO</strong></label>
                            <select class="form-select" id="genero-select">
                                ${generoOptions}
                            </select>
                        </div>
                        <div class="col-6">
                            <label class="form-label w-100"><strong>TALLA</strong></label>
                            <select class="form-select" id="talla-f-select" style="${generoInicial === 'Female' ? '' : 'display:none;'}">
                                ${tallasFOptions}
                            </select>
                            <select class="form-select" id="talla-m-select" style="${generoInicial === 'Male' ? '' : 'display:none;'}">
                                ${tallasMOptions}
                            </select>
                        </div>
                    </div>
                `;
            } else {
                // Si son tallas normales (S, M, L, etc.)
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
                <img src="${imagenSeleccionada}" alt="${producto.nombre}" class="img-fluid img-detalle-grande" style="${extraPadding}max-width:100%; max-height:410px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
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

                // Verificar si hay tallas especiales "Female" o "Male"
        const tieneF = producto.tallas && producto.tallas.includes("Female");
        const tieneM = producto.tallas && producto.tallas.includes("Male");

        // Manejar tallas especiales (F/M)
        if (tieneF || tieneM) {
            const generoSelect = document.getElementById('genero-select');
            const tallaFSelect = document.getElementById('talla-f-select');
            const tallaMSelect = document.getElementById('talla-m-select');

            if (generoSelect && tallaFSelect && tallaMSelect) {
                // Establecer valores iniciales
                const generoInicial = generoSelect.value;

                if (generoInicial === 'Female' && tallaFSelect.options.length > 0) {
                    tallaSeleccionada = tallaFSelect.options[0].value;
                } else if (generoInicial === 'Male' && tallaMSelect.options.length > 0) {
                    tallaSeleccionada = tallaMSelect.options[0].value;
                }

                // Listener para cambio de género
                generoSelect.addEventListener('change', function() {
                    const genero = this.value;

                    // Mostrar/ocultar selectores según el género
                    if (genero === 'Female') {
                        tallaFSelect.style.display = '';
                        tallaMSelect.style.display = 'none';
                        tallaSeleccionada = tallaFSelect.value;
                    } else {
                        tallaFSelect.style.display = 'none';
                        tallaMSelect.style.display = '';
                        tallaSeleccionada = tallaMSelect.value;
                    }

                    console.log('Talla seleccionada:', tallaSeleccionada);
                });

                                // Listener para talla femenina
                tallaFSelect.addEventListener('change', function() {
                    tallaSeleccionada = this.value;
                    console.log('Talla seleccionada:', tallaSeleccionada);
                });

                // Listener para talla masculina
                tallaMSelect.addEventListener('change', function() {
                    tallaSeleccionada = this.value;
                    console.log('Talla seleccionada:', tallaSeleccionada);
                });
            }
        }
        // Manejar tallas normales
        else {
            const tallaSelect = document.getElementById('talla-select');
            if (tallaSelect) {
                tallaSelect.addEventListener('change', function() {
                    tallaSeleccionada = this.value;
                    console.log('Talla seleccionada:', tallaSeleccionada);
                });
            }
        }

        // Listeners para selección de color
        document.querySelectorAll('.color-swatch').forEach(swatch => {
            swatch.addEventListener('click', function() {
                const nuevoColor = this.getAttribute('data-color');
                colorSeleccionado = nuevoColor;

                // Si es el primer color de la lista, seleccionar la imagen principal
                if (producto.colors && producto.colors[0] === nuevoColor) {
                    imagenSeleccionada = producto.imagen;
                }
                // Si no es el primer color, buscar si hay una imagen con el color seleccionado
                else if (producto.detalles) {
                    const imagenConColor = producto.detalles.find(detalle => detalle.color === nuevoColor);
                    if (imagenConColor) {
                        imagenSeleccionada = imagenConColor.src;
                    }
                }

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
                        colorSeleccionado: colorSeleccionado,
                        // Agregar información descriptiva para tallas especiales
                        tallaDescriptiva: getTallaDescriptiva(tallaSeleccionada)
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

            // Función para obtener descripción amigable de la talla
    function getTallaDescriptiva(talla) {
        if (!talla) return '';

        // Si es un objeto de talla especial
        if (typeof talla === 'object' && talla.tipo && talla.numero) {
            if (talla.tipo === 'Female') {
                return `Talla ${talla.numero} (Femenina)`;
            } else if (talla.tipo === 'Male') {
                return `Talla ${talla.numero} (Masculina)`;
            }
        }

        // Si es una talla regular
        return `Talla ${talla}`;
    }
});
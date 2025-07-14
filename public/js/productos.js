document.addEventListener('DOMContentLoaded', function() {
    const contenedor = document.getElementById('productos-lista');
    const selector = document.querySelector('.sort');
    console.log('Selector:', selector);
    let productos = [];
    let categoriaActual = '';

    // Obtener categoría de los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaParam = urlParams.get('categoria');
    if (categoriaParam) {
        categoriaActual = categoriaParam.toLowerCase().trim();
    }

    // Cargar productos desde el JSON
    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            productos = data;
            // Establecer el selector con la categoría de la URL si existe
            if (categoriaActual && selector) {
                selector.value = categoriaActual;
                // Disparar evento para que Nice Select se actualice
                if (typeof $ !== 'undefined') {
                    $(selector).niceSelect('update');
                }
            }
            renderProductos();
        });

    // Evento de cambio de categoría (Nice Select)
    $(document).on('click', '.nice-select .option', function() {
        const categoria = $(this).data('value');
        categoriaActual = categoria ? categoria.toLowerCase().trim() : '';
        renderProductos();
    });

    function renderProductos() {
        let filtrados = productos;
        if (categoriaActual && categoriaActual !== '') {
            filtrados = productos.filter(p =>
                p.categoria && p.categoria.toLowerCase().trim() === categoriaActual.trim()
            );
        }
        if (filtrados.length === 0) {
            contenedor.innerHTML = '<p class="text-center">No hay productos en esta categoría.</p>';
            return;
        }
        let html = '<div class="productos-grid-general">';
        filtrados.forEach((producto, i) => {
            html += `
                <div class="producto-grande">
                    <a href="detalle.html?id=${producto.id}">
                        <figure>
                            <img src="${producto.imagen}" alt="${producto.nombre}" class="img-grande">
                        </figure>
                        <div class="product-text">
                            <h6>${producto.nombre}</h6>
                            <p>${producto.precio}</p>
                        </div>
                    </a>
                </div>
            `;
        });
        html += '</div>';
        contenedor.innerHTML = html;
    }

    // Global function for add to cart button
    window.addToCartFromRender = function(productId) {
        const producto = productos.find(p => p.id === productId);
        if (producto && cart) {
            cart.addToCart(producto);
            showAddToCartFeedback();
        }
    };

    function showAddToCartFeedback() {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '¡Agregado!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '#333';
        }, 1000);
    }

    function renderProductoLigero(producto) {
        return `
            <a href="detalle.html?id=${producto.id}" class="producto-ligero">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-ligera">
                <div class="nombre-ligero">${producto.nombre}</div>
            </a>
        `;
    }
});
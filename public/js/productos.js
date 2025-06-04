document.addEventListener('DOMContentLoaded', function() {
    const contenedor = document.getElementById('productos-lista');
    const selector = document.querySelector('.sort');
    console.log('Selector:', selector);
    let productos = [];
    let categoriaActual = '';

    // Cargar productos desde el JSON
    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            productos = data;
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
            const lado = i % 2 === 0 ? 'izq' : 'der';
            const index = productos.indexOf(producto);
            html += `<a href="detalle.html?id=${index}" class="producto-grande producto-${lado}">
                <figure>
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-grande">
                </figure>
                <div class="product-text">
                    <h6>${producto.nombre}</h6>
                    <p>${producto.precio}</p>
                </div>
            </a>`;
        });
        html += '</div>';
        contenedor.innerHTML = html;
    }

    function renderProductoLigero(producto, index) {
        return `
            <a href="detalle.html?id=${index}" class="producto-ligero">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="img-ligera">
                <div class="nombre-ligero">${producto.nombre}</div>
            </a>
        `;
    }
});
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

    fetch('productos.json')
        .then(res => res.json())
        .then(data => {
            producto = data[id];
            if (!producto) {
                contenedor.innerHTML = '<div class="col-12 text-center"><h3>Producto no encontrado</h3></div>';
                return;
            }
            imagenSeleccionada = producto.imagen;
            renderDetalle();
        });

    function renderDetalle() {
        // Miniaturas: principal + detalles
        const miniaturas = [producto.imagen, ...(producto.detalles || [])];
        let miniaturasHtml = miniaturas.map(img => `
            <div class="miniatura-img mb-2">
                <img src="${img}" alt="miniatura" class="img-miniatura ${img === imagenSeleccionada ? 'miniatura-activa' : ''}" style="width:70px; height:70px; object-fit:cover; border-radius:8px; cursor:pointer; border:2px solid ${img === imagenSeleccionada ? '#2cd502' : '#eee'};">
            </div>
        `).join('');

        contenedor.innerHTML = `
            <div class="col-md-2 d-flex flex-column align-items-center">
                ${miniaturasHtml}
            </div>
            <div class="col-md-5 d-flex align-items-center justify-content-center">
                <img src="${imagenSeleccionada}" alt="${producto.nombre}" class="img-fluid img-detalle-grande" style="max-width:100%; max-height:400px; border-radius:16px; box-shadow:0 2px 12px rgba(0,0,0,0.08);">
            </div>
            <div class="col-md-5 d-flex flex-column justify-content-center">
                <h3>${producto.nombre}</h3>
                <h4 class="text-success mb-3">${producto.precio}</h4>
                <p>${producto.descripcion || ''}</p>
                <div class="mt-4">
                    <button class="primary-btn me-3 p-4">Comprar ya</button>
                </div>
                <div class="mt-4">
                    <button class="site-btn p-4">Agregar al carrito</button>
                </div>
            </div>
        `;

        // Listeners para miniaturas
        document.querySelectorAll('.img-miniatura').forEach(img => {
            img.addEventListener('click', function() {
                imagenSeleccionada = this.getAttribute('src');
                renderDetalle();
            });
        });
    }
});
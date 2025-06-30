document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('gallery-container');

    // Fallback: si no existe el contenedor, detener
    if (!container) return;

    fetch('galeria.json')
        .then(res => res.json())
        .then(imagenes => {
            let html = '';
            imagenes.forEach(img => {
                html += `
                    <div class="gallery-item">
                        <img
                            src="${img.thumbnail}"
                            data-large="${img.large}"
                            alt="${img.alt || ''}"
                            class="gallery-img"
                            onclick="openModal(this)" />
                    </div>
                `;
            });
            container.innerHTML = html;
        })
        .catch(err => console.error('Error cargando galeria.json', err));
});
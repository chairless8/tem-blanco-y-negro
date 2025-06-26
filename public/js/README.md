# Módulo de Carrito de Compras - IceGreen

## Descripción
Este módulo proporciona funcionalidad completa de carrito de compras para la tienda IceGreen. Está diseñado de manera modular y reutilizable.

## Archivos

### `cart.js`
Contiene la clase `ShoppingCart` que maneja toda la lógica del carrito:
- Gestión de productos en el carrito
- Persistencia en localStorage
- Interfaz de usuario del sidebar
- Cálculo de totales
- Eventos de interacción

### `cart.css`
Contiene todos los estilos relacionados con el carrito:
- Estilos del sidebar del carrito
- Estilos del icono flotante del carrito (esquina inferior izquierda)
- Estilos de los botones "Agregar al Carrito"
- Estilos de los items del carrito
- Diseño responsive

### `productos.js`
Maneja la renderización de productos y la integración con el carrito:
- Carga de productos desde JSON
- Filtrado por categorías
- Botones "Agregar al Carrito"
- Feedback visual

## Uso

### Inicialización
El carrito se inicializa automáticamente cuando se carga la página:

```html
<!-- CSS del carrito -->
<link rel="stylesheet" href="css/cart.css" type="text/css">

<!-- Scripts -->
<script src="js/cart.js"></script>
<script src="js/productos.js"></script>
```

### HTML Requerido
Para que el carrito funcione, necesitas incluir estos elementos HTML:

```html
<!-- Cart Sidebar -->
<div class="cart-sidebar" id="cartSidebar">
    <div class="cart-header">
        <h3>Carrito de Compras</h3>
        <button class="cart-close" id="cartClose">&times;</button>
    </div>
    <div class="cart-content" id="cartContent"></div>
    <div class="cart-footer" id="cartFooter"></div>
</div>

<!-- Icono del carrito en el header -->
<div class="cart-icon" id="cartIcon">
    <i class="fa fa-shopping-cart"></i>
    <span class="cart-count" id="cartCount">0</span>
</div>
```

### API del Carrito

#### Métodos Principales

```javascript
// Agregar producto al carrito
cart.addToCart(producto);

// Remover producto del carrito
cart.removeFromCart(productId);

// Obtener productos del carrito
cart.getCart();

// Limpiar carrito
cart.clearCart();

// Obtener cantidad total de items
cart.getCartItemCount();

// Obtener total del carrito
cart.getCartTotal();

// Confirmar orden
cart.confirmOrder();
```

#### Estructura de Producto
```javascript
{
    id: number,
    nombre: string,
    imagen: string,
    precio: string,
    quantity: number
}
```

### Integración en otras páginas

Para usar el carrito en otras páginas, simplemente incluye:

```html
<!-- 1. CSS del carrito -->
<link rel="stylesheet" href="css/cart.css" type="text/css">

<!-- 2. HTML del carrito -->
<div class="cart-sidebar" id="cartSidebar">...</div>
<div class="cart-icon" id="cartIcon">...</div>

<!-- 3. Scripts -->
<script src="js/cart.js"></script>
```

### Personalización

#### Cambiar comportamiento de confirmación
```javascript
// Sobrescribir el método confirmOrder
cart.confirmOrder = function() {
    // Tu lógica personalizada aquí
    console.log('Carrito personalizado:', this.cart);
};
```

#### Agregar validaciones
```javascript
// Antes de agregar al carrito
if (producto.stock > 0) {
    cart.addToCart(producto);
} else {
    alert('Producto sin stock');
}
```

#### Personalizar estilos
Puedes sobrescribir los estilos del carrito agregando CSS después de `cart.css`:

```css
/* Personalizar colores del carrito */
.cart-sidebar {
    background: #f8f9fa;
}

.cart-icon i {
    color: #007bff;
}

.add-to-cart-btn {
    background: #28a745;
}
```

## Características

- ✅ Persistencia en localStorage
- ✅ Interfaz responsive
- ✅ Feedback visual
- ✅ Cálculo automático de totales
- ✅ Gestión de cantidades
- ✅ Modular y reutilizable
- ✅ Compatible con múltiples páginas
- ✅ Estilos separados y organizados

## Dependencias

- Font Awesome (para iconos)
- Bootstrap (para estilos base)
- jQuery (para algunos eventos)

## Compatibilidad

- Chrome, Firefox, Safari, Edge
- Móviles y tablets
- IE11+ (con polyfills si es necesario)

## Estructura de Archivos

```
public/
├── css/
│   └── cart.css          # Estilos del carrito
├── js/
│   ├── cart.js           # Lógica del carrito
│   ├── productos.js      # Renderización de productos
│   └── README.md         # Documentación
└── tienda.html           # Página de ejemplo
```

## Características Especiales

### Comportamiento del Carrito
- **Cierre automático**: El carrito solo se cierra automáticamente cuando se elimina el último producto
- **Icono flotante**: El icono del carrito flota en la esquina inferior izquierda de la pantalla
- **Persistencia**: Los productos permanecen en el carrito entre sesiones
- **Feedback visual**: Animaciones y efectos hover para mejor UX
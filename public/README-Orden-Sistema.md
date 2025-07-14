# 🛒 Sistema de Confirmación de Órdenes y Contacto - IceGreen

## 📋 Descripción
Sistema completo de confirmación de órdenes y formulario de contacto con envío automático de emails usando EmailJS. Incluye modal profesional para órdenes, formulario de contacto funcional, y notificaciones por email automáticas.

## ✨ Características

### 🛒 **Sistema de Órdenes**
- **Modal responsive** y profesional para confirmación de órdenes
- **Formulario completo** con validación (nombre, email, teléfono, dirección, notas)
- **Resumen detallado** de productos con tallas y colores
- **Generación automática** de IDs únicos para cada orden
- **Emails HTML profesionales** con detalles completos de la orden

### 📧 **Sistema de Contacto**
- **Formulario de contacto funcional** con validación en tiempo real
- **Envío automático de emails** al administrador
- **Estados de carga** y feedback visual durante el envío
- **Campos requeridos** (nombre, apellido, email, asunto, mensaje)
- **Confirmación visual** del envío exitoso

### 🎨 **Características Generales**
- **Estados de carga** y feedback visual
- **Totalmente responsive** para móviles y desktop
- **Validación en tiempo real** de formularios
- **Integración completa con EmailJS**

## 🚀 Configuración Rápida

### Paso 1: Configurar EmailJS
1. Ve a [emailjs.com](https://www.emailjs.com/) y crea una cuenta gratuita
2. Configura un servicio de email (Gmail, Outlook, etc.)
3. Crea un template usando el código HTML de `emailjs-setup.md`
4. Anota tus credenciales: Service ID, Template ID, y Public Key

### Paso 2: Configurar credenciales
1. Abre el archivo `js/emailjs-config.js`
2. Reemplaza los valores predeterminados con tus credenciales reales:
```javascript
const EMAILJS_CONFIG = {
    SERVICE_ID: 'tu_service_id_real',    // ej: 'service_abc123'
    TEMPLATE_ID: 'tu_template_id_real',  // ej: 'template_xyz789'
    PUBLIC_KEY: 'tu_public_key_real',    // ej: 'user_def456'
    TO_EMAIL: 'tu-email@ejemplo.com'     // donde recibirás las órdenes
};

const EMAILJS_CONFIGURED = true; // ← ¡Cambiar a true!
```

### Paso 3: Probar el sistema
1. Agrega productos al carrito
2. Haz clic en "Confirmar Orden"
3. Llena el formulario y envía
4. Revisa tu email para la confirmación

## 📁 Archivos del Sistema

### 🔧 Archivos principales
- `js/cart.js` - Lógica principal del carrito y sistema de órdenes
- `js/contact.js` - Lógica del formulario de contacto
- `js/emailjs-config.js` - Configuración de EmailJS (⚠️ DEBES MODIFICAR)
- `css/cart.css` - Estilos del carrito y modal de órdenes
- `css/contact.css` - Estilos específicos del formulario de contacto
- `tienda.html` - Página de tienda con sistema de órdenes
- `detalle.html` - Página de detalle con sistema de órdenes
- `contact.html` - Página de contacto con formulario funcional

### 📚 Documentación
- `emailjs-setup.md` - Guía detallada de configuración de EmailJS
- `README-Orden-Sistema.md` - Este archivo

## 🎨 Modal de Confirmación

El modal incluye:
- **Resumen de la orden** con productos, cantidades y precios
- **Formulario de cliente** con campos obligatorios y opcionales
- **Validación en tiempo real**
- **Estados de carga** durante el envío
- **Diseño responsive** para todos los dispositivos

## 📧 Email de Confirmación

El email enviado incluye:
- Header profesional con logo de IceGreen
- Información completa de la orden (ID único, fecha)
- Datos del cliente (nombre, email, teléfono, dirección)
- Tabla detallada de productos con precios
- Total de la orden
- Notas adicionales del cliente
- Instrucciones para confirmar la orden

⚠️ **Importante**:
- **Sistema de órdenes**: Disponible en páginas de **tienda** y **detalle de producto**
- **Sistema de contacto**: Disponible en la página de **contacto**
- En otras páginas solo funcionará el carrito básico sin envío de emails

## 🔒 Variables del Template EmailJS

### 🛒 **Variables del Template de Órdenes:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{to_email}}` | **Email de destino** | **USAR EN "To email"** |
| `{{order_id}}` | ID único de la orden | ICE-20241201-ABC123 |
| `{{order_date}}` | Fecha y hora | 1 de diciembre de 2024, 14:30 |
| `{{customer_name}}` | Nombre del cliente | María García |
| `{{customer_email}}` | Email del cliente | maria@email.com |
| `{{customer_phone}}` | Teléfono | +52 555 123 4567 |
| `{{customer_address}}` | Dirección de envío | Calle Principal 123... |
| `{{order_notes}}` | Notas adicionales | Entrega por la mañana |
| `{{{order_rows}}}` | HTML de productos | (tabla con productos) |
| `{{total}}` | Total formateado | 1,250 |

⚠️ **Importante**: Usa `{{{order_rows}}}` con triple llaves para el HTML de productos.

### 📧 **Variables del Template de Contacto:**

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{to_email}}` | **Email de destino** | **USAR EN "To email"** |
| `{{customer_name}}` | Nombre completo | María García López |
| `{{customer_email}}` | Email del cliente | maria@email.com |
| `{{subject}}` | Asunto del mensaje | Consulta sobre productos |
| `{{email_body}}` | Mensaje completo con datos | (mensaje formateado) |

## 🛠️ Funciones Principales

### 🛒 **Sistema de Órdenes (cart.js)**

#### `confirmOrder()`
- Abre el modal de confirmación
- Valida que el carrito no esté vacío

#### `handleOrderSubmission()`
- Maneja el envío del formulario
- Genera ID único de orden
- Envía email usando EmailJS
- Limpia el carrito al confirmar

#### `generateOrderId()`
- Genera IDs únicos: `ICE-YYYYMMDD-RANDOM`
- Ejemplo: `ICE-20241201-ABC123`

### 📧 **Sistema de Contacto (contact.js)**

#### `handleFormSubmission()`
- Procesa el formulario de contacto
- Combina nombre y apellido en `customer_name`
- Formatea el mensaje en `email_body`
- Envía email al administrador

#### `initEmailJS()`
- Inicializa EmailJS para contacto
- Valida configuración
- Maneja errores de inicialización

## 🎯 Flujo del Usuario

### 🛒 **Flujo de Órdenes**
1. **Usuario agrega productos** al carrito
2. **Clic en "Confirmar Orden"** abre el modal
3. **Revisa el resumen** de productos y precios
4. **Llena sus datos** en el formulario
5. **Envía la orden** - se muestra estado de carga
6. **Recibe confirmación** en pantalla y por email
7. **Carrito se limpia** automáticamente

### 📧 **Flujo de Contacto**
1. **Usuario va a página de contacto**
2. **Llena el formulario** (nombre, apellido, email, asunto, mensaje)
3. **Hace clic en "Mandar Mensaje"** - se muestra estado de carga
4. **Recibe confirmación** en pantalla
5. **Formulario se limpia** automáticamente
6. **Administrador recibe email** con el mensaje

## 🎯 Flujo del Administrador

### 🛒 **Para Órdenes**
1. **Recibe email** con todos los detalles de la orden
2. **Revisa productos** y datos del cliente
3. **Contacta al cliente** usando teléfono o email
4. **Confirma disponibilidad** y procesa pedido
5. **Coordina pago y envío**

### 📧 **Para Mensajes de Contacto**
1. **Recibe email** con el mensaje del cliente
2. **Revisa asunto y contenido** del mensaje
3. **Responde directamente** al email (reply-to configurado)
4. **Proporciona información** solicitada
5. **Sigue up** según sea necesario

## 🔧 Personalización

### Modificar estilos

#### Estilos del modal de órdenes
Los estilos están en `css/cart.css` bajo la sección "ESTILOS DEL MODAL DE ORDEN". Puedes personalizar:
- Colores del modal
- Fuentes y tamaños
- Animaciones del modal
- Responsive breakpoints

#### Estilos del formulario de contacto
Los estilos están en `css/contact.css`. Incluye:
- Estilos del botón con estados de loading y éxito
- Validación visual de campos (válido/inválido)
- Animaciones de envío y confirmación
- Mensajes de éxito/error
- Responsive design completo

### Organización del código
- **CSS Modular**:
  - `cart.css` - Estilos del carrito y modal de órdenes
  - `contact.css` - Estilos específicos del formulario de contacto
- **JavaScript**:
  - `cart.js` - Lógica del carrito sin estilos inline
  - `contact.js` - Lógica del formulario de contacto
- **Configuración**: Las credenciales de EmailJS están en `emailjs-config.js`
- **Páginas**: EmailJS solo se carga donde es necesario para optimizar performance

### Agregar campos al formulario
1. Modifica el HTML en `createOrderModal()`
2. Ajusta el manejo en `handleOrderSubmission()`
3. Agrega las variables al template de EmailJS

### Cambiar formato del email
1. Modifica `buildCartEmailRows()` para los productos
2. Ajusta las variables en `handleOrderSubmission()`
3. Actualiza el template HTML en EmailJS

## 🐛 Solución de Problemas

### Email no se envía

#### 🚨 **Error 422 "The recipients address is empty"**
- ✅ En el template de EmailJS, el campo **"To email"** debe tener: `{{to_email}}`
- ✅ Verifica que `TO_EMAIL` en `emailjs-config.js` tenga tu email real
- ✅ Guarda el template después de hacer cambios

#### 🔧 **Otros problemas de envío**
- ✅ Verifica que `EMAILJS_CONFIGURED = true`
- ✅ Confirma que las credenciales sean correctas
- ✅ Revisa la consola del navegador para errores
- ✅ Verifica que el template exista en EmailJS

### Modal no aparece
- ✅ Asegúrate de que hay productos en el carrito
- ✅ Revisa errores en la consola
- ✅ Verifica que todos los scripts estén cargados

### Email llega sin formato
- ✅ Usa `{{{order_rows}}}` con triple llaves
- ✅ Asegúrate de que el template sea HTML, no texto

## 💡 Límites y Consideraciones

### EmailJS (cuenta gratuita)
- **200 emails por mes**
- Para más volumen, considera plan de pago

### Seguridad
- Las credenciales de EmailJS son públicas (normal)
- No incluye procesamiento de pagos
- Sistema diseñado para confirmación, no transacciones

## 🆘 Soporte

Si tienes problemas:
1. Revisa `emailjs-setup.md` para configuración detallada
2. Verifica la consola del navegador para errores
3. Testa con cuentas de email diferentes
4. Confirma que todos los archivos estén en su lugar

## 🎉 ¡Listo!

Una vez configurado, tendrás un sistema profesional de confirmación de órdenes que:
- Mejora la experiencia del cliente
- Automatiza la recopilación de datos
- Profesionaliza tu proceso de ventas
- Facilita el seguimiento de pedidos

¡Disfruta de tu nuevo sistema de órdenes! 🛍️✨
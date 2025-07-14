/**
 * Configuración de EmailJS para IceGreen
 *
 * INSTRUCCIONES:
 * 1. Ve a https://www.emailjs.com/ y crea una cuenta
 * 2. Configura tu servicio de email (Gmail, Outlook, etc.)
 * 3. Crea un template usando el HTML proporcionado en emailjs-setup.md
 * 4. Reemplaza los valores abajo con tus credenciales reales
 * 5. Guarda este archivo
 */

// ⚠️ IMPORTANTE: Reemplaza estos valores con tus credenciales reales de EmailJS
const EMAILJS_CONFIG = {
    // Tu Service ID de EmailJS (ej: 'service_abc123')
    SERVICE_ID: 'service_9g6bfrz',

    // Tu Template ID para el carrito de compras
    TEMPLATE_ID_CART: 'template_7h2c9y3',

    // Tu Template ID para el formulario de contacto
    TEMPLATE_ID_CONTACT: 'template_f28usja',

    // Tu Public Key de EmailJS (ej: 'user_def456')
    PUBLIC_KEY: 'gNKQHf1HfvSjDR-k5',

    // Email donde quieres recibir las órdenes (opcional, puedes configurarlo en el template)
    TO_EMAIL: 'icegreen.mx@gmail.com'
};

// ✅ Una vez configurado, cambia esta variable a true
const EMAILJS_CONFIGURED = true;

// 🚨 NO MODIFIQUES NADA DEBAJO DE ESTA LÍNEA
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
window.EMAILJS_CONFIGURED = EMAILJS_CONFIGURED;

// Validación básica
if (typeof window !== 'undefined') {
    if (!EMAILJS_CONFIGURED) {
        console.warn('⚠️ EmailJS no está configurado. Lee las instrucciones en emailjs-config.js');
    } else if (
        EMAILJS_CONFIG.SERVICE_ID === 'tu_service_id' ||
        EMAILJS_CONFIG.TEMPLATE_ID === 'order_template' ||
        EMAILJS_CONFIG.PUBLIC_KEY === 'tu_public_key'
    ) {
        console.error('❌ EmailJS mal configurado. Asegúrate de reemplazar todos los valores predeterminados.');
    } else {
        console.log('✅ EmailJS configurado correctamente');
    }
}
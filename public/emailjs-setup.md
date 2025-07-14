# Configuración de EmailJS para Sistema de Confirmación de Órdenes

## 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

## 2. Configurar el servicio de email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Anota el **Service ID** que se genera

## 3. Crear los templates de email

### 🛒 **Template para Carrito de Compras**
1. Ve a "Email Templates" → "Create New Template"
2. Nombre: "Order Confirmation - IceGreen"
3. **IMPORTANTE**: En la configuración del template:
   - **To email**: `{{to_email}}` (esto es crucial para que funcione)
   - **From name**: Tu nombre o "IceGreen"
   - **Reply to**: `{{customer_email}}` (opcional, para responder al cliente)
4. Usa el siguiente template:

### Template de Confirmación de Orden
```html
Subject: Nueva Orden {{order_id}} - IceGreen

Body:
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #28a745; color: white; padding: 20px; text-align: center; }
        .order-info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .customer-info { margin: 20px 0; }
        .products-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .products-table th, .products-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        .products-table th { background: #f8f9fa; font-weight: bold; }
        .total { font-size: 18px; font-weight: bold; text-align: right; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧊 IceGreen</h1>
            <h2>Nueva Orden Recibida</h2>
        </div>

        <div class="order-info">
            <h3>Información de la Orden</h3>
            <p><strong>ID de Orden:</strong> {{order_id}}</p>
            <p><strong>Fecha:</strong> {{order_date}}</p>
        </div>

        <div class="customer-info">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> {{customer_name}}</p>
            <p><strong>Email:</strong> {{customer_email}}</p>
            <p><strong>Teléfono:</strong> {{customer_phone}}</p>
            <p><strong>Dirección:</strong> {{customer_address}}</p>
            {{#order_notes}}
            <p><strong>Notas:</strong> {{order_notes}}</p>
            {{/order_notes}}
        </div>

        <h3>Productos Ordenados</h3>
        <table class="products-table">
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                {{{order_rows}}}
            </tbody>
        </table>

        <div class="total">
            Total: ${{total}}mxn
        </div>

        <div class="footer">
            <p>Para confirmar esta orden, responde a este email con "CONFIRMO" o contacta al cliente directamente.</p>
            <p>IceGreen - Ropa Personalizada</p>
        </div>
    </div>
</body>
</html>
```

### 📧 **Template para Formulario de Contacto**
1. Ve a "Email Templates" → "Create New Template"
2. Nombre: "Contact Form - IceGreen"
3. **Configuración del template:**
   - **To email**: `{{to_email}}`
   - **From name**: IceGreen
   - **Reply to**: `{{customer_email}}`
   - **Subject**: Nuevo mensaje de contacto de {{customer_name}}
4. Usa el siguiente template:

```html
Subject: Nuevo mensaje de contacto de {{customer_name}}

Body:
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #007bff; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8f9fa; margin: 20px 0; border-radius: 8px; }
        .contact-info { margin: 20px 0; padding: 15px; background: white; border-left: 4px solid #007bff; }
        .message-content { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧊 IceGreen</h1>
            <h2>Nuevo Mensaje de Contacto</h2>
        </div>

        <div class="contact-info">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> {{customer_name}}</p>
            <p><strong>Email:</strong> {{customer_email}}</p>
            <p><strong>Asunto:</strong> {{subject}}</p>
        </div>

        <div class="message-content">
            <h3>Mensaje:</h3>
            <div style="white-space: pre-line;">{{email_body}}</div>
        </div>

        <div class="footer">
            <p>Para responder a este mensaje, simplemente responde a este email.</p>
            <p>IceGreen - Ropa Personalizada</p>
        </div>
    </div>
</body>
</html>
```

## 4. Configurar las credenciales
1. Anota el **Template ID** del template que creaste
2. Ve a "Account" > "General" y anota tu **Public Key**
3. En el archivo `js/cart.js`, reemplaza las siguientes líneas:

```javascript
this.EMAIL_CONFIG = {
    SERVICE_ID: 'tu_service_id',      // Reemplazar con tu Service ID
    TEMPLATE_ID: 'order_template',     // Reemplazar con tu Template ID
    PUBLIC_KEY: 'tu_public_key'       // Reemplazar con tu Public Key
};
```

## 5. Variables del Template
Asegúrate de que tu template use estas variables:

### 🔧 **Variables de configuración del template:**
- `{{to_email}}` - **OBLIGATORIO**: Usar en el campo "To email" del template
- `{{customer_email}}` - **OPCIONAL**: Usar en "Reply to" para responder al cliente

### 📋 **Variables del template de carrito:**
- `{{order_id}}` - ID único de la orden
- `{{order_date}}` - Fecha y hora de la orden
- `{{customer_name}}` - Nombre del cliente
- `{{customer_email}}` - Email del cliente
- `{{customer_phone}}` - Teléfono del cliente
- `{{customer_address}}` - Dirección del cliente
- `{{order_notes}}` - Notas adicionales
- `{{{order_rows}}}` - HTML con los productos (usar triple llaves para HTML)
- `{{total}}` - Total de la orden

### 📧 **Variables del template de contacto:**
- `{{customer_name}}` - Nombre completo (nombre + apellido)
- `{{customer_email}}` - Email del cliente
- `{{subject}}` - Asunto del mensaje
- `{{email_body}}` - Contenido completo del mensaje con datos adicionales

## 6. Ejemplo de configuración final
```javascript
// js/emailjs-config.js
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_abc123',
    TEMPLATE_ID_CART: 'template_xyz789',     // Template para carrito
    TEMPLATE_ID_CONTACT: 'template_abc456',  // Template para contacto
    PUBLIC_KEY: 'user_def456',
    TO_EMAIL: 'tu-email@ejemplo.com'
};
const EMAILJS_CONFIGURED = true;
```

## 7. Configuración de destinatario
Para que los emails lleguen a tu correo:

### ✅ **Método recomendado (automático):**
1. En EmailJS, en tu template, en el campo **"To email"** escribe: `{{to_email}}`
2. El sistema automáticamente usará el email configurado en `emailjs-config.js`

### 🔧 **Configuración en el template:**
```
Template Settings:
- To email: {{to_email}}
- From name: IceGreen
- Reply to: {{customer_email}}
```

### ⚠️ **Si no funciona:**
1. Verifica que el campo "To email" del template tenga exactamente `{{to_email}}`
2. Asegúrate de que `TO_EMAIL` en `emailjs-config.js` tenga tu email real
3. Guarda el template después de hacer cambios

## 8. Límites de la cuenta gratuita
- 200 emails por mes
- Para más emails, actualiza a un plan de pago

## 9. Testing
1. Agrega algunos productos al carrito
2. Haz clic en "Confirmar Orden"
3. Llena el formulario y envía
4. Revisa tu bandeja de entrada

¡Listo! Ahora tu sistema de confirmación de órdenes estará funcionando con EmailJS.
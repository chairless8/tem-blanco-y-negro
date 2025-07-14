class ContactForm {
    constructor() {
        this.emailjsInitialized = false;
        this.init();
    }

    init() {
        this.initEmailJS();
        this.bindEvents();
    }

    initEmailJS() {
        // Usar configuración del archivo separado
        if (window.EMAILJS_CONFIG) {
            this.EMAIL_CONFIG = window.EMAILJS_CONFIG;
        } else {
            console.error('No se encontró la configuración de EmailJS. Asegúrate de incluir emailjs-config.js');
            return;
        }

        // Verificar si EmailJS está configurado
        if (!window.EMAILJS_CONFIGURED) {
            console.warn('⚠️ EmailJS no está configurado. Revisa el archivo emailjs-config.js');
            return;
        }

        // Inicializar EmailJS cuando esté disponible
        if (typeof emailjs !== 'undefined') {
            emailjs.init(this.EMAIL_CONFIG.PUBLIC_KEY);
            this.emailjsInitialized = true;
            console.log('✅ EmailJS inicializado correctamente para contacto');
        } else {
            console.warn('EmailJS no está disponible. Asegúrate de incluir el script.');
        }
    }

    bindEvents() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }
    }

    async handleFormSubmission(e) {
        e.preventDefault();

        if (!this.emailjsInitialized) {
            alert('EmailJS no está inicializado. Asegúrate de que el script de EmailJS esté cargado.');
            return;
        }

        const formData = new FormData(e.target);
        const contactData = Object.fromEntries(formData);

        const sendMessageBtn = document.getElementById('sendMessageBtn');
        const btnText = sendMessageBtn.querySelector('.btn-text');
        const btnLoading = sendMessageBtn.querySelector('.btn-loading');

        // Deshabilitar botón y mostrar loading
        sendMessageBtn.classList.add('loading');
        btnText.style.display = 'none';
        btnLoading.innerHTML = '<span class="loading-spinner"></span>Enviando...';
        btnLoading.style.display = 'inline-block';
        sendMessageBtn.disabled = true;

        try {
            // Preparar las variables del template
            const customer_name = `${contactData.firstName} ${contactData.lastName}`;
            const email_body = contactData.message;

            const templateParams = {
                to_email: 'icegreen.mx@gmail.com', // Email administrador
                customer_name: customer_name,
                customer_email: contactData.email,
                subject: contactData.subject,
                email_body: email_body,
                reply_to: contactData.email
            };

            // Enviar email al administrador
            const response = await emailjs.send(
                this.EMAIL_CONFIG.SERVICE_ID,
                this.EMAIL_CONFIG.TEMPLATE_ID_CONTACT,
                templateParams
            );

            console.log('Email de contacto enviado con éxito:', response);

            // Mostrar animación de éxito en el botón
            sendMessageBtn.classList.add('success-animation');
            btnText.textContent = '¡Enviado!';
            btnText.style.display = 'inline-block';
            btnLoading.style.display = 'none';

            // Mostrar mensaje de éxito
            this.showMessage(`¡Mensaje enviado con éxito!\n\nHemos recibido tu mensaje "${contactData.subject}".\nNos pondremos en contacto contigo pronto a ${contactData.email}.`, 'success');

            // Limpiar formulario después de un delay
            setTimeout(() => {
                document.getElementById('contactForm').reset();
                btnText.textContent = 'Mandar Mensaje';
                sendMessageBtn.classList.remove('success-animation');
                sendMessageBtn.disabled = false;
            }, 3000);

        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            this.showMessage('Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente o contáctanos directamente.', 'error');
        } finally {
            // Restaurar estado del botón
            sendMessageBtn.classList.remove('loading');
            if (!sendMessageBtn.classList.contains('success-animation')) {
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                sendMessageBtn.disabled = false;
            }
        }
    }

    showMessage(message, type = 'info') {
        // Buscar si ya existe un mensaje
        let messageElement = document.querySelector('.form-message');

        if (!messageElement) {
            // Crear elemento de mensaje
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';

            // Insertar después del formulario
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(messageElement, form.nextSibling);
        }

        // Configurar el mensaje
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;

        // Auto-ocultar después de 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }

    // Método para enviar confirmación al cliente (opcional)
    async sendConfirmationToClient(contactData) {
        try {
            const confirmationParams = {
                to_email: contactData.email,
                customer_name: `${contactData.firstName} ${contactData.lastName}`,
                subject: 'Confirmación - Hemos recibido tu mensaje',
                email_body: `
Hola ${contactData.firstName},

Hemos recibido tu mensaje con el asunto: "${contactData.subject}"

Nos pondremos en contacto contigo pronto.

Gracias por contactar a IceGreen.

---
Este es un mensaje automático de confirmación.
                `
            };

            // Solo enviar si tienes un template de confirmación configurado
            if (this.EMAIL_CONFIG.TEMPLATE_ID_CONFIRMATION) {
                await emailjs.send(
                    this.EMAIL_CONFIG.SERVICE_ID,
                    this.EMAIL_CONFIG.TEMPLATE_ID_CONFIRMATION,
                    confirmationParams
                );
                console.log('Email de confirmación enviado al cliente');
            }
        } catch (error) {
            console.warn('No se pudo enviar confirmación al cliente:', error);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.contactForm = new ContactForm();
});
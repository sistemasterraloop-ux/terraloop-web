const nodemailer = require('nodemailer');

// Configuración del transporter
// Se asume uso de servicio SMTP genérico o Gmail (requiere App Password)
// Configuración del transporter
// Usamos configuración explícita para evitar problemas de conexión en la nube (Render)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true para puerto 465, false para otros
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    // Opciones adicionales para evitar errores de certificado en algunos entornos
    tls: {
        rejectUnauthorized: false
    }
});

/**
 * Envía el correo de solicitud de cotización
 * @param {Object} data - Datos del formulario
 */
async function sendQuoteRequest(data) {
    const { name, email, phone, company, service, message } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'comercial.terraloop@gmail.com', // Destinatario final
        subject: `Nueva Solicitud de Cotización - Web TERRALOOP: ${service}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px;">
                <h2 style="color: #569E20;">Nueva Solicitud de Cotización</h2>
                <p>Se ha recibido una nueva solicitud desde el sitio web.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Nombre:</td>
                        <td style="padding: 10px;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Correo:</td>
                        <td style="padding: 10px;">${email}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
                        <td style="padding: 10px;">${phone || 'No especificado'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Empresa:</td>
                        <td style="padding: 10px;">${company || 'Particular'}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Servicio de Interés:</td>
                        <td style="padding: 10px;">${service}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px;">
                    <h3 style="color: #2C3E42;">Mensaje del Usuario:</h3>
                    <p style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                        ${message}
                    </p>
                </div>
                
                <p style="text-align: center; color: #888; margin-top: 30px; font-size: 12px;">
                    Enviado automáticamente desde el sistema web de Terraloop.
                </p>
            </div>
        `
    };

    // 1. Enviar correo a la empresa
    await transporter.sendMail(mailOptions);

    // 2. Enviar confirmación al usuario
    try {
        await sendQuoteConfirmation(data);
    } catch (error) {
        console.error('Error enviando confirmación de cotización al usuario:', error);
        // No lanzamos error para no interrumpir el flujo principal si ya se notificó a la empresa
        // Aunque el requerimiento dice "Retornar éxito solo si ambos son exitosos", 
        // en la práctica es mejor no fallar si ya tenemos los datos. 
        // Ajustaremos para cumplir estrictamente:
        throw new Error('Error enviando correo de confirmación al usuario.');
    }
}

/**
 * Envía confirmación de cotización al usuario
 * @param {Object} data 
 */
async function sendQuoteConfirmation(data) {
    const { name, email, service, message } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        replyTo: 'comercial.terraloop@gmail.com',
        subject: 'Hemos recibido tu solicitud de cotización - TERRALOOP',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; border-top: 5px solid #569E20;">
                <h2 style="color: #569E20;">Hola, ${name}</h2>
                <p>Hemos recibido correctamente tu solicitud de cotización. Agradecemos tu interés en nuestros servicios.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2C3E42; font-size: 16px;">Resumen de tu solicitud:</h3>
                    <ul style="padding-left: 20px; color: #555;">
                        <li><strong>Servicio:</strong> ${service}</li>
                        <li><strong>Mensaje:</strong> "${message}"</li>
                        <li><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</li>
                    </ul>
                </div>

                <p>Nuestro equipo comercial revisará tu requerimiento y se pondrá en contacto contigo a la brevedad posible.</p>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #777;">
                    Si tienes alguna duda adicional, puedes escribirnos a <a href="mailto:comercial.terraloop@gmail.com" style="color: #569E20;">comercial.terraloop@gmail.com</a>
                </p>
                <p style="font-size: 12px; color: #aaa; text-align: center;">TERRALOOP S.A.S. - Ingeniería y Sostenibilidad</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

/**
 * Envía el correo de PQRS
 * @param {Object} data - Datos del formulario PQRS
 */
async function sendPQRSRequest(data) {
    const { type, name, email, phone, subject, description } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'comercial.terraloop@gmail.com',
        subject: `Nueva PQRS (${type}) - Web TERRALOOP: ${subject}`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; border-top: 5px solid #2C3E42;">
                <h2 style="color: #2C3E42;">Nueva Solicitud PQRS</h2>
                <p>Se ha radicado una <strong>${type}</strong> desde el sitio web.</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Tipo:</td>
                        <td style="padding: 10px; color: #d32f2f; font-weight: bold;">${type}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Nombre:</td>
                        <td style="padding: 10px;">${name}</td>
                    </tr>
                    <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Correo:</td>
                        <td style="padding: 10px;">${email}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold;">Teléfono:</td>
                        <td style="padding: 10px;">${phone || 'No especificado'}</td>
                    </tr>
                     <tr style="background-color: #f9f9f9;">
                        <td style="padding: 10px; font-weight: bold;">Asunto:</td>
                        <td style="padding: 10px;">${subject}</td>
                    </tr>
                </table>

                <div style="margin-top: 20px;">
                    <h3 style="color: #2C3E42;">Descripción de la Solicitud:</h3>
                    <p style="background-color: #f0f0f0; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${description}</p>
                </div>
                
                <p style="text-align: center; color: #888; margin-top: 30px; font-size: 12px;">
                    Sistema de radicación PQRS - Terraloop S.A.S.
                </p>
            </div>
        `
    };

    // 1. Enviar correo a la empresa
    await transporter.sendMail(mailOptions);

    // 2. Enviar confirmación al usuario
    try {
        await sendPQRSConfirmation(data);
    } catch (error) {
        console.error('Error enviando confirmación de PQRS al usuario:', error);
        throw new Error('Error enviando correo de confirmación al usuario.');
    }
}

/**
 * Envía confirmación de PQRS al usuario
 * @param {Object} data 
 */
async function sendPQRSConfirmation(data) {
    const { type, name, email, subject } = data;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        replyTo: 'comercial.terraloop@gmail.com',
        subject: 'Confirmación de radicación de solicitud PQRS - TERRALOOP',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; max-width: 600px; border-top: 5px solid #2C3E42;">
                <h2 style="color: #2C3E42;">Cordial saludo, ${name}</h2>
                <p>Le informamos que su solicitud ha sido radicada correctamente en nuestro sistema.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #2C3E42; font-size: 16px;">Detalles de la radicación:</h3>
                    <ul style="padding-left: 20px; color: #555;">
                        <li><strong>Tipo de Solicitud:</strong> ${type}</li>
                        <li><strong>Asunto:</strong> ${subject}</li>
                        <li><strong>Fecha de Radicación:</strong> ${new Date().toLocaleString('es-CO')}</li>
                    </ul>
                </div>

                <p>Estaremos gestionando su solicitud y le daremos respuesta a través de este medio o al teléfono de contacto suministrado.</p>

                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="font-size: 12px; color: #777;">
                    Canal de seguimiento: <a href="mailto:comercial.terraloop@gmail.com" style="color: #569E20;">comercial.terraloop@gmail.com</a>
                </p>
                <p style="font-size: 12px; color: #aaa; text-align: center;">TERRALOOP S.A.S. - Sistema de Gestión de PQRS</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    sendQuoteRequest,
    sendPQRSRequest
};

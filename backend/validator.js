/**
 * Valida los datos de la solicitud de cotización
 * @param {Object} data 
 * @returns {Object} { isValid: boolean, errors: Array }
 */
function validateQuoteRequest(data) {
    const errors = [];
    const { name, email, service, message } = data;

    // Campos obligatorios
    if (!name || name.trim().length === 0) errors.push('El nombre es obligatorio.');
    if (!email || email.trim().length === 0) errors.push('El correo es obligatorio.');
    if (!service || service.trim().length === 0) errors.push('El tipo de servicio es obligatorio.');
    if (!message || message.trim().length === 0) errors.push('El mensaje es obligatorio.');

    // Formato de correo (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('El formato del correo electrónico no es válido.');
    }

    // Sanitización básica (simulada aquí, en prod usar librerías como DOMPurify o validator)
    // Aquí solo verificamos longitudes máximas para evitar buffer overflows o spam gigante
    if (message && message.length > 5000) errors.push('El mensaje es demasiado largo (máx 5000 caracteres).');

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valida los datos de la solicitud PQRS
 * @param {Object} data 
 * @returns {Object} { isValid: boolean, errors: Array }
 */
function validatePQRSRequest(data) {
    const errors = [];
    const { type, name, email, subject, description } = data;

    // Campos obligatorios
    if (!type || type.trim().length === 0) errors.push('El tipo de solicitud es obligatorio.');
    if (!name || name.trim().length === 0) errors.push('El nombre es obligatorio.');
    if (!email || email.trim().length === 0) errors.push('El correo es obligatorio.');
    if (!subject || subject.trim().length === 0) errors.push('El asunto es obligatorio.');
    if (!description || description.trim().length === 0) errors.push('La descripción es obligatoria.');

    // Validar tipo de solicitud
    const validTypes = ['Petición', 'Queja', 'Reclamo', 'Sugerencia'];
    if (type && !validTypes.includes(type)) {
        errors.push('El tipo de solicitud no es válido.');
    }

    // Formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        errors.push('El formato del correo electrónico no es válido.');
    }

    // Validación de longitud
    if (description && description.length > 5000) errors.push('La descripción es demasiado larga (máx 5000 caracteres).');

    return {
        isValid: errors.length === 0,
        errors
    };
}

module.exports = {
    validateQuoteRequest,
    validatePQRSRequest
};

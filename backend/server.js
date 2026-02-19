const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const emailService = require('./emailService');
const { validateQuoteRequest } = require('./validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutes
app.post('/api/quote', async (req, res) => {
    try {
        const data = req.body;

        // 1. Validar datos
        const validation = validateQuoteRequest(data);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos inválidos',
                errors: validation.errors
            });
        }

        // 2. Enviar correo
        await emailService.sendQuoteRequest(data);

        // 3. Responder éxito
        res.status(200).json({
            success: true,
            message: 'Solicitud enviada correctamente'
        });

    } catch (error) {
        console.error('Error procesando solicitud:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar la solicitud.'
        });
    }
});

// Ruta para PQRS
app.post('/api/pqrs', async (req, res) => {
    try {
        const data = req.body;

        // 1. Validar datos
        const { validatePQRSRequest } = require('./validator');
        const validation = validatePQRSRequest(data);

        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: 'Datos inválidos',
                errors: validation.errors
            });
        }

        // 2. Enviar correo
        await emailService.sendPQRSRequest(data);

        // 3. Responder éxito
        res.status(200).json({
            success: true,
            message: 'PQRS radicada correctamente'
        });

    } catch (error) {
        console.error('Error procesando PQRS:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor al procesar la solicitud.'
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.send('Terraloop Backend is running');
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;

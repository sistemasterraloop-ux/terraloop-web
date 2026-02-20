async function testConnection() {
    console.log('--- INICIANDO TEST DE CONEXIÓN ---');
    const url = 'https://terraloop-backend.onrender.com/health';

    try {
        console.log(`Intentando conectar a: ${url}`);
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'text/plain' }
        });

        console.log(`Status: ${response.status}`);
        const text = await response.text();
        console.log(`Respuesta: ${text}`);

        if (response.ok) {
            alert(`CONEXIÓN EXITOSA CON BACKEND\nStatus: ${response.status}\nRespuesta: ${text}`);
        } else {
            alert(`ERROR DE CONEXIÓN\nStatus: ${response.status}\nRespuesta: ${text}`);
        }
    } catch (error) {
        console.error('Error fetch:', error);
        alert(`FALLO CRÍTICO DE CONEXIÓN:\n${error.message}\n\nPosibles causas:\n1. Backend dormido (Render tarda 50s en despertar)\n2. Bloqueo CORS\n3. URL incorrecta`);
    }
}

// Ejecutar al cargar (puedes comentarlo si prefieres llamarlo desde consola)
// window.addEventListener('load', testConnection);
// Exponer globalmente para llamar desde consola/botón
window.testBackend = testConnection;

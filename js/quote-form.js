// Manejo del formulario de cotización
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contacto form');
    const backendUrl = `${CONFIG.API_BASE_URL}/quote`;

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar envío tradicional

            // Obtener botón para feedback visual
            const submitBtn = contactForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;

            // Recopilar datos
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                company: document.getElementById('company') ? document.getElementById('company').value : '', // Campo opcional si existe
                service: 'Consulta General', // Valor por defecto si no hay selector explícito de servicio
                message: document.getElementById('message').value
            };

            // Intentar detectar servicio si hay un campo (en el futuro)
            // Por ahora hardcodeamos o buscamos si existe un select
            const serviceSelect = document.getElementById('service-select');
            if (serviceSelect) {
                formData.service = serviceSelect.value;
            }

            // UI Loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-5 h-5 mr-2"></i> Enviando...';
            lucide.createIcons();

            try {
                const response = await fetch(backendUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    // Éxito: Redirigir a mensaje_enviado.html como confirmación visual
                    window.location.href = 'mensaje_enviado.html';
                } else {
                    throw new Error(result.message || 'Error al enviar la solicitud');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al enviar su solicitud: ' + error.message);

                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();
            }
        });
    }
});

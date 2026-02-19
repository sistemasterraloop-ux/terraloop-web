// Manejo del formulario PQRS
document.addEventListener('DOMContentLoaded', () => {
    const pqrsForm = document.querySelector('form[action="mensaje_enviado.html"]');
    const backendUrl = `${CONFIG.API_BASE_URL}/pqrs`;

    if (pqrsForm) {
        pqrsForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar envío tradicional

            // Obtener botón para feedback visual
            const submitBtn = pqrsForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;

            // Recopilar datos
            const formData = {
                type: document.getElementById('pqrs-type').value,
                name: document.getElementById('pqrs-name').value,
                email: document.getElementById('pqrs-email').value,
                phone: document.getElementById('pqrs-phone').value,
                subject: document.getElementById('pqrs-subject').value,
                description: document.getElementById('pqrs-description').value
            };

            // UI Loading
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i data-lucide="loader" class="animate-spin w-5 h-5 mr-2"></i> Radicando...';
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
                    throw new Error(result.message || 'Error al radicar la solicitud');
                }

            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al radicar su solicitud: ' + error.message);

                // Restaurar botón
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
                lucide.createIcons();
            }
        });
    }
});

# Backend de Terraloop

Este directorio contiene el servidor Node.js encargado de procesar el formulario de cotización y enviar correos electrónicos.

## Requisitos Precoces
- Node.js instalado.

## Instalación
1. Abrir una terminal en esta carpeta:
   ```bash
   cd backend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```

## Configuración
1. Renombrar el archivo `.env.example` a `.env`.
2. Editar `.env` con sus credenciales reales de correo (Gmail App Password recomendada).

## Ejecución
Para iniciar el servidor:
```bash
npm start
```

El servidor escuchará en `http://localhost:3000`. Asegúrese de que este puerto esté libre.

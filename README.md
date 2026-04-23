# 📱 Connect - Red Social Full Stack (NestJS & Angular)

### 📋 Descripción
Connect es una plataforma de red social completa diseñada bajo una arquitectura moderna de microservicios y frontend modular. Este proyecto demuestra el dominio de tecnologías empresariales para la creación de aplicaciones escalables, seguras y de alto rendimiento.

El sistema permite a los usuarios interactuar a través de publicaciones, comentarios y "me gusta", integrando un panel administrativo para la gestión de usuarios y visualización de estadísticas en tiempo real.

---

### ✨ Características Principales
* **Autenticación Robusta:** Implementación de seguridad mediante **JWT (JSON Web Tokens)** con guards personalizados para roles de usuario y administrador.
* **Gestión de Multimedia:** Integración con la API de **Cloudinary** para la carga, almacenamiento y optimización de imágenes de perfil y publicaciones.
* **Experiencia de Usuario (PWA):** Configurada como **Progressive Web App**, permitiendo la instalación en dispositivos móviles y funcionamiento offline.
* **Panel Administrativo:** Dashboard dedicado para la monitorización de logs de actividad, estadísticas de uso y gestión de la comunidad.
* **Interacción en Tiempo Real:** Sistema dinámico de feeds, comentarios y likes con estados actualizados.
* **Validaciones Avanzadas:** Uso de pipes y validadores personalizados tanto en frontend como en backend para garantizar la integridad de los datos.

---

### 🛠️ Stack Tecnológico
* **Backend:** [NestJS](https://nestjs.com/) (Node.js framework), TypeScript, MongoDB (Mongoose).
* **Frontend:** [Angular](https://angular.io/) (v18+), RxJS, CSS3 (Variables dinámicas).
* **Almacenamiento Externo:** Cloudinary SDK.
* **Seguridad:** Passport.js, Bcrypt (hashing de contraseñas).
* **Despliegue:** Preparado para Vercel/Docker.

---

### 📂 Estructura del Proyecto
* **`/backend`**: 
    * `src/auth`: Lógica de autenticación, registro y protección de rutas.
    * `src/publicaciones`: CRUD de posts y lógica de interacción.
    * `src/logs`: Sistema de auditoría de actividad (Logins, Likes, Perfiles).
    * `src/estadisticas`: Agregación de datos para el dashboard administrativo.
* **`/frontend`**:
    * `src/app/core`: Servicios globales, interceptores de autenticación y guards.
    * `src/app/pages`: Módulos de Login, Registro, Feed, Mi Perfil y Dashboards.
    * `src/app/components`: UI compartida (Navbar, Footer, etc.).

---

### 🚀 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone [URL-del-repo]

### Configurar Backend

cd backend
npm install
# Configurar variables de entorno (.env) para MongoDB y Cloudinary
npm run start:dev

### Configurar Frontend

cd frontend
npm install
ng serve

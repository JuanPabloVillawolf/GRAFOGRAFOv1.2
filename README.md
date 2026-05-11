# ☕ Sistema de Gestión Grafógrafo - Suite de Transformación Digital

Sistema profesional de Punto de Venta (POS) y Gestión de Inventario diseñado para la transformación digital de negocios híbridos, específicamente adaptado para el modelo de Librería-Cafetería Grafógrafo.

## 🚀 Vista General

Esta aplicación sirve como una herramienta integral de gestión que transiciona los procesos de negocio manuales hacia un flujo de trabajo digital optimizado. Utilizando **Google Sheets** como base de datos en la nube y **Visualización de Datos en Tiempo Real**, permite a los propietarios tomar decisiones basadas en evidencia sin los costos de infraestructura de bases de datos tradicionales.

## ✨ Características Principales

- **Interfaz POS Omnicanal:** Optimizada para un servicio rápido de cafetería y una gestión detallada de inventario de librería.
- **Control de Inventario Dinámico:** Seguimiento en tiempo real de niveles de stock con alertas automáticas. Historial detallado de movimientos (entradas, salidas y ajustes).
- **Gestión de Cuentas Pendientes (Abiertas):** Seguimiento seguro de abonos y consumos de clientes con **sincronización inmediata (eager sync)** a la nube para evitar pérdida de datos.
- **Dashboard Estratégico:** Visualización interactiva de tendencias de ventas, ticket promedio y rendimiento por categorías.
- **Integración con Google Sheets:** Utiliza la API de Google Sheets v4 como un backend NoSQL robusto, accesible y cost-efectivo.
- **Estandarización de Zona Horaria:** Sincronización automática de todos los registros con la hora local de Tijuana (`America/Tijuana`).
- **Control de Gastos y Caja:** Módulo para registro de gastos operativos y seguimiento de fondo de caja diario.

## 🛠 Tech Stack

- **Frontend:** React 18, Tailwind CSS, Lucide-React, Framer Motion (Animaciones).
- **Backend:** Node.js, Express.
- **Base de Datos:** Google Sheets API v4.
- **Seguridad:** Autenticación Google OAuth 2.0.

## 📋 Arquitectura del Sistema

The application follows a **Serverless-inspired architecture**:
1. **Client Layer:** React SPA providing a responsive and intuitive user experience.
2. **API Layer:** Node.js/Express server handling authentication, data normalization, and secure communication with Google APIs.
3. **Persistence Layer:** Google Sheets serves as the primary data store, ensuring high availability and zero-cost maintenance.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Google Cloud Project with Sheets API enabled
- OAuth 2.0 Credentials

### Environment Setup
1. Clone the repository.
2. Create a `.env` file based on `.env.example`.
3. Configure your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### Installation
```bash
npm install
npm run dev
```

## 📈 Impact

This project was developed as part of a Digital Transformation thesis, aiming to bridge the gap between traditional commerce and modern data analytics. It reduces manual error rates, optimizes stock rotation, and provides immediate financial clarity for small business owners.

---
*Developed with focus on efficiency, scalability, and user-centric design.*

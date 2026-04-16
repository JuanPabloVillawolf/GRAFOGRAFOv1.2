# Coffee & Books POS - Digital Transformation Suite

Professional Point of Sale (POS) and Inventory Management System designed for the digital transformation of small businesses, specifically tailored for a Bookstore-Cafeteria hybrid model.

## 🚀 Overview

This application serves as a comprehensive management tool that transitions manual business processes into a streamlined digital workflow. By leveraging **Cloud Computing** and **Real-time Data Visualization**, it empowers business owners to make data-driven decisions without the overhead of expensive database infrastructure.

## ✨ Key Features

- **Omnichannel POS Interface:** Optimized for fast-paced cafeteria service and detailed bookstore inventory management.
- **Dynamic Inventory Control:** Real-time tracking of stock levels with automated alerts for critical items.
- **Pending Accounts Management:** Secure tracking of customer credit and partial payments ("Cuentas Abiertas") with persistent cloud storage.
- **Strategic Dashboard:** Interactive data visualization of sales trends, ticket averages, and category performance.
- **Google Sheets Integration:** Uses Google Sheets as a robust, accessible, and cost-effective NoSQL backend.
- **Secure Authentication:** Enterprise-grade security via Google OAuth 2.0.

## 🛠 Tech Stack

- **Frontend:** React 18, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Express.
- **Database:** Google Sheets API v4.
- **Security:** OAuth 2.0.

## 📋 System Architecture

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

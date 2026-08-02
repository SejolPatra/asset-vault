# 🏦 Asset Vault

A modern, responsive full-stack web application for managing and tracking personal assets in real time.

🚀 **Live App:** [https://asset-vault-sepia.vercel.app](https://asset-vault-sepia.vercel.app)  
⚙️ **Backend API:** [https://asset-vault-bkox.onrender.com](https://asset-vault-bkox.onrender.com)

---

## ✨ Features

- **User Authentication:** Secure register/login flow using JWT (JSON Web Tokens) & password hashing.
- **Protected Routes:** Frontend route guards preventing unauthorized navigation to dashboard routes.
- **Asset Management (CRUD):** Full capability to create, read, update, and delete financial asset records.
- **Database Persistence:** Managed through Prisma ORM connected to a cloud PostgreSQL instance (Neon).
- **Production Ready:** Separated frontend & backend architecture deployed on Vercel and Render.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** React + Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with request interceptors for auth)
- **Styling:** CSS / Tailwind CSS

### **Backend**
- **Runtime:** Node.js & Express.js
- **Database:** PostgreSQL (Neon Cloud DB)
- **ORM:** Prisma ORM
- **Authentication:** JSON Web Token (JWT)

---

## ⚙️ Local Setup Guide

### 1. Clone the repository
```bash
git clone https://github.com/SejolPatra/asset-vault.git
cd asset-vault
```
### 2. Backend setup
```bash
cd backend
npm install
# Add your .env file with DATABASE_URL and JWT_SECRET
npm run dev
```
### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

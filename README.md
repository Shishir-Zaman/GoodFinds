<h1 align="center">✨ GoodFinds BD – Online Marketplace Platform ✨</h1>

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://goodfinds-frontend.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend_API-Render-46E3B7?style=for-the-badge&logo=render)](https://goodfinds.onrender.com)
[![Database](https://img.shields.io/badge/Database-Aiven_MySQL-FF5000?style=for-the-badge&logo=mysql)](https://aiven.io)

**A trusted second-hand marketplace connecting buyers with verified vintage, antique, and used items.**

</div>

---

## 🚀 Key Features

### 🛒 For Buyers
*   **Smart Search & Filters**: Filter by category, price, "Vintage" status, and seller.
*   **Vintage Logic**:
    *   🏷️ **Fresh**: < 1 year old
    *   🏺 **Vintage**: > 5 years old
    *   📜 **Antique**: > 20 years old
*   **Secure Checkout**: Real-time cart calculation and order placement.
*   **Verification Badges**: "Verified Seller" and "Authentic Product" tags.

### 🏪 For Sellers
*   **Seller Dashboard**: Track sales, revenue, and active listings visually.
*   **Product Management**: Easy listing creation with image support.
*   **Order Fulfillment**: Manage order status (Pending → Shipped → Delivered).

---

## ☁️ Cloud Architecture

This project is fully deployed to the cloud, moving away from local XAMPP/Localhost.

```mermaid
graph TD
    User[User / Browser] -->|HTTPS| Frontend[Frontend (Vercel)]
    Frontend -->|REST API| Backend[Backend (Render)]
    Backend -->|SSL Connection| DB[(MySQL Database (Aiven))]
```

*   **Frontend**: React + Vite (Hosted on Vercel)
*   **Backend**: Node.js + Express (Hosted on Render)
*   **Database**: Managed MySQL (Hosted on Aiven Cloud)

---

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Axios, Framer Motion
*   **Backend**: Node.js, Express.js, MySQL2
*   **Database**: MySQL (Aiven Cloud)
*   **DevOps**: Vercel, Render, Git

---

## ⚙️ Setup & Installation (Local Development)

Follow these steps to run the project locally while connecting to the Cloud Database.

### 1. Clone the Repo
```bash
git clone https://github.com/Shishir-Zaman/GoodFinds.git
cd GoodFinds
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure Environment:**
Create a `.env` file in the `backend` folder:
```env
# Use your Aiven Connection URI here
DATABASE_URL="mysql://avnadmin:password@host:port/defaultdb?ssl-mode=REQUIRED"
DB_SSL="true"
PORT=5000
```

**Populate Database (Seed Data):**
```bash
# This fills the cloud database with demo data
npm run seed
```

**Start Server:**
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

**Update API URL (Optional for Local Dev):**
If you want to use your local backend instead of the live production one:
1.  Go to `src/App.jsx` and `pages/Dashboard.jsx` (etc).
2.  Change `https://goodfinds.onrender.com` back to `http://localhost:5000`.

**Start React App:**
```bash
npm run dev
```

---

## 👥 Team Members

| Name | Student ID | Role |
|------|-------------|------|
| **Asifuzzaman Shishir** | 222014090 | **Team Lead** / Full Stack / System Architecture |
| **Shovon Dip Karmaker** | 213014056 | Frontend / UI Implementation |
| **Rafsan Jani Siam** | 222014061 | Backend / API Integration |
| **Md. Al Amin** | 223014162 | UX Research / Documentation |

---

<p align="center">
  <i>Created for ULAB Design Project II</i>
</p>

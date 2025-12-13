# GoodFinds Marketplace

GoodFinds is a trusted second-hand marketplace platform designed for buying and selling verified vintage, antique, and used items in Bangladesh. It connects buyers with trusted sellers (including major brands and individual collectors) and ensures authenticity through a verification system.

## 🚀 Features

### 🛒 For Buyers
*   **Browse & Search**: Advanced filtering by category, price, condition, and seller.
*   **Smart Search**: Find products by name, description, or seller name.
*   **Product Details**:
    *   View detailed product history (Purchase Date vs. Listing Date).
    *   **Vintage Logic**: Items older than 5 years are automatically labeled "Vintage", and 20+ years as "Antique".
    *   Seller verification badges.
*   **Shopping Cart**: Modern cart management with real-time total calculation.
*   **Secure Checkout**: Integrated order placement system.

### 🏪 For Sellers
*   **Dashboard**:
    *   **Overview**: View total sales, active listings, and pending orders.
    *   **Product Management**: Add, edit, and delete products with ease.
    *   **Order Management**: Update order status (Pending -> Shipped -> Delivered) and manage customer orders.
*   **Profile**: Manage seller profile and verification status.

### 🛡️ Trust & Safety
*   **Seller Verification**: Admin-verified sellers receive a "Verified" badge.
*   **Product Authenticity**: "Verified Authentic" badges for checked items.
*   **Condition Transparency**: Clear distinction between "Fresh", "Good", "Vintage", and "Antique" conditions.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, React Router, Axios, React Icons.
*   **Backend**: Node.js, Express.js.
*   **Database**: MySQL (via XAMPP).
*   **Authentication**: Custom JWT-based authentication (simulated for this project).

## ⚙️ Setup & Installation

### Prerequisites
*   **Node.js** (v14 or higher)
*   **XAMPP** (for MySQL Database)
*   **Git**

### 1. Database Setup
1.  Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
2.  Open your browser and go to `http://localhost/phpmyadmin`.
3.  Create a new database named `goodfinds`.
4.  Import the `database/goodfinds_complete.sql` file (or run the schema scripts) to set up tables and seed data.

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will start on `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will run on `http://localhost:5173`.

## 📝 License
This project is created for ULAB Design Project II.

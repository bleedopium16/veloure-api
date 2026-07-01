# Veloure API

Backend for **Veloure**, a full-stack beauty e-commerce store.  
Built with Node.js, Express, and MongoDB.

The React frontend lives in a separate repository: [veloure](https://github.com/bleedopium16/veloure)

---

## Features

- **Products** — browse by category (makeup, skincare, haircare), featured bestsellers, and name search
- **Authentication** — register & login with hashed passwords (bcrypt) and JWT tokens
- **Cart** — per-user cart with add, remove, and quantity updates, persisted in the database
- **Orders** — place orders from the cart and view order history
- **Wishlist** — save favorite products per user

---

## Tech Stack

- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — database and schema modeling
- **JWT** — stateless authentication
- **bcrypt** — password hashing

---

## API Endpoints

### Products
- `GET /api/products` — all products (optional `?category=` or `?search=`)
- `GET /api/products/bestsellers` — featured products
- `GET /api/products/:id` — single product

### Auth
- `POST /api/auth/register` — create an account
- `POST /api/auth/login` — log in
- `GET /api/auth/me` — current user (protected)

### Cart (protected)
- `GET /api/cart` — view cart
- `POST /api/cart` — add item / increase quantity
- `PATCH /api/cart/decrease` — decrease quantity
- `DELETE /api/cart/:productId` — remove item

### Orders (protected)
- `POST /api/orders` — place an order from the cart
- `GET /api/orders` — order history

### Wishlist (protected)
- `GET /api/wishlist` — view wishlist
- `POST /api/wishlist` — toggle a product

---

## Local Setup

### 1. Database
Create a free MongoDB Atlas cluster and copy your connection string.

### 2. Environment
Copy the example env file and fill in your values:
```bash
cp .env.example .env
```
Set `MONGO_URI`, `JWT_SECRET`, `PORT`, and `CLIENT_URL` in `.env`.

### 3. Run
```bash
npm install
npm run seed     # populate the database with the product catalog
npm run dev      # start the server on http://localhost:5000
```

---

## Environment Variables

| Variable      | Description                          |
|---------------|--------------------------------------|
| `MONGO_URI`   | MongoDB Atlas connection string      |
| `JWT_SECRET`  | Secret used to sign JWT tokens       |
| `PORT`        | Server port (default 5000)           |
| `CLIENT_URL`  | Frontend URL, for CORS               |

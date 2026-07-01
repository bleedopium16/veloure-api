# Veloure API

Backend for the Veloure beauty store — Node + Express + MongoDB.

This is **Step 1**: the server skeleton, data models, the products endpoint, and
seed data. Auth and orders come next.

## What's here

```
src/
  models/      Product.js, User.js, Order.js   (Mongoose schemas)
  routes/      products.js                       (GET products)
  config/      seed.js                           (sample catalog)
  server.js    app entry point
.env.example   copy to .env and fill in
```

## One-time setup

### 1. Get a free MongoDB database
1. Go to https://www.mongodb.com/atlas and create a free account.
2. Create a free **M0** cluster.
3. Database Access → add a database user (note the username + password).
4. Network Access → Add IP → "Allow access from anywhere" (0.0.0.0/0) for now.
5. Cluster → Connect → Drivers → copy the connection string.

### 2. Configure the project
```bash
cp .env.example .env
```
Open `.env` and paste your Mongo connection string into `MONGO_URI`
(replace `<username>` and `<password>` with your real values), and set
`JWT_SECRET` to any long random string.

### 3. Install + seed + run
```bash
npm install
npm run seed     # fills the database with sample products
npm run dev      # starts the server on http://localhost:5000
```

## Try it

Open these in your browser (or Postman):

- http://localhost:5000/                          → health check
- http://localhost:5000/api/products              → all products
- http://localhost:5000/api/products?category=makeup
- http://localhost:5000/api/products?category=skincare
- http://localhost:5000/api/products?category=haircare

If you see JSON come back, the backend is working. 🎉

## Next steps (not built yet)
- Auth routes (register / login with JWT)
- Cart routes (add / remove / view, per logged-in user)
- Order routes (place order, order history)
- Wire the React frontend to these endpoints

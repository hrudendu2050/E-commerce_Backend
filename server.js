const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- CONFIGURATION ---
const PORT = 3000;
// const MONGO_URI = "mongodb://127.0.0.1:27017/ShoppyGlobe_Backend";
const MONGO_URI = "mongodb+srv://hrudendu2050:Wrm638Hj4v68sNGW@cluster1.dzxwbsf.mongodb.net/";
// ---------------------

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Middleware
app.use(express.json()); // To parse JSON request bodies
app.use(cors()); //Enables CORS middleware

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Something broke!", error: err.message });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`Welcome to the homepage: http://localhost:${PORT}!`);
});
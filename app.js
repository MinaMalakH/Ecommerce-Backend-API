const connectDB = require("./src/config/DB");
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // ✅ Add this

const app = express();

// ✅ CORS Configuration - Add this BEFORE other middlewares
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Your frontend URL
  credentials: true, // Allow cookies to be sent
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Add these middlewares
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

const authRouter = require("./src/routes/auth.routes");
const categoryRouter = require("./src/routes/category.routes");
const productRouter = require("./src/routes/product.routes");
const orderRouter = require("./src/routes/order.routes");
const reviewRouter = require("./src/routes/review.routes");
const adminRouter = require("./src/routes/admin.routes");
// Health check route (before other routes for quick response)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      error: err.stack,
      details: err,
    }),
  });
});

// Start server after DB connection
const PORT = process.env.PORT || 9000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
startServer(); // Don't forget this!

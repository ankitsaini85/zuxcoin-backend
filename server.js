const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const withdrawalRoutes = require("./routes/WithdrawalRoutes");
const adminRoutes = require("./routes/adminRoutes");
const transferRoutes = require("./routes/transferRoutes");
const publicRoutes = require("./routes/publicRoutes");
const { loadCoinPrice } = require("./config/coinConfig");

const app = express();

// CORS Configuration - Allow frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,  // Production frontend URL from .env
  process.env.frontend_url_https,  // Production frontend URL with HTTPS from .env
  process.env.frontend_url_www,  // Production frontend URL with www from .env
  process.env.frontend_url_www_https,  // Production frontend URL with www and HTTPS from .env
  process.env.frontend_url_local,  // Local frontend URL from .env
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await loadCoinPrice();
  })
  .catch(err => console.log(err));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/withdrawal", withdrawalRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/public", publicRoutes);
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

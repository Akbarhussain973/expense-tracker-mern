// server/server.js
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const protect = require("./middleware/protect");
const categoryRoutes = require("./routes/categories");
const transactionRoutes = require("./routes/transactions");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/transactions", transactionRoutes);

app.get("/", protect, (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

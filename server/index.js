const express = require("express");
const cors = require("cors");
const dbConnect = require("./dbConnect/dbConnect");
const router = require("./routes/routes");
const { stripeWebhook } = require("./controller/Payment.controller");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);
app.post(
  "/api/stripeUpdate",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

dbConnect();

app.use("/api", router);
app.get("/api/health", async (req, res) => await res.send("Healthy"));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err?.message || "Server error" });
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

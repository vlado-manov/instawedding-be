const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static images

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/images", require("./routes/imageRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

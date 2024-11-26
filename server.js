const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { initializeRoles } = require("./models/predefinedRoles");
const { hashPassword } = require("./getpassword");
const path = require("path");

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "https://stkgaurd.netlify.app",
      "http://localhost:3000",
    ];
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
};

// Use the CORS middleware with the custom options
app.use(cors(corsOptions));

// Set a higher limit for JSON payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize predefined roles
initializeRoles();
hashPassword();

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

module.exports = app;

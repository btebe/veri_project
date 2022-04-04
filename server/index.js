require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/User");
const authRoutes = require("./routes/Auth");
const passResetRoutes = require("./routes/PasswordReset");

//db connection
const db = require("./models");

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passResetRoutes);

db.sequelize.sync().then(() => {
  app.listen( process.env.PORT||3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
  });
});

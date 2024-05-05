import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import User from "./models/user.model.js";
dotenv.config();

mongoose
  .connect(process.env.mongo)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3001, () => console.log("Server started on port 3001"));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.get("/verify/:id", async (req, res) => {
  const token = req.params.id;
  const user = await User.findOne({ uniqueString: token });

  if (user) {
    user.emailVerified = true;
    user.uniqueString = "";

    await user.save();
    res.redirect(process.env.CLIENT_URL + "?token=" + token);
  } else {
    return res.redirect(
      process.env.CLIENT_URL + "?token=invalid_code_detected"
    );
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode: statusCode,
  });
});

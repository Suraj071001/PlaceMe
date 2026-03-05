import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/handler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "We are here for your dreams" });
});

app.use("/api/auth", authRoutes);


export default app;

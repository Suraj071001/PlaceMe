import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/handler";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "hello world!" });
});
export default app;

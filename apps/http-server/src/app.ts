import express from "express";
import cors from "cors";
import { initRoutes } from "./route";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "We are here for your dreams" });
});

app.use((req, res, next) => {
  // Exclude auth routes from token verification
  if (req.path.startsWith("/api/v1/auth") || req.path === "/health") {
    return next();
  }
  return authMiddleware(req, res, next);
});

initRoutes(app);

export default app;

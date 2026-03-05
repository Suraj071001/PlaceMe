import express from "express";
import cors from "cors";
import { initRoutes } from "./route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "We are here for your dreams" });
});

initRoutes(app);


export default app;

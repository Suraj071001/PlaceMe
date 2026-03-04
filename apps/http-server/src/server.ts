import dotenv from "dotenv";
dotenv.config();
import app from "./app";
// import client from "@repo/db"




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

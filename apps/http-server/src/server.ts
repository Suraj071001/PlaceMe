import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import logger from "./utils/logger";
import { LOG } from "./constants";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(LOG.SERVER_START, { port: PORT });
});

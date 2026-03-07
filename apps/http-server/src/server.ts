import app from "./app";
import logger from "./utils/logger";
import { LOG } from "./constants";

const PORT = process.env.PORT || 5501;

app.listen(PORT, () => {
  logger.info(LOG.SERVER_START, { port: PORT });
});

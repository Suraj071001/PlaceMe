import { config } from "dotenv";
import { resolve } from "node:path";

import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Always load env from packages/db/.env regardless of current working directory.
const envDir = new URL(".", import.meta.url).pathname;
config({ path: resolve(envDir, ".env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not provided");
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

const client = new PrismaClient({ adapter });
export * from "./generated/prisma/client";
export default client;

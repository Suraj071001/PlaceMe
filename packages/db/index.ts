import "dotenv/config.js"


import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not provided");
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });

const client = new PrismaClient({ adapter });
export * from "./generated/prisma/client";
export default client;

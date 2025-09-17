import { defineConfig } from "drizzle-kit";

const url = `postgresql://admin:abcdefgh@localhost:5432/twitchbot`;

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  dbCredentials: { url }
});

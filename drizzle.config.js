import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: "./utils/schema.js",   // JS file
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_XCtY7du2wbWB@ep-weathered-block-a4c4h6la-pooler.us-east-1.aws.neon.tech/ai%20interview?sslmode=require&channel_binding=require',
  },
});
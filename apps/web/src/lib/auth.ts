import { getSqlClient } from "@gschedule/db";
import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    db: getSqlClient(),
    type: "postgres",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
  ],
});

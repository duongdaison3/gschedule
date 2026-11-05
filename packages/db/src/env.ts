import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL phải là một URL PostgreSQL hợp lệ"),
  DATABASE_TEST_URL: z.string().url("DATABASE_TEST_URL phải là một URL PostgreSQL hợp lệ").optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
});

export type Env = z.infer<typeof envSchema>;

export function getValidatedEnv(customEnv?: Record<string, string | undefined>): Env {
  const source = customEnv ?? process.env;
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => ` - [${issue.path.join(".")}]: ${issue.message}`)
      .join("\n");
    throw new Error(`[EnvValidationError] Cấu hình môi trường không hợp lệ:\n${errorDetails}`);
  }
  return parsed.data;
}


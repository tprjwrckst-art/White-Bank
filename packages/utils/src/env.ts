export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  DATABASE_URL: process.env.DATABASE_URL ?? '',
  POSTGRES_USER: process.env.POSTGRES_USER ?? 'whitebank',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD ?? 'whitebankpass',
  POSTGRES_DB: process.env.POSTGRES_DB ?? 'whitebank_dev',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET ?? '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? '',
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
} as const;

export type Env = typeof env;

export function requireEnv(key: keyof Env): string {
  const val = (env as any)[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return String(val);
}

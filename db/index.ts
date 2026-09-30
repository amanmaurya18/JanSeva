import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb() {
  const d1 = (globalThis as any).DB || (process.env as any).DB;
  if (!d1) {
    return null;
  }
  return drizzle(d1, { schema });
}



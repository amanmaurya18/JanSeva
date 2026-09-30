import fs from 'node:fs';
import path from 'node:path';

interface ReportRow {
  id: string;
  area: string;
  description: string;
  category: string;
  severity: number;
  status: string;
  created: string;
  language: string;
  source: string;
}

interface DecisionRow {
  id: string;
  area: string;
  status: string;
  note: string;
  created: string;
}

const globalStore = globalThis as unknown as {
  __jan_seva_reports?: ReportRow[];
  __jan_seva_decisions?: DecisionRow[];
};

if (!globalStore.__jan_seva_reports) {
  globalStore.__jan_seva_reports = [];
}
if (!globalStore.__jan_seva_decisions) {
  globalStore.__jan_seva_decisions = [];
}

let localDb: any = null;
let sqliteAvailable: boolean | null = null;

function getLocalDatabase() {
  if (sqliteAvailable === false) return null;
  if (!localDb) {
    try {
      const { DatabaseSync } = require('node:sqlite');
      const dataDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const dbPath = path.join(dataDir, 'local.sqlite');
      localDb = new DatabaseSync(dbPath);
      localDb.exec(`
        CREATE TABLE IF NOT EXISTS decisions (
          id text PRIMARY KEY NOT NULL,
          area text NOT NULL,
          status text NOT NULL,
          note text NOT NULL,
          created text NOT NULL
        );
        CREATE TABLE IF NOT EXISTS reports (
          id text PRIMARY KEY NOT NULL,
          area text NOT NULL,
          description text NOT NULL,
          category text NOT NULL,
          severity integer NOT NULL,
          status text DEFAULT 'Received' NOT NULL,
          created text NOT NULL,
          language text NOT NULL,
          source text NOT NULL
        );
      `);
      sqliteAvailable = true;
    } catch {
      sqliteAvailable = false;
      return null;
    }
  }
  return localDb;
}

export function db() {
  // 1. Cloudflare D1 binding if running inside Cloudflare Workers
  const cloudflareDb = (globalThis as any).DB || (process.env as any).DB;
  if (cloudflareDb && typeof cloudflareDb.prepare === 'function') {
    return cloudflareDb;
  }

  // 2. Local SQLite database if available
  const local = getLocalDatabase();
  if (local) {
    return {
      prepare(sql: string) {
        let boundParams: any[] = [];
        return {
          bind(...params: any[]) {
            boundParams = params;
            return this;
          },
          async run() {
            const stmt = local.prepare(sql);
            return stmt.run(...boundParams);
          },
          async all() {
            const stmt = local.prepare(sql);
            const results = stmt.all(...boundParams);
            return { results };
          },
        };
      },
    };
  }

  // 3. In-memory store fallback (e.g. Vercel serverless / read-only filesystem)
  return {
    prepare(sql: string) {
      const cleanSql = sql.trim().toUpperCase();
      let boundValues: any[] = [];
      const statement = {
        bind(...values: any[]) {
          boundValues = values;
          return statement;
        },
        async all() {
          if (cleanSql.includes('FROM REPORTS')) {
            const list = [...(globalStore.__jan_seva_reports || [])].sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            return { results: list };
          }
          if (cleanSql.includes('FROM DECISIONS')) {
            const list = [...(globalStore.__jan_seva_decisions || [])].sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            return { results: list };
          }
          return { results: [] };
        },
        async run() {
          if (cleanSql.startsWith('INSERT INTO REPORTS')) {
            const [id, area, description, category, severity, status, created, language, source] = boundValues;
            globalStore.__jan_seva_reports?.unshift({
              id,
              area,
              description,
              category,
              severity: Number(severity),
              status,
              created,
              language,
              source,
            });
            return { success: true };
          }
          if (cleanSql.startsWith('INSERT INTO DECISIONS')) {
            const [id, area, status, note, created] = boundValues;
            globalStore.__jan_seva_decisions?.unshift({
              id,
              area,
              status,
              note,
              created,
            });
            return { success: true };
          }
          return { success: true };
        },
      };
      return statement;
    },
  };
}

export function failure(e: unknown) {
  console.error(e);
  return Response.json(
    { error: 'Could not save or load data. Please retry; your input has been kept.' },
    { status: 503 }
  );
}

export function sameOrigin(r: Request) {
  const origin = r.headers.get('origin');
  return !origin || origin === new URL(r.url).origin;
}

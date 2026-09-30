// Storage adapter for Neer reports and decisions.
// Compatible with both Vercel serverless environments and local development.

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
  __neer_reports?: ReportRow[];
  __neer_decisions?: DecisionRow[];
};

if (!globalStore.__neer_reports) {
  globalStore.__neer_reports = [];
}
if (!globalStore.__neer_decisions) {
  globalStore.__neer_decisions = [];
}

export function db() {
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
            const list = [...(globalStore.__neer_reports || [])].sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            return { results: list };
          }
          if (cleanSql.includes('FROM DECISIONS')) {
            const list = [...(globalStore.__neer_decisions || [])].sort(
              (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
            );
            return { results: list };
          }
          return { results: [] };
        },
        async run() {
          if (cleanSql.startsWith('INSERT INTO REPORTS')) {
            const [id, area, description, category, severity, status, created, language, source] = boundValues;
            globalStore.__neer_reports?.unshift({
              id,
              area,
              description,
              category,
              severity: Number(severity),
              status,
              created,
              language,
              source
            });
            return { success: true };
          }
          if (cleanSql.startsWith('INSERT INTO DECISIONS')) {
            const [id, area, status, note, created] = boundValues;
            globalStore.__neer_decisions?.unshift({
              id,
              area,
              status,
              note,
              created
            });
            return { success: true };
          }
          return { success: true };
        }
      };
      return statement;
    }
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

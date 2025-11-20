const postgres = require("postgres");
require("dotenv").config();

// Lightweight database wrapper for a shared connection and small helpers
class Database {
  constructor() {
    const { PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD, NODE_ENV } =
      process.env;

    if (!PGHOST || !PGPORT || !PGDATABASE || !PGUSER || !PGPASSWORD) {
      throw new Error("Database environment variables are not fully set");
    }

    // Use SSL in production; keep local dev simple
    const ssl = NODE_ENV === "production" ? "require" : false;

    this.sql = postgres({
      host: PGHOST,
      port: Number(PGPORT),
      database: PGDATABASE,
      username: PGUSER,
      password: PGPASSWORD,
      ssl,
    });
  }

  // Quick health check
  async ping() {
    const result = await this.sql`SELECT 1 as ok`;
    return result?.[0]?.ok === 1;
  }

  // String-based query helper using positional placeholders ($1, $2, ...)
  async query(sqlText, params = []) {
    if (typeof sqlText !== "string") {
      throw new Error("Query must be a string.");
    }
    if (!Array.isArray(params)) {
      throw new Error("Query params must be an array.");
    }

    // Convert positional placeholders into a tagged template call
    const strings = [];
    const values = [];
    let lastIndex = 0;

    for (const match of sqlText.matchAll(/\$(\d+)/g)) {
      const [placeholder, numStr] = match;
      const idx = Number(numStr) - 1;
      if (!Number.isInteger(idx) || idx < 0 || idx >= params.length) {
        throw new Error(`Missing parameter for placeholder ${placeholder}`);
      }
      const start = match.index;
      strings.push(sqlText.slice(lastIndex, start));
      values.push(params[idx]);
      lastIndex = start + placeholder.length;
    }

    strings.push(sqlText.slice(lastIndex));
    strings.raw = strings;

    return this.sql(strings, ...values);
  }

  // Graceful shutdown
  async close() {
    await this.sql.end({ timeout: 5 });
  }
}

module.exports = new Database();

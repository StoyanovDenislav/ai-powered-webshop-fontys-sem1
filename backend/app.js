const express = require("express");

const app = express();
const PORT = process.env.PORT || 6001;

const database = require("./database");

app.use(express.json());

// Generic SQL execution endpoint
app.post("/query", async (req, res, next) => {
  try {
    const { sql, params = [] } = req.body || {};

    if (typeof sql !== "string" || sql.trim() === "") {
      return res.status(400).json({ error: "sql must be a non-empty string" });
    }
    if (!Array.isArray(params)) {
      return res.status(400).json({ error: "params must be an array" });
    }

    const rows = await database.query(sql, params);
    return res.json({ rows });
  } catch (err) {
    return next(err);
  }
});

/*
// Sample parameterized query
app.get("/db-sample/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    // Using positional params to bind safely
    const rows = await database.query("select $1::int as id", [id]);
    return res.json({ id: rows?.[0]?.id ?? null });
  } catch (err) {
    return next(err);
  }
}); */

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  database.ping().then((isConnected) => {
    if (isConnected) {
      console.log("✅ Database connection successful");
    } else {
      console.log("❌ Database connection failed");
    }
  });
  console.log(`Bookstore API listening on http://localhost:${PORT}`);
});

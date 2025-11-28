const express = require("express");

const app = express();
const PORT = process.env.PORT || 6001;

const database = require("./database");

app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Get all available genres
app.get("/genres", async (req, res, next) => {
  try {
    const rows = await database.query(
      "SELECT DISTINCT UNNEST(genres) as genre FROM books WHERE stock_qty > 0 ORDER BY genre",
      []
    );
    const genres = rows.map(row => row.genre);
    return res.json({ genres });
  } catch (err) {
    return next(err);
  }
});

// Get all books endpoint
app.get("/books", async (req, res, next) => {
  try {
    const rows = await database.query(
      "SELECT id, title, author, description, price, genres, stock_qty FROM books WHERE stock_qty > 0 ORDER BY created_at DESC",
      []
    );
    return res.json({ books: rows });
  } catch (err) {
    return next(err);
  }
});

// Filter books by genre
app.get("/books/filter", async (req, res, next) => {
  try {
    const genre = req.query.genre;
    
    if (!genre || typeof genre !== "string") {
      return res.status(400).json({ error: "genre query parameter is required" });
    }

    const rows = await database.query(
      "SELECT id, title, author, description, price, genres, stock_qty FROM books WHERE stock_qty > 0 AND $1 = ANY(genres) ORDER BY created_at DESC",
      [genre]
    );
    return res.json({ books: rows });
  } catch (err) {
    return next(err);
  }
});

// Get single book by ID
app.get("/books/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "id must be a number" });
    }

    const rows = await database.query(
      "SELECT id, title, author, description, price, genres, stock_qty FROM books WHERE id = $1 AND stock_qty > 0",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.json({ book: rows[0] });
  } catch (err) {
    return next(err);
  }
});

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

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 6001;

const database = require("./database");
const {
  router: authRouter,
  authenticateToken,
} = require("./LoginRegister/auth");

app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Auth routes
app.use("/auth", authRouter);

// Get all available genres
app.get("/genres", async (req, res, next) => {
  try {
    const rows = await database.query(
      "SELECT DISTINCT UNNEST(genres) as genre FROM books WHERE stock_qty > 0 ORDER BY genre",
      []
    );
    const genres = rows.map((row) => row.genre);
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
      return res
        .status(400)
        .json({ error: "genre query parameter is required" });
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

// Search books by title, author, or description
app.get("/books/search", async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "q query parameter is required" });
    }

    const searchPattern = `%${query}%`;
    const rows = await database.query(
      "SELECT id, title, author, description, price, genres, stock_qty FROM books WHERE stock_qty > 0 AND (LOWER(title) LIKE LOWER($1) OR LOWER(author) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1)) ORDER BY created_at DESC",
      [searchPattern]
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

// ===== CART ENDPOINTS =====

// Get cart items for authenticated user
app.get("/cart", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const rows = await database.query(
      `SELECT ci.id, ci.book_id, ci.quantity, ci.created_at,
              b.title, b.author, b.price, b.stock_qty
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    return res.json({ cart: rows });
  } catch (err) {
    return next(err);
  }
});

// Add item to cart
app.post("/cart", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { bookId, quantity = 1 } = req.body;

    if (!bookId) {
      return res.status(400).json({ error: "bookId is required" });
    }

    const bookIdNum = Number(bookId);
    const quantityNum = Number(quantity);

    if (Number.isNaN(bookIdNum) || Number.isNaN(quantityNum)) {
      return res.status(400).json({ error: "Invalid input values" });
    }

    if (quantityNum <= 0) {
      return res.status(400).json({ error: "Quantity must be positive" });
    }

    // Check if book exists and has sufficient stock
    const bookRows = await database.query(
      "SELECT stock_qty FROM books WHERE id = $1",
      [bookIdNum]
    );

    if (bookRows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    if (bookRows[0].stock_qty < quantityNum) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    // Check if item already in cart
    const existingRows = await database.query(
      "SELECT id, quantity FROM cart_items WHERE user_id = $1 AND book_id = $2",
      [userId, bookIdNum]
    );

    if (existingRows.length > 0) {
      // Update quantity
      const newQuantity = existingRows[0].quantity + quantityNum;

      if (newQuantity > bookRows[0].stock_qty) {
        return res
          .status(400)
          .json({ error: "Insufficient stock for total quantity" });
      }

      await database.query(
        "UPDATE cart_items SET quantity = $1 WHERE id = $2",
        [newQuantity, existingRows[0].id]
      );

      return res.json({
        message: "Cart updated",
        cartItemId: existingRows[0].id,
      });
    } else {
      // Insert new item
      const result = await database.query(
        "INSERT INTO cart_items (user_id, book_id, quantity) VALUES ($1, $2, $3) RETURNING id",
        [userId, bookIdNum, quantityNum]
      );

      return res
        .status(201)
        .json({ message: "Item added to cart", cartItemId: result[0].id });
    }
  } catch (err) {
    return next(err);
  }
});

// Update cart item quantity
app.put("/cart/:cartItemId", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cartItemId = Number(req.params.cartItemId);
    const { quantity } = req.body;

    if (Number.isNaN(cartItemId) || !quantity) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const quantityNum = Number(quantity);
    if (Number.isNaN(quantityNum) || quantityNum <= 0) {
      return res.status(400).json({ error: "Quantity must be positive" });
    }

    // Check stock availability and ownership
    const cartRows = await database.query(
      `SELECT ci.book_id, ci.user_id, b.stock_qty 
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.id = $1`,
      [cartItemId]
    );

    if (cartRows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartRows[0].user_id !== userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (cartRows[0].stock_qty < quantityNum) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    await database.query("UPDATE cart_items SET quantity = $1 WHERE id = $2", [
      quantityNum,
      cartItemId,
    ]);

    return res.json({ message: "Cart item updated" });
  } catch (err) {
    return next(err);
  }
});

// Remove item from cart
app.delete("/cart/:cartItemId", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const cartItemId = Number(req.params.cartItemId);
    if (Number.isNaN(cartItemId)) {
      return res.status(400).json({ error: "Invalid cart item ID" });
    }

    await database.query(
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2",
      [cartItemId, userId]
    );
    return res.json({ message: "Item removed from cart" });
  } catch (err) {
    return next(err);
  }
});

// Clear entire cart for authenticated user
app.delete("/cart/clear", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    await database.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    return res.json({ message: "Cart cleared" });
  } catch (err) {
    return next(err);
  }
});

// ===== ORDER ENDPOINTS =====

// Create order from cart
app.post("/orders", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // Get cart items
    const cartItems = await database.query(
      `SELECT ci.id, ci.book_id, ci.quantity, b.price, b.stock_qty, b.title
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Check stock availability for all items
    for (const item of cartItems) {
      if (item.stock_qty < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.title}. Available: ${item.stock_qty}, Requested: ${item.quantity}`,
        });
      }
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);
    const total = subtotal; // Can add tax/shipping here later

    // Create order
    const orderResult = await database.query(
      `INSERT INTO orders (user_id, status, subtotal, total) 
       VALUES ($1, 'Pending', $2, $3) 
       RETURNING id`,
      [userId, subtotal, total]
    );

    const orderId = orderResult[0].id;

    // Create order items and update stock
    for (const item of cartItems) {
      // Insert order item
      await database.query(
        `INSERT INTO order_items (order_id, book_id, unit_price, quantity)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.book_id, item.price, item.quantity]
      );

      // Update book stock
      await database.query(
        `UPDATE books SET stock_qty = stock_qty - $1 WHERE id = $2`,
        [item.quantity, item.book_id]
      );
    }

    // Clear cart
    await database.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    return res.status(201).json({
      message: "Order created successfully",
      orderId,
      total,
    });
  } catch (err) {
    return next(err);
  }
});

// Get user orders
app.get("/orders", authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const orders = await database.query(
      `SELECT id, status, subtotal, total, placed_at
       FROM orders
       WHERE user_id = $1
       ORDER BY placed_at DESC`,
      [userId]
    );

    return res.json({ orders });
  } catch (err) {
    return next(err);
  }
});

// Get order details
app.get("/orders/:orderId", async (req, res, next) => {
  try {
    const orderId = Number(req.params.orderId);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const orderRows = await database.query(
      `SELECT id, user_id, status, subtotal, total, placed_at
       FROM orders
       WHERE id = $1`,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    // Get order items
    const items = await database.query(
      `SELECT oi.id, oi.book_id, oi.unit_price, oi.quantity,
              b.title, b.author
       FROM order_items oi
       JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    order.items = items;

    return res.json({ order });
  } catch (err) {
    return next(err);
  }
});

// Process payment (simulated)
app.post("/payments", async (req, res, next) => {
  try {
    const { orderId, provider = "simulated" } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const orderIdNum = Number(orderId);
    if (Number.isNaN(orderIdNum)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    // Get order
    const orderRows = await database.query(
      "SELECT id, total, status FROM orders WHERE id = $1",
      [orderIdNum]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRows[0];

    if (order.status === "Paid") {
      return res.status(400).json({ error: "Order already paid" });
    }

    // Simulate payment processing (always succeeds)
    const paymentStatus = "Captured";

    // Create payment record
    const paymentResult = await database.query(
      `INSERT INTO payments (order_id, provider, amount, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [orderIdNum, provider, order.total, paymentStatus]
    );

    // Update order status
    await database.query("UPDATE orders SET status = 'Paid' WHERE id = $1", [
      orderIdNum,
    ]);

    return res.json({
      message: "Payment processed successfully",
      paymentId: paymentResult[0].id,
      status: paymentStatus,
    });
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

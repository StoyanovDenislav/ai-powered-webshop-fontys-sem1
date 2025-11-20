const readline = require("node:readline/promises");
const { stdin: input, stdout: output } = require("node:process");
const db = require("../database");

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

async function askPositiveInt(rl, prompt) {
  while (true) {
    const raw = (await rl.question(prompt)).trim();
    const num = Number.parseInt(raw, 10);
    if (Number.isInteger(num) && num > 0) return num;
    console.log("Please enter a positive integer.");
  }
}

async function askNonEmpty(rl, prompt) {
  while (true) {
    const raw = (await rl.question(prompt)).trim();
    if (raw.length > 0) return raw;
    console.log("Please enter a value.");
  }
}

async function askMoney(rl, prompt) {
  while (true) {
    const raw = (await rl.question(prompt)).trim();
    const num = toNumber(raw);
    if (!Number.isNaN(num) && num >= 0) return Number(num.toFixed(2));
    console.log("Please enter a non-negative number (e.g., 12.99).");
  }
}

async function askOptional(rl, prompt, defaultValue = "") {
  const raw = (await rl.question(prompt)).trim();
  return raw === "" ? defaultValue : raw;
}

async function askGenres(rl) {
  const raw = (
    await rl.question("Genres (comma-separated, optional): ")
  ).trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}

async function askBook(rl, index) {
  console.log(`\nBook ${index}`);
  const title = await askNonEmpty(rl, "Title: ");
  const author = await askNonEmpty(rl, "Author: ");
  const description = await askOptional(rl, "Description (optional): ", "");
  const price = await askMoney(rl, "Price (e.g., 19.99): ");
  const genres = await askGenres(rl);

  let stockQty = 0;
  while (true) {
    const raw = (await rl.question("Stock quantity (default 0): ")).trim();
    if (raw === "") {
      stockQty = 0;
      break;
    }
    const num = toNumber(raw);
    if (Number.isInteger(num) && num >= 0) {
      stockQty = num;
      break;
    }
    console.log("Please enter a whole number 0 or greater.");
  }

  return { title, author, description, price, genres, stock_qty: stockQty };
}

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    const count = await askPositiveInt(
      rl,
      "How many books do you want to add? "
    );
    for (let i = 1; i <= count; i += 1) {
      const book = await askBook(rl, i);
      const sql = `
        insert into books (title, author, description, price, genres, stock_qty)
        values ($1, $2, $3, $4, $5, $6)
        returning id`;
      const params = [
        book.title,
        book.author,
        book.description,
        book.price,
        book.genres,
        book.stock_qty,
      ];
      const rows = await db.query(sql, params);
      console.log(
        `Inserted book ${i}/${count} with id ${rows?.[0]?.id ?? "?"}`
      );
    }
  } catch (err) {
    console.error("Failed to insert books:", err);
    process.exitCode = 1;
  } finally {
    rl.close();
    await db.close();
  }
}

main();

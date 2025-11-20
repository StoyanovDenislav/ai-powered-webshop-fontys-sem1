const db = require("../database");

async function main() {
  try {
    console.log("Truncating table books...");
    await db.query("TRUNCATE TABLE books RESTART IDENTITY CASCADE;");
    console.log("Done. All book rows removed, table retained.");
  } catch (err) {
    console.error("Failed to truncate books table:", err);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
}

if (require.main === module) {
  main();
}

const db = require("./models");

async function check() {
  const cats = await db.Category.findAll();
  console.log(cats.map(c => `'${c.name}'`));
  process.exit();
}
check();

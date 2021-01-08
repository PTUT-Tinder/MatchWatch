const { db } = require("../src/db");

console.log("--- Removing all data, please be patient, the script will exit on its own when finished. ---")
db.sync({ force: true });

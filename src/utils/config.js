const TOML = require("@iarna/toml");
const fs = require("fs");

module.exports = TOML.parse(fs.readFileSync("./config.toml"));

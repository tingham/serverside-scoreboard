const Parser = require("dsn-parser")
const dsn = new Parser(process.env.SCOREBOARD_DSN)

module.exports = {
  "username": dsn.parts.user,
  "password": dsn.parts.password,
  "database": dsn.parts.database,
  "host": dsn.parts.host,
  "dialect": dsn.parts.driver,
  "logging": false,
  "operatorsAliases": false
}

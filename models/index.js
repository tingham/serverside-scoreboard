'use strict'

const TAG = "ORM"
const fs        = require('fs')
const path      = require('path')
const Sequelize = require('sequelize')
const basename  = path.basename(module.filename)
const env       = process.env.NODE_ENV || 'development'
const dsn    = require(__dirname + '/../config/config.js')
const db        = {}

if (typeof dsn == "undefined") {
  console.error("Sequelize needs a DSN in ENV")
  process.exit(1);
}

const sequelize = new Sequelize(dsn)

function init (app) {
  return new Promise(function (resolve, reject) {
    fs.readdirSync(path.join(__dirname, "sql"))
      .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
      .forEach((file) => {
        var model = sequelize['import'](path.join(__dirname, "sql", file))
        db[model.name] = model
        log.a(TAG, `Registered SQL ${model.name}`)
      })

    Object.keys(db).forEach((modelName) => {
      if (db[modelName].associate) {
        db[modelName].associate(db)
      }
    })

    db.sequelize = sequelize
    db.Sequelize = Sequelize

    app.sql = db

    resolve(app)
  })
}

module.exports = init

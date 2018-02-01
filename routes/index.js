const express = require('express')
const router = express.Router()
const fs = require("fs")
const path = require("path")
const basename = path.basename(module.filename)
const TAG = "Base Routing"

function init (app) {
  return new Promise(function (resolve, reject) {
    try {
      fs.readdirSync(__dirname)
        .filter(function(file) {
          return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
        })
        .forEach(function(file) {
          const router = require(`${__dirname}/${file}`)
          const mainRoute = path.basename(file, ".js").toLowerCase()
          Object.keys(router).forEach((pathRoute) => {
            const fullPath = `/${mainRoute}${pathRoute}`
            Object.keys(router[pathRoute]).forEach((route) => {
              app.route(fullPath)[route](router[pathRoute][route])
            })
          })
          console.log(TAG, `Route ${mainRoute} Registered`)
        })
      resolve(app)
    } catch (e) {
      console.error(e)
      reject(e)
    }

    app.route("/")
      .get((req, res, next) => {
        log.d(TAG, "Index")
        res.render("index.ejs", {title: "Bob"})
      })
  })
}


module.exports = init

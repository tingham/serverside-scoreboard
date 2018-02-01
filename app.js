const TAG = "Main Application"
const fs = require("fs")
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const lessMiddleware = require('less-middleware')

const index = require('./routes/index')
const users = require('./routes/users')
const app = express()
const colors = require("colors")

const template_global = []

// Whatever you put in ./globals will be available anywhere including templates.
fs.readdirSync("./globals").filter((filename) => filename.indexOf(".js") > -1).forEach((filename) => {
  let module = require(`./globals/${filename}`)
  if (typeof module == "function") {
    module = module(app)
  }
  global[path.basename(filename, ".js")] = module
  template_global[path.basename(filename, ".js")] = module
  console.log(`Registering global ${path.basename(filename, ".js")}`.blue)
})

const Errors = {}
fs.readdirSync("./errors").filter((file) => (file.indexOf(".") != 0 && (file.slice(-3) == ".js")))
.forEach((file) => {
    console.log(`Registering error ${file}`.red)
    Errors[path.basename(file, ".js")] = require(`${__dirname}/errors/${file}`)
})
global["Errors"] = Errors

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

// JSON responses
app.use((req, res, next) => {
  log.d(TAG, `Register json response handler.`)
  res.data = (data) => {
    if (typeof data != typeof {} || !(data.hasOwnProperty("data"))) {
      // Wrap response in "data" => //
      return res.json({data: data})
    }
    res.json(data)
  }
  next()
})

// Error routing
app.use((req, res, next) => {
  log.d(TAG, `Register error response handler.`)
  res.handleError = (err) => {
    switch (err.constructor) {
      case Errors.NotFound:
        return res.status(404).render("404")
        break
      case Errors.Permissions:
        return res.status(403).render("403")
        break
      default:
        return res.status(500).render("500", {error: err})
        break
    }
  }
  next()
})

// Renderer Overload
app.use((req, res, next) => {
  log.d(TAG, `Register render overload.`, res.locals)
  const render = res.render
  res.render = (view, locals, callback) => {
    let _view
    let _locals = {}
    let _callback = callback

    Object.keys(res.locals).forEach((key) => {
      log.d(TAG, `Key ${key}`)
      _locals[key] = res.locals[key]
    })
    Object.keys(locals).forEach((key) => {
      _locals[key] = locals[key]
    })

    _locals.app = app
    _locals.req = req
    _locals.layout = locals.layout || "layout"

    Object.keys(template_global).forEach((key) => { _locals[key] = template_global[key] })
    render.call(res, view, _locals, (err, str) => {
      if (err) {
        log.d(TAG, `Error in template ${view}`)
        log.w(TAG, err)
      }
      _locals.body = str
      render.call(res, _locals.layout, _locals, callback)
    })
  }
  next()
})

// Model Inclusion
// NOTE: This is a promise, not an assignment. DB availability is assured.
require("./models/index.js")(app)

// Specific Routing
// NOTE: This is a promise, not an assignment.
require("./routes/index.js")(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

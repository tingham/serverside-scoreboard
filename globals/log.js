var colors = require("colors")
var path = require("path")
var _ = require("lodash")
var moment = require("moment")

var service = {
  app: null,
  init: function (app) {
    service.app = app
    return this
  },
  d: function () {
    var tag = ""
    var message = ""
    if (arguments.length > 1) {
      tag = arguments[0].yellow
      _.each(arguments,
        function (arg, index) {
          if (index > 0) {
            if (typeof(arg) == typeof({})) {
              arg = JSON.stringify(arg)
            }
            message = message + " " + arg
          }
      })
      message = message.bgBlack.green
    }
    else {
      message = arguments[0]
    }
    service.log(tag + "(" + service.location() + "): " + message) 
  },
  a: function () {
    // TODO: Database
    var tag = ""
    var message = ""
    if (arguments.length > 1) {
      tag = arguments[0].yellow
      _.each(arguments,
        function (arg, index) {
          if (index > 0) {
            if (typeof(arg) == typeof({})) {
              arg = JSON.stringify(arg)
            }
            message = message + " " + arg
          }
      })
      message = message.blue
      if (arguments[0] == "GET") {
        service.log(tag + message)
      }
      else {
        service.log(tag + "(" + service.location() + "): " + message) 
      }
    }
    else {
      message = arguments[0].blue
      service.log("(" + service.location() + "): " + message) 
    }
  },
  i: function () {
    // TODO: Database
    var tag = ""
    var message = ""
    if (arguments.length > 1) {
      tag = arguments[0].yellow
      _.each(arguments,
        function (arg, index) {
          if (index > 0) {
            if (typeof(arg) == typeof({})) {
              arg = JSON.stringify(arg)
            }
            message = message + " " + arg
          }
      })
      message = message.cyan
      if (arguments[0] == "GET") {
        service.log(tag + message)
      }
      else {
        service.log(tag + "(" + service.location() + "): " + message) 
      }
    }
    else {
      message = arguments[0].cyan
      service.log("(" + service.location() + "): " + message) 
    }
  },
  w: function () {
    var tag = ""
    var message = ""
    let stack = ""
    let code = ""

    if (arguments.length > 1) {
      tag = arguments[0].magenta
      _.each(arguments,
        function (arg, index) {
          if (index > 0) {
            console.log(arg instanceof Error)
            if (arg instanceof Error) {
              if (arg.hasOwnProperty("stack") && arg.hasOwnProperty("message")) {
                stack = stack + arg.stack + "\n"
                arg = arg.message
                line = arg.line
                code = code + " " + arg.code
              }
              else {
                arg = JSON.stringify(arg)
              }
            }
            message = message + " " + arg
          }
      })

      let body = message 
      service.log(tag + "(" + service.location() + "): " + message.red) 
      if (code) {
        console.log("\tERROR CODE: ".yellow + code.red)
        body = body + "\n" + "CODE: " + code
      }
      if (stack) {
        console.log("\tSTACKTRACE\n".yellow + stack.red)
        body = body + "\n" + "STACKTRACE\n" + stack
      }
      else {
        console.log("\tNO STACKTRACE")
        body = body + "\nNO STACKTRACE"
      }
    }
    else {
      message = arguments[0].red
      service.log("(" + service.location() + "): " + message) 
    }
  },
  log: function (message) {
    var date = new Date()
    var tt = moment(date).format("YYYY-M-D H:m:s:SSS")
    console.log(tt + " " + message)
  },
  mail: function (body) {
    let now = new moment(new Date())
    let delta = now.diff(last_error_send)
    console.log(delta, MIN_SEND_FREQUENCY)
    if (delta > MIN_SEND_FREQUENCY) {
      let graph = {
        email: MAIL_ERR_TO,
        subject: "RTPCAP Exception Handler",
        html: "<pre>" + body + "</pre>",
        text: body,
        type: "report"
      }
      mailer.send({}, graph)
      last_error_send = new moment(new Date())
    } else {
      service.d("MAIL", "Skipping send as the last was too recent.")
    }
  },
  location: function () {
    // NOTE: This is so ugly my grandmother feels bad.
    var err = new Error()
    var parts = err.stack.split("\n ")
    if (parts.length >= 3) {
      var res = parts[3].trim()
      var file = path.basename(res)
      var dir = path.basename(res.replace(file, "")).replace(")", "")
      // TODO replace with regex
      return (dir + "/" + file).replace(")", "")
    }
    return "nil"
  },

  // Returns a handler to tell us where an unlinked exception has occurred with a
  // slightly less than useful stack trace.
  registerUnhandledExceptionDispatch: function (TAG) {
    return function (a, b) {
      var err = new Error()
      if (!_.isEmpty(a)) {
        log.w(TAG, a)
      }
      if (!_.isEmpty(b)) {
        log.w(TAG, b)
      }
      var stack = err.stack.split("\n")
      _.each(
        stack,
        function (s, index) {
          log.w(TAG, index, s)
      })
    }
  }
}

module.exports = function (app) {
  return service.init(app)
}

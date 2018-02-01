const express = require('express')
const TAG = "Users Route"

const router = {
  "*": {
    get: (req, res, next) => {
      next()
    }
  }
}

module.exports = router


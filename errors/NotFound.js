const TAG = "Errors"

class NotFound extends Error {
  constructor(...params) {
    super(params)
    this.message = "The required resource could not be found."
  }
}

module.exports = NotFound

const TAG = "Errors"

class Permissions extends Error {
  constructor(...params) {
    super(params)
    this.message = "You do not have the required permissions."
  }
}

module.exports = Permissions

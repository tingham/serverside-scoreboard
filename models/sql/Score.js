const TAG = "Score Model"

const model = (sequelize, DataTypes) => {

  const Model = sequelize.define("Score", {
    URI: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Player: {
      type: DataTypes.STRING,
      allowNull: true
    },
    Value: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }
  })

  Model.associate = () => {
    // Model.hasMany(sequelize.models.User)
  }

  // Hooks like:
  Model.afterUpdate((score, options) => {})

  // Instance methods like:
  Model.prototype.icon = function () {
    // find file based on uri?
    return -1
  }

  return Model
}

module.exports = model

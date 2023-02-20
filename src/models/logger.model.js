module.exports = (sequelize, DataTypes) => {
  const Logger = sequelize.define( "logger", {
    message: {
      type: DataTypes.STRING
    },
  }, {timestamps: true}, )
  
  return Logger
}
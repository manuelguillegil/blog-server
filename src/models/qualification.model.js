module.exports = (sequelize, DataTypes) => {
  const Qualification = sequelize.define( "qualification", {
    qualification: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        max: 5,
        min: 0
      }
    },
  }, {timestamps: true}, )
  
  return Qualification
}
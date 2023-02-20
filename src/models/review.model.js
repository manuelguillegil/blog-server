module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define( "review", {
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
  }, {timestamps: true}, )
  
  return Review
}
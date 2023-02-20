module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define( "post", {
    title: {
      type: DataTypes.STRING
    },
    content: {
      type: DataTypes.STRING
    },
  }, {timestamps: true}, )
  
  return Post
}

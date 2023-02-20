const { Sequelize, DataTypes } = require("sequelize");

const hostName = process.env.HOST;
const userName = 'postgres';
const password = process.env.PASSWORD;
const database = process.env.DB;
const dialect = process.env.DIALECT;

const sequelize = new Sequelize(database, userName, password, {
  host: hostName,
  dialect: dialect,
  operatorsAliases: false,
  pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000
  }
});

sequelize.authenticate().then(() => {
  console.log(`Database connected to discover`)
}).catch((err) => {
  console.log(err)
})

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('../models/user.model')(sequelize, DataTypes)
db.posts = require("../models/post.model")(sequelize, DataTypes)
db.reviews = require("../models/review.model")(sequelize, DataTypes)
db.loggers = require("../models/logger.model")(sequelize, DataTypes)
db.qualifications = require("../models/qualification.model")(sequelize, DataTypes)

db.users.hasMany(db.posts)
db.users.hasMany(db.loggers)
db.posts.hasMany(db.loggers)
db.users.hasMany(db.reviews)
db.posts.hasMany(db.reviews)
db.posts.hasMany(db.qualifications)
db.users.hasMany(db.qualifications)

module.exports = db

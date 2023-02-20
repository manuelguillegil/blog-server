const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

require('dotenv').config()

const PostController = require('./controller/post.controller')
const UserController = require('./controller/user.controller')
const ReviewController = require('./controller/review.controller')

const userAuth = require('./middlewares/userAuth')
const authJwt = require('./middlewares/authJwt')

const api = require('./routes')

const app = express();

app.use(bodyParser.json());
app.use(cookieParser())

app.use('/api', api);


module.exports = app

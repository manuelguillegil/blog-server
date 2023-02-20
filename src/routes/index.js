const express = require('express');
const user = require('./user');
const post = require('./post');
const review = require('./review');
const postLogger = require('./postLogger');

const router = express.Router();

router.use('/user', user);
router.use('/post', post);
router.use('/review', review);
router.use('/post-logger', postLogger);

module.exports = router
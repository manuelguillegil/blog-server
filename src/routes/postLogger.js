const express = require('express');
const PostLoggerController = require('../controller/logger.controller')
const authJwt = require('../middlewares/authJwt')
const router = express.Router();

router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  PostLoggerController.getAllPostLoggers(req, res);
});

router.get('/user/:userId', (req, res) => {
  PostLoggerController.retrievePostLoggerByUserId(req, res);
});

router.get('/post/:postId', [authJwt.verifyToken, authJwt.isContributor] ,(req, res) => {
  PostLoggerController.retrievePostLoggerByPostId(req, res);
});

router.get('/user/:userId/post/:postId', [authJwt.verifyToken, authJwt.isContributor] ,(req, res) => {
  PostLoggerController.retrievePostLoggerByPostId(req, res);
});

module.exports = router
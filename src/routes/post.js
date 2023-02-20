const express = require('express');
const PostController = require('../controller/post.controller')
const authJwt = require('../middlewares/authJwt')
const router = express.Router();

router.get('/all', (req, res) => {
  PostController.getAllPosts(req, res);
});

router.get('/:id', (req, res) => {
  PostController.retrievePost(req, res);
});

router.post('/', [authJwt.verifyToken, authJwt.isEditor] ,(req, res) => {
  PostController.createPost(req, res);
});

router.put('/:id', [authJwt.verifyToken, authJwt.isContributor],(req, res) => {
  PostController.updatePost(req, res);
});

router.delete('/:id', [authJwt.verifyToken, authJwt.isEditor],(req, res) => {
  PostController.deletePost(req, res);
});

router.put('/:id/up-vote', [authJwt.verifyToken, authJwt.isContributor], (req, res) => {
  PostController.upVotePost(req, res);
});

router.get('/:id/up-vote', (req, res) => {
  PostController.getPostQualification(req, res).then(data => (data && res.status(200).send(data)));
});


module.exports = router

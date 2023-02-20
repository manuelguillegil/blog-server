const express = require('express');
const ReviewController = require('../controller/review.controller')
const authJwt = require('../middlewares/authJwt')
const router = express.Router();

router.get('/all', (req, res) => {
  ReviewController.getAllReviews(req, res);
});

router.get('/:id', (req, res) => {
  ReviewController.retrieveReview(req, res);
});

router.post('/:postId', [authJwt.verifyToken, authJwt.isContributor] ,(req, res) => {
  ReviewController.createReview(req, res);
});

module.exports = router

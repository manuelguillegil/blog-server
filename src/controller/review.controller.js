const logger = require('../logger/api.logger');
const db = require("../config/db.config");
const { errorMessage } = require("../utils/utils")

class ReviewController {
  reviewsDb;

  constructor() {
    this.reviewsDb = db.reviews;
  }

  getAllReviews(req, res) {
    logger.info('Controller: getAllReviews')
    this.reviewsDb.findAll({order: [
      ['createdAt', 'DESC'],
    ]})
    .then(reviews => {
      res.status(200).send(reviews);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

  retrieveReview(req, res) {
    logger.info('Controller: retrieveReview')
    this.reviewsDb.findByPk(req.params.id)
    .then(review =>  res.status(200).send(review))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  retrieveReviewById(reviewId) {
    logger.info('Controller: retrieveReview')
    return this.reviewsDb.findByPk(reviewId);
  }

  createReview(req, res) {
    logger.info('Controller: createReview')
    req.body.createAt = new Date().toISOString();
    this.reviewsDb.create({...req.body, userId: req.userId, postId: req.params.postId}).then(review => res.status(200).send(review))
    .catch(err => {
      errorMessage(res, err)
    });
  }
}

module.exports = new ReviewController();
const logger = require('../logger/api.logger');
const db = require("../config/db.config");

class PostLoggerController {
  postLoggersDb;

  constructor() {
    this.postLoggersDb = db.loggers;
  }

  getAllPostLoggers(req, res) {
    logger.info('Controller: getAllPostLoggers')
    this.postLoggersDb.findAll({order: [
      ['createdAt', 'DESC'],
    ]})
    .then(loggers => {
      res.status(200).send(loggers);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

	retrievePostLoggerByUserId(req, res) {
    logger.info('Controller: retrievePostLoggerByUserId')
    this.postLoggersDb.findAll({
			where: {
				userId: req.params.userId
			}
		})
    .then(loggers => {
      res.status(200).send(loggers);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

	retrievePostLoggerByPostId(req, res) {
    logger.info('Controller: retrievePostLoggerByUserId')
    this.postLoggersDb.findAll({
			where: {
				postId: req.params.postId
			}
		})
    .then(loggers => {
      res.status(200).send(loggers);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

	retrievePostLoggerByUserIdAndPostId(req, res) {
    logger.info('Controller: retrievePostLoggerByUserId')
    this.postLoggersDb.findAll({
			where: {
				userId: req.params.userId,
				postId: req.params.postId
			}
		})
    .then(loggers => {
      res.status(200).send(loggers);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }
}

module.exports = new PostLoggerController();
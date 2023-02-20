const logger = require('../logger/api.logger');

const errorMessage = (res, err) => {
  logger.error('Error::' + err.message || 'Some error occurred while retrieving properties.');
  res.status(500).send({
    message:
      err.message || "Some error occurred while retrieving properties."
  })
}

module.exports = {
  errorMessage
}
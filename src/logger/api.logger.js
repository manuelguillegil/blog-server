const pine = require('pine');
const db = require("../config/db.config");

const logger = pine();

class APILogger {
  postsLoggerDb;

  constructor() {
    this.postsLoggerDb = db.loggers;
  }

  async info(message) {
    logger.info(message);
  }

  async info(message, data) {
    logger.info(`${message} ${undefined != data ? JSON.stringify(data) : ''}`);
  }

  async error(message) {
    logger.error(message);
  }

  async createPostLogger(data) {
    const { userId, postId } = data;

    try {
      const user = await db.users.findByPk(userId)
      data.message = `${user.username} ${data.message}`;
      this.postsLoggerDb.create({message: data.message, userId: userId, postId: postId}).then(data => { return data })
      .catch(err => {
        console.info(err)
      });
    } catch(err) {
      console.info(err)
    }
  }

}

module.exports = new APILogger();
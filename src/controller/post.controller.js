const logger = require('../logger/api.logger');
const db = require("../config/db.config");
const { errorMessage } = require("../utils/utils")

class PostController {
  postsDb;
  qualificationDb;

  constructor() {
    this.postsDb = db.posts;
    this.qualificationDb = db.qualifications;
  }

  getAllPosts(req, res) {
    logger.info('Controller: getAllPosts')
    this.postsDb.findAll({order: [
      ['createdAt', 'DESC'],
    ]})
    .then(posts => {
      res.status(200).send(posts);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

  retrievePost(req, res) {
    logger.info('Controller: retrievePost')
    this.postsDb.findByPk(req.params.id)
    .then(post =>  res.status(200).send(post))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  retrievePostById(postId) {
    logger.info('Controller: retrievePost')
    return this.postsDb.findByPk(postId);
  }

  createPost(req, res) {
    logger.info('Controller: createPost')
    req.body.createAt = new Date().toISOString();
    const userId = req.userId;

    this.postsDb.create({...req.body, userId}).then(post => {
      const { title } = post;
      const message = `creó el post ${title}`;
      logger.createPostLogger({message, userId, postId: post.id}).then(() => {
        res.status(200).send(post)
      })
    })
    .catch(err => {
      errorMessage(res, err)
    });
  }

  updatePost(req, res) {
    logger.info('Controller: updatePost');
    req.body.createAt = new Date().toISOString();
    this.postsDb.update({...req.body}, {
      where: {
          id: req.params.id
      }
    })
    .then(post => {
      const { title } = post;
      const message = `actualizó el post ${title}`;
      logger.createPostLogger({message, userId: req.userId, postId: post.id}).then(() => {
        res.status(200).send(post)
      })
    })
    .catch(err => {
      errorMessage(res, err)
    });
  }

  deletePost(req, res) {
    logger.info('Controller: deletePost')
    this.postsDb.destroy({
      where: {
          id: req.params.id
      }
    })
    .then(post => {
      const { title } = post;
      const message = `eliminó el post ${title ? title : `de id: #${req.params.id}`}`;
      logger.createPostLogger({message, userId: req.userId, postId: post.id}).then(() => {
        res.status(200).send()
      })
    })
    .catch(err => {
      errorMessage(res, err)
    });
  }

  upVotePost(req, res) {
    logger.info('Controller: upVotePostV2')

    this.qualificationDb.create({
      qualification: req.body.qualification,
      userId: req.userId,
      postId: req.params.id
    })
    .then(qualification => res.status(200).send(qualification))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  async getPostQualification(req, res) {
    logger.info('Controller: upVotePostV2')

    try {
      const qualifications = await this.qualificationDb.findAll({
        where: {
          postId: req.params.id
        }
      });

      if(qualifications) {
        let finalScore = 0;
        qualifications.forEach(qualification => {
          finalScore = finalScore + qualification.qualification;
        });
        finalScore = (finalScore / qualifications.length);
  
        return { qualification : finalScore}
      }
      res.status(409).send("Details are not correct");
    } catch (error) {
      console.info(error);
    }
  }
}

module.exports = new PostController();
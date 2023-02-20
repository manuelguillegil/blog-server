const logger = require('../logger/api.logger');
const bcrypt = require("bcrypt");
const db = require("../config/db.config");
const jwt = require("jsonwebtoken");
const { errorMessage } = require("../utils/utils")

class UserController {
  userDb;

  constructor() {
    this.userDb = db.users;
  }

  async signup(req, res) {
    logger.info('Controller: signup')
    try {
      const { username, email, password } = req.body;
      const data = {
        username,
        email,
        password: await bcrypt.hash(password, 10),
      };

      const user = await this.userDb.create(data).catch(err => {
        res.status(500).send({ message: err.message });
      });
   
      if (user) {
        let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });
   
        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log(token);

        return user;
      } else {
        res.status(409).send("Details are not correct");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async login(req, res) {
    logger.info('Controller: login')
    try {
      const { email, password } = req.body;
      const user = await this.userDb.findOne({
        where: {
          email: email
        }
      });
   
      if (user) {
        const isSame = await bcrypt.compare(password, user.password);
   
   
        if (isSame) {
          let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: 1 * 24 * 60 * 60 * 1000,
          });
   
          res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
          console.log(token);

          return user;
        } else {
          res.status(401).send("Authentication failed");
        }
      } else {
        res.status(401).send("Authentication failed");
      }
    } catch (error) {
      console.log(error);
    }
  }

  getAllUsers(req, res) {
    logger.info('Controller: getAllUsers')
    this.userDb.findAll().then(users => {
      res.status(200).send(users);
    }).
    catch(err => {
      res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving properties."
        })
    });
  }

  retrieveUser(req, res) {
    logger.info('Controller: retrieveUser')
    this.userDb.findByPk(req.params.id)
    .then(user =>  res.status(200).send(user))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  retrieveUserById(userId) {
    logger.info('Controller: retrieveUserById')
    this.userDb.findByPk(userId)
    .then(user =>  res.status(200).send(user))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  createUser(req, res) {
    logger.info('Controller: createUser')
    req.body.createAt = new Date().toISOString();
    this.userDb.create(req.body).then(user => res.status(200).send(user))
    .catch(err => {
      errorMessage(res, err)
    });
  }

  updateUser(req, res) {
    logger.info('Controller: updateUser');
    req.body.createAt = new Date().toISOString();
    this.userDb.update(req.body, {
      where: {
          id: req.params.id
      }
    })
    .then(user => {res.status(200).send(user)})
    .catch(err => {
      errorMessage(res, err)
    });
  }

  deleteUser(req, res) {
    logger.info('Controller: deleteUser')
    this.userDb.destroy({
      where: {
          id: req.params.id
      }
    })
    .then(() => res.status(200).send())
    .catch(err => {
      errorMessage(res, err)
    });
  }

  setRoleUser(req, res) {
    logger.info('Controller: updateUser');
    if(!req.body.role) {
      res.status(401).send("No role provided!");
    }
    this.userDb.update({role: req.body.role}, {
      where: {
          id: req.params.id
      }
    })
    .then(user => res.status(200).send(user))
    .catch(err => {
      errorMessage(res, err)
    });
  }
}

module.exports = new UserController();
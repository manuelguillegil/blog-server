const express = require('express');
const UserController = require('../controller/user.controller')
const userAuth = require('../middlewares/userAuth')
const authJwt = require('../middlewares/authJwt')
const router = express.Router();

router.post('/signup', userAuth.saveUser, (req, res) => {
  UserController.signup(req, res).then(data => (data && res.status(200).send(data)));
});

router.post('/login', (req, res) => {
  UserController.login(req, res).then(data => (data && res.status(200).send(data)));
});

router.get('/all', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.getAllUsers(req, res);
});

router.post('/', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.signup(req, res).then(data => (data && res.status(200).send(data)));
});

router.put('/:id', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.updateUser(req, res);
});

router.delete('/:id', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.deleteUser(req, res);
});

router.put('/:id/set-role', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.setRoleUser(req, res);
});

router.get('/:id', [authJwt.verifyToken, authJwt.isAdmin], (req, res) => {
  UserController.retrieveUser(req, res);
});

module.exports = router

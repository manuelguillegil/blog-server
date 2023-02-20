const jwt = require("jsonwebtoken");
const db = require("../config/db.config");
const User = db.users;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if(user && user.role === 'admin') {
      next();
      return;
    }
  
    res.status(403).send({
      message: "Require Admin Role!"
    });
  })
  return;
};

isEditor = (req, res, next) => {
  console.info('req.userId', req.userId);
  User.findByPk(req.userId).then(user => {
    console.log('user', user);
  
    if(user && (user.role === 'editor' || user.role === 'admin')) {
      next();
      return;
    }
  
    res.status(403).send({
      message: "Require Edtior Role!"
    });
  })
  return;
};

isContributor = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    if(
      user && 
      (
        user.role === 'contributor' ||
        user.role === 'editor' || 
        user.role === 'admin'
      )
      ) {
      next();
      return;
    }
  
    res.status(403).send({
      message: "Require Contributor Role!"
    });
  })
  return
};

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isEditor: isEditor,
  isContributor: isContributor
};

module.exports = authJwt;

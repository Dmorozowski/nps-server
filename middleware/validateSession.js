let jwt = require("jsonwebtoken");
let User = require("../db").import("../models/users");

const validateSession = (req, res, next) => {
  if (req.method == "OPTIONS") {
    next();
  } else {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err && decoded) {
        User.findOne({
          where: { id: decoded.id }
        })
          .then(user => {
            if (!user) throw err;
            req.user = user;
            console.log("this is the user", user);
            return next();
          })
          .catch(err => next(err));
      } else {
        req.errors = err;
        return res.status(500).send("Not authorized.");
      }
    });
  }
};

module.exports = validateSession;

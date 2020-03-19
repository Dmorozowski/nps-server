let express = require("express");
let router = express.Router();
let sequelize = require("../db");
let User = sequelize.import("../models/users");
let bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");

// Signup for an account

router.post("/signup", (req, res) => {
  let password = req.body.password;

  User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: bcrypt.hashSync(password, 13)
  })
    .then(
      (createSuccess = user => {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        res.json({
          user: user,
          message: "User created",
          sessionToken: token
        });
      })
    )
    .catch(
      (createError = err => {
        res.send(500, "Improper signup", err.message);
        console.log(err);
      })
    );
});

// Login a current user

router.post("/signin", (req, res) => {
  User.findOne({ where: { email: req.body.email } }).then(
    function(user) {
      if (user) {
        bcrypt.compare(req.body.password, user.password, function(
          err,
          matches
        ) {
          if (matches) {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24
            });
            res.json({
              user: user,
              message: "User authenticated",
              sessionToken: token
            });
          } else {
            res.status(502).send({ Error: "Incorrect email and/or password " });
          }
        });
      } else {
        res.status(500).send({ Error: "Failed to authenticate" });
      }
    },
    function(err) {
      res.status(501).send({ Error: "Unable to authenticate user" });
    }
  );
});

module.exports = router;

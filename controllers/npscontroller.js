let router = require("express").Router();
let sequelize = require("../db");
let NPS = sequelize.import("../models/nps");

router.get("/mine", (req, res) => {
  NPS.findAll({
    where: {
      userId: req.user.id
    }
  })
    .then(nps => res.status(200).json(nps))
    .catch(err => res.status(500).json({ error: err }));
});

router.post("/create", (req, res) => {
  NPS.create({
    nationalPark: req.body.nationalPark,
    date: req.body.date,
    userId: req.user.id
  })
    .then(nps =>
      res.status(200).json({
        nps: nps,
        message: "NPS data created"
      })
    )
    .catch(err => res.json(err.message));
});

router.get("/:id", (req, res) => {
  NPS.findOne({
    where: { id: req.params.id, userId: req.user.id },
    include: "user"
  })
    .then(nps =>
      res.status(200).json({
        message: "Nps info found",
        nps: nps
      })
    )
    .catch(err => res.status(500).json({ error: err }));
});

router.put("/:id", (req, res) => {
  NPS.update(req.body, {
    where: { id: req.params.id, userId: req.user.id }
  })
    .then(
      (updateSuccess = nps => {
        res.json({
          nps: nps,
          message: "nps info updated"
        });
      })
    )
    .catch(err => res.sendStatus(500).json({ error: err }));
});

router.delete("/:id", (req, res) => {
  NPS.destroy({
    where: { id: req.params.id, userId: req.user.id }
  })
    .then(
      (deleteNPSSuccess = nps => {
        res.send("nps info has been removed");
      })
    )
    .catch(
      (deleteError = err => {
        res.send(500, err.message);
      })
    );
});

module.exports = router;

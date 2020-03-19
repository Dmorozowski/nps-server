require("dotenv").config();
let express = require("express");
let app = express();
let user = require("./controllers/usercontroller");
let nps = require("./controllers/npscontroller");
let sequelize = require("./db");
// let multer = require("./middleware/multer");

sequelize.sync();
// sequelize.sync({ force: true });
app.use(express.json());
app.use(require("./middleware/headers"));

app.use("/auth", user);

app.use(require("./middleware/validateSession"));
app.use("/nps", nps);

app.listen(3000, function() {
  console.log("App is listening on 3000");
});

app.use("/api/test", function(req, res) {
  res.send("This is data from the /api/test endpoint. It's fron the server.");
});

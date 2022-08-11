const router = require("express").Router();
const { User } = require("../../models");

//creating new user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.user,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { email: req.body.email },
    });

    if (!userData) {
      res
        .status(404)
        .json({ message: "Error, Incorrect username or password entered" });
      return;
    }
    const correctPw = await userData.checkPassword(req.body.password);
    if (!correctPw) {
      res
        .status(404)
        .json({ message: "Error, Incorrect username or password entered" });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ username: userData, message: "You're logged in!" });
    });
  } catch (err) {
    res.status(404).json(err);
  }
});

//logout
router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(200).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;

const express = require("express");

const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

//registration for user
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    return res.status(201).send({ user, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

//login for user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email.trim().toLowerCase(),
      req.body.password.trim(),
      req.body.isAdmin
    );
    const token = await user.generateAuthToken();
    return res.status(200).send({ user, token });
  } catch (e) {
    return res.status(400).send({ error: e.message });
  }
});



module.exports = router;

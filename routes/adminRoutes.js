const express = require("express");
const router = express.Router();
const Image = require("../models/Image");

const ADMIN_USERS = [
  { username: "tedi", password: "kriskoegei" },
  { username: "milen", password: "mendisushto" },
  { username: "titi", password: "begachka" },
  { username: "vlado", password: "ribamech" },
];

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const admin = ADMIN_USERS.find(
    (user) => user.username === username && user.password === password
  );
  res.json({ success: !!admin });
});

router.post("/hide/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);
  image.hidden = true;
  await image.save();
  res.json(image);
});

module.exports = router;

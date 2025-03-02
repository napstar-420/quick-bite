const express = require("express");

const router = express.Router();

router.post('/signin', (req, res) => {
  return res.json({ msg: 'signed in' })
})

module.exports = router;

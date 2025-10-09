const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get("/", (req, res) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(401).json({ message: "No token provided" })
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
      if (err) throw err
      res.json(userData)
    })
  }
  
})

module.exports = router;
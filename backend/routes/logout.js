
const express = require('express')
const router = express.Router()

router.post("/", (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        secure: true, 
    });
    res.sendStatus(200);
})

module.exports = router
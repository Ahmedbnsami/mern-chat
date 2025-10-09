const express = require('express')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/user")
const router = express.Router()

router.post("/", async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findOne({username})
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password)
        if (passOk) {
            jwt.sign({id: foundUser._id, username}, process.env.JWT_SECRET, {}, (err, token) => {
                res.cookie('token', token, { httpOnly: true, sameSite: "none", secure: true }).json({
                    id: foundUser._id,
                })
            })
        }
    }
})

module.exports = router
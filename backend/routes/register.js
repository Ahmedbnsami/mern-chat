const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const router = express.Router()
const User = require("../models/user")
const bcryptSalt = bcrypt.genSaltSync(10)

router.post("/", async (req, res) => {
    const { username, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, bcryptSalt)
    const createdUser = await User.create({ 
        username:username,
        password:hashedPassword
     })
    jwt.sign({id: createdUser._id, username}, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err
        res.cookie("token", token, { httpOnly: true, sameSite: "none", secure: true }).status(201).json({
            id: createdUser._id,
        })
    })
})

module.exports = router
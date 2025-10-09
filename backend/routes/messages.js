
const express = require('express')
const jwt = require('jsonwebtoken')
const util = require("util")
const router = express.Router()
const messageModel = require("../models/message")

const verifyAsync = util.promisify(jwt.verify)

router.get('/:userId', async (req, res) => {
    const { userId } = req.params
    const { token } = req.cookies


    const userData = await verifyAsync(token, process.env.JWT_SECRET)
    
    const messages = await messageModel.find({
        sender: {$in:[userId, userData.id]},
        recipent: {$in:[userId, userData.id]},
    }).sort({createdAt:1})

    res.json(messages)
})

module.exports = router
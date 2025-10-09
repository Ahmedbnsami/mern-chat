const express = require('express')
const { summarizeChat } = require('../ai_models/summarizeChat')

const router = express.Router()

router.post('/:userId', async (req, res) => {
  const { userId } = req.params
  const { startTime, endTime } = req.body

  if (!startTime || !endTime) {
    return res.status(400).json({ error: 'Start time and end time are required' })
  }

  try {
    const summary = await summarizeChat(userId, startTime, endTime)
    res.json(summary)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

module.exports = router

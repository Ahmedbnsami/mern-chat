const dotenv = require('dotenv')
const { GoogleGenerativeAI } = require('@google/generative-ai')
const messageModel = require('../models/message')

dotenv.config({ path: __dirname + './.env' })

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

async function summarizeChat(userId, startTime, endTime) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

    // Fetch messages from the database within the specified time range
    const messages = await messageModel.find({
      $or: [
        { sender: userId },
        { recipent: userId }
      ],
      createdAt: { $gte: new Date(startTime), $lte: new Date(endTime) }
    }).sort({ createdAt: 1 }).limit(100)

    // Handle empty chat
    if (messages.length === 0) {
      return {
        summary: "No messages found in this conversation",
        keyPoints: [],
        participants: [],
        topics: [],
        actionItems: [],
        sentiment: "neutral",
        messageCount: 0
      }
    }

    // Format messages with timestamps and better structure
    const chatHistory = messages.map(msg => {
      const timestamp = msg.createdAt ? new Date(msg.createdAt).toLocaleString() : 'Unknown time'
      const content = msg.text || (msg.file ? `[File attachment: ${msg.file}]` : '[Empty message]')
      return `[${timestamp}] Sender ${msg.sender}: ${content}`
    }).join('\n')

    const prompt = `You are an expert chat analyzer. Analyze the following conversation and provide a structured summary.

      CHAT HISTORY:
      ${chatHistory}

      INSTRUCTIONS:
      1. Provide a clear, concise summary (2-3 sentences)
      2. Extract 3-5 key points or topics discussed
      3. Identify unique participant IDs and their interaction pattern
      4. List main topics or themes discussed
      5. Note any important decisions, questions, or action items mentioned
      6. Assess overall sentiment of the conversation
      7. Respond ONLY with valid JSON - no markdown, no code blocks, no explanations, no additional text
      8. Use ONLY the language of the messages and details present in the chat - do NOT make assumptions or add information or just use English if the chat is in another language
      9. If the chat is empty or contains no meaningful content, indicate that in the summary
      10. If most of the chat is in Arabic, respond in Arabic; if in Spanish, respond in Spanish; otherwise, respond in English.

      REQUIRED JSON FORMAT:
      {
        "summary": "Brief overview of the entire conversation",
        "keyPoints": ["Point 1", "Point 2", "Point 3"],
        "participants": ["User ID 1", "User ID 2"],
        "topics": ["Topic 1", "Topic 2"],
        "actionItems": ["Action 1", "Action 2"],
        "sentiment": "positive/neutral/negative",
        "messageCount": ${messages.length}
      }`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Clean and parse the response
    try {
      // Remove markdown code blocks and extra whitespace
      text = text.replace(/```(?:json)?\n?/g, "").trim()
      
      // Try to extract JSON if wrapped in other text
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        text = jsonMatch[0]
      }
      
      const parsed = JSON.parse(text)
      
      // Validate response structure
      if (!parsed.summary || !Array.isArray(parsed.keyPoints)) {
        throw new Error('Invalid response structure')
      }
      
      // Add message count if not present
      if (!parsed.messageCount) {
        parsed.messageCount = messages.length
      }
      
      return parsed
      
    } catch (parseErr) {
      console.error('Failed to parse AI response:', parseErr)
      console.error('Raw response:', text)
      
      // Return a fallback response
      return {
        summary: "Summary generation failed. Please try again.",
        keyPoints: ["Unable to extract key points"],
        participants: [...new Set(messages.map(m => m.sender))],
        topics: [],
        actionItems: [],
        sentiment: "neutral",
        messageCount: messages.length,
        error: true,
        errorMessage: parseErr.message
      }
    }
    
  } catch (error) {
    console.error('Error in summarizeChat:', error)
    throw new Error(`Chat summarization failed: ${error.message}`)
  }
}

module.exports = { summarizeChat }
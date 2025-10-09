// Libraries
const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const ws = require("ws")
const jwt = require("jsonwebtoken")
const fs = require("fs")

const app = express()

const User = require("./models/user") 
const messageModel = require("./models/message")

// Middleware
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

require("dotenv").config()

// Database connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected successfully")
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
  })

// Routes
const registerRoute = require("./routes/register")
const loginRoute = require("./routes/login")
const profileRoute = require("./routes/profile")
const summarizeRoute = require("./routes/summarize")
const messagesRoute = require("./routes/messages")
const logoutRoute = require('./routes/logout')

app.use("/register", registerRoute)
app.use("/login", loginRoute)
app.use("/profile", profileRoute)
app.use("/summarize", summarizeRoute)
app.use("/messages", messagesRoute)
app.use("/logout", logoutRoute)

app.get("/", (req, res) => {
  res.json({ message: "Hello from server!" })
})

app.get("/people", async (req, res) => {
  const users = await User.find({}, {"_id": 1, username: 1})
  res.json(users)
})

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000")
})

const wss = new ws.WebSocketServer({server})

wss.on('connection', (connection, req) => {

  function notifyAboutOnlinePeople() {
    [...wss.clients].forEach(client => {
      client.send(JSON.stringify({
        online: [...wss.clients].map(c => ({userId: c.userId, userName: c.userName}))
      }))
    })
  }

  connection.isAlive = true 
  connection.timer = setInterval(() => {
    connection.ping()
    connection.deathTimer = setTimeout(() => {
      connection.isAlive = false
      clearInterval(connection.timer)
      connection.terminate()
      notifyAboutOnlinePeople()
    }, 1000)
  }, 5000)

  connection.on('pong', () => {
    clearTimeout(connection.deathTimer)
    connection.isAlive = true
  })

  const cookies = req.headers.cookie
  if (cookies) {
    const tokenCookieString = cookies.split(";").find(str => str.startsWith("token="))
    if (tokenCookieString) {
      const token = tokenCookieString.split("=")[1]
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) throw err

          const { id, username } = userData
          connection.userId = id
          connection.userName = username
        })
      }
    }
  }

  connection.on('message', async (message) => {
    const messageData = JSON.parse(message.toString());
    console.log("Received message data:", messageData);
    let filename = null
    const { recipent, text, file } = messageData;
    if (file) {
      const parts = file.name.split('.')
      const ext = parts[parts.length - 1]
      filename = Date.now() + '.' + ext
      const filePath = __dirname + '/uploads/' + filename
      const bufferData = new Buffer(file.data.split(',')[1], 'base64')
      fs.writeFile(filePath, bufferData, (err) => {
        if (err) {
          console.error("Error saving file:", err)
        } else {
          console.log("File saved successfully:", filePath)
        }
      })
    }

    if (recipent && (text || file)) {
        const messageDoc = await messageModel.create({
            sender: connection.userId,
            recipent,
            text,
            file: file ? filename : null,
        });        
        [...wss.clients]
          .filter(c => c.userId === recipent || c.userId === connection.userId)
          .forEach(c => c.send(JSON.stringify({
            text,
            sender: connection.userId,
            recipent,
            file: file ? filename : null,
            _id: messageDoc._id
          })));


    }
  });

  notifyAboutOnlinePeople()
})


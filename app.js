const dotenv = require('dotenv');
dotenv.config()

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("./database")
const port = process.env.PORT || 3003

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
const io = require("socket.io")(server, {
	pingTimeOut: 60000,
	cors: {
		origin: "*",
		methods: ["GET", "POST", "PUT"]
	},
})

app.use(cors({
    origin: '*'
}))

app.options('*', cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}));

// API Routes
const usersAPI = require("./routes/api/users")
const apisAPI = require("./routes/api/apis")
const tokensAPI = require("./routes/api/tokens")


app.use('/api/users', usersAPI)
app.use('/api/apis', apisAPI)
app.use('/api/tokens', tokensAPI)


app.get("/", (req, res) => {
	res.status(200).send("Hello World!")
})

io.on("connection", (socket) => {

    socket.on("join room", sessionId => socket.join(sessionId))
    
    socket.on("authorized token", (data) => {
        let token = data.token
        let sessionId = data.sessionId

        socket.in(sessionId).emit("trusted token", token)
    })    

})
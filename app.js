const dotenv = require('dotenv');
dotenv.config()

const express = require("express")
const app = express()
const mongoose = require("./database")
const port = process.env.PORT || 3003

const server = app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
	res.status(200).send("Hello World!")
})
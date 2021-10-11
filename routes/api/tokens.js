const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcrypt");
const router = express.Router();
const cryptoString = require('crypto-string')
const User = require("../../schemas/UserSchema");
const Token = require("../../schemas/TokenSchema");
const API = require("../../schemas/APISchema");
const Client = require("../../schemas/ClientSchema");

const FIRE_API_TOKEN_GENERATOR_URL = "https://firepwa.netlify.app"

app.use(express.json())
app.use(express.urlencoded({extended: true}));

let corsOptions = {
    origin: FIRE_API_TOKEN_GENERATOR_URL
}

router.post("/generate", cors(corsOptions), async (req, res) => {

    try {
        let sessionId = req.body.sessionId
        let userId = req.body.userId

        if(! sessionId || ! userId) return res.status(400).send({message: "Missing sessionId or userId"})

        let user = await User.findById(userId)

        if(user == null) return res.status(401).send({ message: "User does not exist" })

        let newToken = {
            sessionId: sessionId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePic: user.profilePic
        }

        let token = await Token.create(newToken)

        res.status(201).send({ tokenId: token._id })    
    } catch (error) {
        res.status(500).send({ message: "Something wrong with the server. Try again later" })
    }
        
    
})

router.post("/verify", async (req, res) => {
	try {
		let tokenId = req.body.token
		if (!tokenId) return res.status(400).send({ message: "Missing token" })

		let token = await Token.findByIdAndDelete(tokenId)

		if (token == null) return res.status(401).send({ message: "Token does not exist" })

        let data = {
            firstName: token.firstName,
            lastName: token.lastName,
            email: token.email,
            profilePic: token.profilePic
        }

		res.status(200).send(data)

	} catch (error) {
		res.status(500).send({
			message: "Something wrong with the server. Try again later",
		})
	}
})

module.exports = router;
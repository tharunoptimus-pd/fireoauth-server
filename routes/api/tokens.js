const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const cryptoString = require('crypto-string')
const User = require("../../schemas/UserSchema");
const Token = require("../../schemas/TokenSchema");
const API = require("../../schemas/APISchema");
const Client = require("../../schemas/ClientSchema");


app.use(express.json())
app.use(express.urlencoded({extended: true}));

router.post("/generate", async (req, res) => {

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
})

module.exports = router;
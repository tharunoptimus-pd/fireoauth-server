const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const cryptoString = require('crypto-string')
const User = require("../../schemas/UserSchema");
const Token = require("../../schemas/TokenSchema");
const API = require("../../schemas/APISchema");
const Client = require("../../schemas/ClientSchema");


app.use(express.urlencoded({extended: true}));
app.use(express.json())

router.get("/", (req, res) => {
    res.send("meow"
    )
})

router.post("/register", async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }
        const user = await Client.findOne({ email });
        if (user != null) {
            return res.status(409).send({
                message: "User already exists"
            });
        } else {
            password = await bcrypt.hash(password, 10)
            const newClient = {
                firstName,
                lastName,
                email,
                password
            }

            let newUser = await Client.create(newClient)
            newClient.success = true
            res.status(201).send(newClient)
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
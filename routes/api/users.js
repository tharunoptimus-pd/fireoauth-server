const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const cryptoString = require('crypto-string')
const User = require("../../schemas/UserSchema");
const Token = require("../../schemas/TokenSchema");
const API = require("../../schemas/APISchema");


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
        const user = await User.findOne({ email });
        if (user != null) {
            return res.status(409).send({
                message: "User already exists"
            });
        } else {
            password = await bcrypt.hash(password, 10)
            let newUserData = {
                firstName,
                lastName,
                email,
                password
            }

            let newUser = await User.create(newUserData)
            newUser.success = true
            res.status(201).send(newUser)
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (user == null) {
            return res.status(401).send({
                message: "User does not exist"
            });
        } else {
            let result = await bcrypt.compare(password, user.password)

            if(result) {
                user.success = true
                return res.status(200).send(user)
            }
            else {
                return res.status(401).send({
                    message: "Incorrect password"
                })
            }
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router;
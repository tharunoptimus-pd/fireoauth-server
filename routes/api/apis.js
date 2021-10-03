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

router.post("/register", async (req, res, next) => {
    try {
        let { firstName, lastName, email, password } = req.body;
        if(!firstName || !lastName || !email || !password) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }
        let user = await Client.findOne({ email });
        if (user != null) {
            return res.status(409).send({
                message: "User already exists"
            });
        } else {
            password = await bcrypt.hash(password, 10)
            let newClient = {
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
        console.log(err)
        res.send(err)
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
        const client = await Client.findOne({ email });
        if (client == null) {
            return res.status(401).send({
                message: "User does not exist"
            });
        } else {
            let result = await bcrypt.compare(password, client.password)

            if(result) {
                client.success = true
                return res.status(200).send(client)
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

router.post("/api/register", async (req, res, next) => {
    try {
        let { domainName, email,  password } = req.body;
        if( !domainName || !email || !password) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }

        let data = {
            domainName
        }

        let api = await API.create(data)
        return res.status(201).send(api)

    } catch (err) {
        res.status(500).send(err)
    }
})


module.exports = router;
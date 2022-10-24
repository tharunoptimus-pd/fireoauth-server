const express = require("express");
const cors = require("cors");
const app = express();
const bcrypt = require("bcrypt");
const router = express.Router();
const cryptoString = require('crypto-string')
const User = require("../../schemas/UserSchema");
const Token = require("../../schemas/TokenSchema");
const API = require("../../schemas/APISchema");
const Client = require("../../schemas/ClientSchema");

const FIRE_API_REGISTRATION_URL = "https://fire-register.netlify.app"


app.use(express.json())
app.use(express.urlencoded({extended: true}));

let corsOptions = {
    origin: FIRE_API_REGISTRATION_URL
}

router.get("/data/:id", cors(corsOptions), async (req, res) => {

    let id = req.params.id;

    if(!id) return res.status(400).send({message: "No ID Provided in the params"});

    try {
        let client = await Client.findById(id).populate("apis");

        if(client === null) return res.status(404).send({message: "Client not found"});

        let apiArray = client.apis
        return res.status(200).send(apiArray)

    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Error in getting the data"})
    }

})

router.post("/register", cors(corsOptions), async (req, res, next) => {
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
                password,
                profilePic: `https://avatars.dicebear.com/api/male/${firstName}${lastName}.svg?mood[]=happy`
            }

            let newUser = await Client.create(newClient)
            res.status(201).send(newUser)
        }
    } catch (err) {
        console.log(error)
        res.status(500).send({ message: "Something is wrong with Fire Servers. Try again Later" })
    }
})

router.post("/login", cors(corsOptions), async (req, res, next) => {
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
        console.log(error)
        res.status(500).send(err)
    }
})

router.post("/api/register", cors(corsOptions), async (req, res, next) => {
    try {
        let { domainName, email,  password } = req.body;
        if( !domainName || !email || !password) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }

        let client = await Client.findOne({ email });

        if (client == null) return res.status(401).send({ message: "User does not exist" });
        else {
            let result = await bcrypt.compare(password, client.password)

            if(result) {
                let data = {
                    domainName
                }
        
                let api = await API.create(data)
                res.status(201).send(api)

                await Client.findByIdAndUpdate(client._id, { $push: { apis: api._id } })

            }
            else {
                return res.status(401).send({ message: "Incorrect credentials" })
            }
        }

    } catch (err) {
        console.log(error)
        res.status(500).send(err)
    }
})

router.get("/generate/:api", async (req, res, next) => {
    try {
        let domainName = req.get("Referrer")
        domainName = domainName.substring(0, domainName.length - 1)
        let protocol = req.secure
        let api = req.params.api
        
        if(!domainName || !api) {
            return res.status(400).send({
                message: "All fields are required"
            })
        }

        
        let apiObject = await API.findByIdAndUpdate(api, { $inc: { transactionNumbers: 1 } })

        if(!apiObject) {
            return res.status(401).send({
                message: "Invalid API"
            })
        }

        // if(apiObject.domainName.substring(0, 5) === 'https' && req.protocol !== 'https') {
        //     return res.status(401).send({message: "Protocol must be https"})
        // }

        // Uncomment this line to Use HTTPS for all API's
        // if(!protocol) return res.status(400).send({message: "Protocol must be https"})

        if(apiObject.domainName != domainName) {
            return res.status(401).send({
                message: "Invalid domain name"
            })
        }

        let sessionId = cryptoString(12)
        let chatRoomId = cryptoString(12)

        let data = {
            sessionId,
            chatRoomId
        }

        res.status(201).send(data)

    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})


module.exports = router;
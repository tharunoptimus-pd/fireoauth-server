const express = require("express");
const app = express();
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

// router.get("/", async (req, res, next) => {
//     var searchObj = req.query;
//     if(req.query.search !== undefined) {
//         searchObj = {
//             $or: [
//                 { firstName: { $regex: searchObj.search, $options: "i" }},
//                 { lastName: { $regex: searchObj.search, $options: "i" }},
//                 { username: { $regex: searchObj.search, $options: "i" }},
//                 { email: { $regex: searchObj.search, $options: "i" }},
//             ]
//         }
//     }

//     User.find(searchObj)
//     .then( results => res.status(200).send(results))
//     .catch( error => {
//         console.log(error);
//         res.sendStatus(400);
//     })

// })

// router.put("/:userId/follow", async (req, res, next) => {

//     var userId = req.params.userId;

//     var user = await User.findById(userId);

//     if(user == null) return res.sendStatus(404);

//     var isFollowing = user.followers && user.followers.includes(req.session.user._id);
//     var option = isFollowing ? "$pull" : "$addToSet";

//     req.session.user = await User.findByIdAndUpdate(req.session.user._id, {[option]: { following: userId }}, { new : true })
//     .catch(error => {
//         console.log(error);
//         res.sendStatus(400);
//     })

//     await User.findByIdAndUpdate(userId, {[option]: { followers: req.session.user._id }})
//     .catch(error => {
//         console.log(error);
//         res.sendStatus(400);
//     })

//     if(!isFollowing) {
//         await Notification.insertNotification(userId, req.session.user._id, "follow", req.session.user._id);
//     }

//     res.status(200).send(req.session.user);
// })


module.exports = router;
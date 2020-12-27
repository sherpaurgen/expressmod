const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });
const authmiddleware = require('../middleware/auth')

//@route Get api/auth
// @desc get logged in user
//@access private

router.get('/', authmiddleware, async (req, res) => {
    try {
        // object _id vs string id https://mongoosejs.com/docs/guide.html#id
        const user = await User.findById(req.user.id).select({ name: 1, email: 1, date: 1 })
        res.json(user)
    } catch (err) {
        res.status(500).send('Server Error')
    }
})

//@route post api/auth
// @desc auth user and get token
//@access public

router.post('/', [body('email', 'Please include valid email').isEmail(), body('password', 'Password is required').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {

        let user = await User.findOne({ "email": email })
        if (!user) {
            return res.status(400).json({ "msg": "Invalid Credentials" })
        }
        // compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ "msg": "Invalid Credentials" })
        }
        const payload = {
            //user._id is set with code above-- let user = await User.findOne({"email":email})
            //user: { id: user._id }    _id is mongodb objectid and id is string provided by mongoose getter which uses _id 
            user: { id: user.id }
        };

        jwt.sign(payload, process.env.jwtsecret, { expiresIn: 36000 }, (err, token) => {
            if (err) {
                //throw statement throws a user-defined exception Execution of the current function will stop (the statements after throw won't be executed), and control will be passed to the first catch block in the call stack. If no catch block exists among caller functions, the program will terminate.
                throw err;
            }
            res.json({ token: token })
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

}
)
module.exports = router
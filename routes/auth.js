const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });

//@route Get api/auth
// @desc get logged in user
//@access private

router.get('/', (req, res) => {
    res.send('get logged in user')
})

//@route post api/auth
// @desc auth user and get token
//@access public

router.post('/', [body('email', 'Please include valid email').isEmail, body('password', 'Password is required').exists()], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        console.log(email)
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
            user: { id: user._id }
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
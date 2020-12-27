const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User')
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' });




//@route post api/users
//@desc Register user
//@access Public

router.post('/', [body('email', 'Please enter valid email').isEmail(), body('name', 'Name is required field').not().isEmpty(), body('password', 'Password should be 5+ character').isLength({ min: 5 })], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ "errors": errors.array() });
    }
    //now after validation
    const { name, email, password } = req.body;
    try {
        let user = await UserModel.findOne({ email: email });
        if (user) {
            return res.status(400).json({ "message": "User already exists" });
        }
        const userobj = new UserModel({ name: name, email: email, password: password })
        const salt = await bcrypt.genSalt(12);
        userobj.password = await bcrypt.hash(password, salt);
        await userobj.save();
        const payload = {
            user: { id: userobj.id }
        };

        jwt.sign(payload, process.env.jwtsecret, { expiresIn: 36000 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json({ token: token })
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
    }
}
)


module.exports = router;
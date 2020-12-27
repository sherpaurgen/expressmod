const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/auth')
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: '../.env' });
const UserContact = require('../models/Contact')

//get contact . private route
router.get('/', authmiddleware, async (req, res) => {
    try {
        // object _id vs string id https://mongoosejs.com/docs/guide.html#id
        const contacts = await UserContact.find({ user: req.user.id }).sort({ date: -1 })
        res.json(contacts)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error while fetching user contacts')
    }
})

//@route post api/contacts
//@description Register contact belonging to user
//@access private
//validation examples https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/

router.post('/', [authmiddleware, [body('name', 'Name is required').not().isEmpty(), body('email', 'Invalid email').isEmail(), body('phone').optional().isLength({ min: 10 }), body('type').optional().isIn(['personal', 'public'])]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, phone, type } = req.body;
    try {
        const usercontact = new UserContact({ name: name, email: email, phone: phone, type: type, user: req.user.id })
        //above req.user.id is set by auth.js routes
        const contact = await usercontact.save();
        res.json(contact)

    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error while saving user contact')
    }

})

//@route PUT api/contacts/:id
router.put('/:id', (req, res) => {
    res.send('edit update contact')
})

//@route delete api/contacts/:id
router.delete('/:id', (req, res) => {
    res.send('delete  contact')
})





module.exports = router;
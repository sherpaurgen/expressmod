const express = require('express');
const router = express.Router();
const authmiddleware = require('../middleware/auth')
const { body, validationResult } = require('express-validator');
require('dotenv').config({ path: '../.env' });
const UserContact = require('../models/Contact');



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



//@route put api/contacts/:id
router.put('/:id', authmiddleware, async (req, res) => {

    const { name, email, phone, type } = req.body;

    //build contact object
    const contactFields = {}
    if (name) contactFields.name = name
    if (email) contactFields.email = email
    if (phone) contactFields.phone = phone
    if (type) contactFields.type = type

    try {
        let contact = await UserContact.findById(req.params.id)
        if (!contact) return res.status(404).json({ "msg": "contact not found" })
        //authorized user can only update contacts
        //if authmiddleware is not imported /used the req.user.id wont be defined leading to error Cannot read property 'id' of undefined
        console.log(contact.user.toString())
        console.log(req.user.id)
        if (contact.user.toString() === req.user.id) {
            console.log("ok true")
        }
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).jsong({ "msg": "Not authorized" })
        }
        contact = await UserContact.findByIdAndUpdate(req.params.id, { $set: contactFields }, { new: true })
        res.json(contact)
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error while updating user contact')
    }
})

router.delete('/:id', authmiddleware, async (req, res) => {
    try {
        let contact = await UserContact.findById(req.params.id)
        if (!contact) return res.status(404).json({ "msg": "contact not found" })
        //authorized user can only update contacts
        //if authmiddleware is not imported /used the req.user.id wont be defined leading to error Cannot read property 'id' of undefined
        console.log(contact.user.toString())
        console.log(req.user.id)

        if (contact.user.toString() !== req.user.id) {
            return res.status(401).jsong({ "msg": "Not authorized" })
        }
        contact = await UserContact.findByIdAndRemove(req.params.id)
        res.json({ "msg": "contact removed" })
    } catch (err) {
        console.log(err)
        res.status(500).send('Server Error while updating user contact')
    }
})



module.exports = router;
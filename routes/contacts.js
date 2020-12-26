const express = require('express');
const router = express.Router();

//@route post api/users
// @desc Register user
//@access Public

router.post('/', (req, res) => {
    res.send('add a contact')
})

router.get('/', (req, res) => {
    res.send('get all contacts')
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
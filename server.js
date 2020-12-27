const express = require('express');
const app = express();
const connectDB = require('./config/db')
const authroute = require('./routes/auth')
const userroute = require('./routes/users')
require('dotenv').config();

connectDB();

//init middleware
app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.json({ "msg": "Hello world" }))
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server started at ${PORT}`))

//Define routes --app.use...
//app.use('/api/users', require('./routes/users'))
app.use('/api/auth', authroute)
app.use('/api/users', userroute)
app.use('/api/contacts', require('./routes/contacts'))


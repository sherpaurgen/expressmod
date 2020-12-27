const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../.env' });
module.exports = function (req, res, next) {
    //get token from header
    const token = req.header('x-auth-token');
    //check if not token
    if (!token) {
        return res.status(401).json({ 'msg': 'No token, authentication denied' })
    }
    //now verifying token
    try {
        const decoded = jwt.verify(token, process.env.jwtsecret);
        req.user = decoded.user
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token not valid' })
    }

}
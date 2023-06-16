const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = function(req, res, next) {
    let decoded = req.decoded;
    if (decoded) {
        if (decoded.role == 'admin') {
            next()
        } else {
            res.json({
                success: false,
                message: 'you are not admin'
            });
        }
    } else {
        res.json({
            success: false,
            message: 'not authenticated'
        });
    }
}
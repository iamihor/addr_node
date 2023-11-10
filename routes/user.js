var express = require('express')
require('dotenv').config();
var router = express.Router()

router.get('/', function (req, res, next) {
    var ip = req.ip.substring(req.ip.lastIndexOf(":")+1);
//    var ip=ip.split('.').join('');
    var role=process.env.admin;
    if (role.includes(ip)) {
        res.json({ message: ip , code: "200"});
    } else {
//        req.flash('error', err);
        res.send({ status: "error", code: "404" });
    }
    
})

module.exports = router;
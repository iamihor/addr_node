var express = require('express')
var connection = require('../utils/db.js')
var router = express.Router()

router.get('/', function (req, res, next) {
  connection.query("SELECT group_id as id, group_name as placename, created, modified " +
     " FROM group_list "+
     " WHERE isnull(deprecated) "+
     " ORDER BY group_name;", function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        res.json(rows);
      }
      //    console.log(rows);
    })
})

module.exports = router
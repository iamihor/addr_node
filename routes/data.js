var express = require('express')
var connection = require('../utils/db.js')
var router = express.Router()

router.get('/', function (req, res, next) {
  connection.query("SELECT addressbook.id, trim(concat(addressbook.lastname,' ',addressbook.firstname)) as name,addressbook.company,addressbook.title,addressbook.work,addressbook.mobile,addressbook.email,addressbook.created,addressbook.modified,group_list.group_name as placename, group_list.group_id as placeid "
    + "FROM addressbook "
    + "LEFT JOIN address_in_groups ON addressbook.id=address_in_groups.id "
    + "LEFT JOIN group_list ON address_in_groups.group_id=group_list.group_id "
    + "WHERE isnull(addressbook.deprecated) "
    + "ORDER BY name;", function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        res.json(rows);
      }
      //    console.log(rows);
    })
})

router.put('/', function (req, res, next) {
  console.log(req.params)
  connection.query("SELECT addressbook.id, trim(concat(addressbook.lastname,' ',addressbook.firstname)) as name,addressbook.company,addressbook.title,addressbook.work,addressbook.mobile,addressbook.email,addressbook.created,addressbook.modified,group_list.group_name as placename, group_list.group_id as placeid "
    + "FROM addressbook "
    + "LEFT JOIN address_in_groups ON addressbook.id=address_in_groups.id "
    + "LEFT JOIN group_list ON address_in_groups.group_id=group_list.group_id "
    + "WHERE isnull(addressbook.deprecated) "
    + "ORDER BY name;", function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        res.json(rows);
      }
      //    console.log(rows);
    })
})

router.post('/', function (req, res, next) {
  console.log(req.body);
  var id = req.body.txId;
  var name = req.body.txName;
  var dep = req.body.txDep;
  var pos = req.body.txPos;
  var email = req.body.txEmail;
  var work = req.body.txWork;
  var mobile = req.body.txMob;
  var place = req.body.selPlace;
  var iRows = 0;
  var sqli = "";
  var sqlu = "";
  if (id > 0) {
    sqlu = "UPDATE addressbook" +
      " SET deprecated=now(), modified=now()" +
      " WHERE isnull(deprecated) AND id=" + id + ";"
    sqli = "INSERT INTO addressbook" +
      " (id,lastname,company,title,work,mobile,email,created,modified)" +
      " VALUES ('" + id + "','" + name + "','" + dep + "','" + pos + "','" + work + "','" + mobile + "','" + email + "',now(),now());"
  } else {
    sqli = "INSERT INTO addressbook" +
      " (lastname,company,title,work,mobile,email,created,modified)" +
      " VALUES ('" + name + "','" + dep + "','" + pos + "','" + work + "','" + mobile + "','" + email + "',now(),now());"
  }
  if (sqlu.length > 0) {
    connection.query(sqlu, function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        //        res.json(rows.affectedRows);
        iRows = rows.affectedRows;
      }
      //    console.log(rows);
    })
  }
  if (sqli.length > 0) {
    connection.query(sqli, function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        iRows = rows.affectedRows;
      }
      //    console.log(rows);
    })
  }
  if (place > 0 && id > 0) {
    sqlu = "DELETE FROM address_in_groups" +
      " WHERE isnull(deprecated) AND id=" + id + ";"
    sqli = "INSERT INTO address_in_groups" +
      " (id,group_id,created,modified)" +
      " VALUES ('" + id + "','" + place + "',now(),now());"
    connection.query(sqlu, function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        iRows = rows.affectedRows;
      }
      //    console.log(rows);
    })
    connection.query(sqli, function (err, rows) {
      if (err) {
        res.send({ status: "error" });
      } else {
        iRows = rows.affectedRows;
      }
      //    console.log(rows);
    })
  }
  res.json(iRows);
})

router.delete('/', function (req, res, next) {
  console.log(req.body);
  var id = req.body.id;
  if (id > 0) {
    var sqlu = "UPDATE addressbook" +
      " SET deprecated=now(), modified=now()" +
      " WHERE isnull(deprecated) AND id=" + id + ";"
  }
  connection.query(sqlu, function (err, rows) {
    if (err) {
      res.send({ status: "error" });
    } else {
      res.json(rows.affectedRows);
    }
    //    console.log(rows);
  })
})


module.exports = router
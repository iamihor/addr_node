var mysql = require('mysql')
require('dotenv').config();
 
var connection = mysql.createConnection({
  host: process.env.host,
  user: process.env.user, //
  password: process.env.password, //
  database: process.env.database,
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})

module.exports = connection

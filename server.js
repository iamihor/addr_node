var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

//connect to the db
//var connection = require('./utils/database')
var dataRoute = require('./routes/data')
//var groupRoute = require('./routes/group')
var userRoute = require('./routes/user')

//create the app instance
var app = express();
//serve static files
app.use(express.static(path.join(__dirname, 'public')));
//parse POST data
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/getip", (req, res) => {
//  var ip = req.ip.substring(req.ip.lastIndexOf(":")+1);
  var ip = req.ip;
  res.json({ message: "Hello "+ip });
});

app.use('/data', dataRoute)
app.use('/group', require('./routes/group'))
app.use('/user', userRoute)

function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

app.listen(3000, function () {
  console.log('Node server running on port : 3000')
})



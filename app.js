'use strict';

var express = require('express')
  , mongoskin = require('mongoskin')
const app        = express();

const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
//const port 	   = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(logger('dev'));
var data;

app.use(function(req,res,next){
 var _send = res.send;
var sent = false;
res.send = function(data){
    if(sent) return;
    _send.bind(res)(data);
    sent = true;
};
next();
});
require('./routes')(router);
app.use('/api/v1', router);

//app.listen(port);
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
//console.log(`App Runs on ${port}`);

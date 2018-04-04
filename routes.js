'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');

const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');

var bodyParser  =   require("body-parser");

var express = require('express')
  , mongoskin = require('mongoskin')

var app         =   express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));
var router      =   express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
const async = require('async');
module.exports = router => {


router.get("/display/:classroomno",function(req,res,next)
{
  var MongoClient = require('mongodb').MongoClient;
	var classroomno = req.params.classroomno;
var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
var db1;
MongoClient.connect(url, function(err, db1) {
 if (err) throw err;
 var dbo = db1.db("information");
 //Find the first document in the customers collection:
 dbo.collection("info").find({ classroomno: req.params.classroomno }).toArray(function(err, result) {
   if (err) throw err;
   console.log(result);
   res.send(result);
   db1.close();
 });
});

});


	router.get("/displayalexa/:day/:time",function(req,res,next)
{
  var MongoClient = require('mongodb').MongoClient;
	
var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
var db1;
MongoClient.connect(url, function(err, db1) {
 if (err) throw err;
 var dbo = db1.db("information");
 //Find the first document in the customers collection:
 dbo.collection("info").find({}).toArray(function(err, result) {
   if (err) throw err;
	    var demo;
   var counter=0;

     for(var i=0 ; i< result.length;i++)
	 {
            
		 
              if(result[i].day !== req.params.day)
		       {
			       var n = result[i].slot.localeCompare(req.params.time);
			       if(n != 0)
			       {    
			                   demo+=result[i].classroomno+ " ";
	                                     counter++;
			       }       
                       }
	}
	 result="The total classrooms available are"+" " + counter + " "+ "and classroom number are"+ " " + demo;
   console.log(result);
   res.send(result);
   db1.close();
 });
});

});
	
	
	
	
 router.post('/postdata', (req, res) => {
		//var data1 = req.body.name;
	  var data2 = req.body.date;
		var data3 = req.body.day;
	var data4 = req.body.work;
//		var data4 = req.body.work.slot;
  // 		var data5 = req.body.work.faculty;
	//	var data6 = req.body.work.subject;
 // your data
	    // do something with that data (write to a DB, for instance)
		/*res.status(200).json({
			message: "Fucked up post " +data2 +'***' +data3
        });
			*/
			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://root:root@ds113749.mlab.com:13749/information";

			MongoClient.connect(url, function(err, db) {
			  if (err) throw err;
			  var dbo = db.db("information");
			  var myobj = {

                  "date" : data2,
                  "day" : data3,
                  "work" : data4


				 };
			  dbo.collection("info").insertOne(myobj, function(err, res) {
			    if (err) throw err;
			    console.log("1 document inserted");


			    db.close();
			  });
     res.send("Inserted Sucessfully");
			});

	});
	
	
	router.post('/temperature', (req, res) => {
		
		
		
	    var data1 = req.body.room;
		var data2 = req.body.temp;
    	var data3 = req.body.humidity;
		var data4 = req.body.timestamp;

			var MongoClient = require('mongodb').MongoClient;
			var url = "mongodb://root:root@ds231719.mlab.com:31719/temperature"

			MongoClient.connect(url, function(err, db) {
			  if (err) throw err;
			  var dbo = db.db("temperature");
			  var myobj = {

                 'room':         data1,
                'temp':         data2,
                'humidity':     data3,
                'timestamp':    data4


				 };
			  dbo.collection("data").insertOne(myobj, function(err, res) {
			    if (err) throw err;
			    console.log("1 document inserted");


			    db.close();
			  });
     res.send("Inserted Sucessfully");
			});

	});
	
	


	router.post('/authenticate', (req, res) => {

	const email = req.body.email;
		const password = req.body.password;
//res.status(200).json({ message: 'Ok !'+email+'**'+password});
	//	const credentials = auth(req);

		//if (!credentials) {

		//	res.status(400).json({ message: 'Invalid Request !'+email+password});

		//} else {

		//	login.loginUser(credentials.name, credentials.pass)
		//const email = req.body.email;
		//const password = req.body.password;
			login.loginUser(email, password)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		//}
	});

	router.post('/users', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
		const password = req.body.password;
		const facultyID = req.body.facultyID;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim() || !facultyID.trim()) {


			res.status(400).json({message: 'Invalid Request !'+ name });

		} else {

			register.registerUser(name, email, password,facultyID)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});




	router.get('/users/:id', (req,res) => {

		if (checkToken(req)) {

			profile.getProfile(req.params.id)

			.then(result => res.json(result))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.put('/users/:id', (req,res) => {

		if (checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.status(401).json({ message: 'Invalid Token !' });
		}
	});

	router.post('/users/:id/password', (req,res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

			.then(result => res.status(result.status).json({ message: result.message }))

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	function checkToken(req) {

		const token = req.headers['x-access-token'];

		if (token) {

			try {

  				var decoded = jwt.verify(token, config.secret);

  				return decoded.message === req.params.id;

			} catch(err) {

				return false;
			}

		} else {

			return false;
		}
	}
}

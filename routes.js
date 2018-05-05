'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');
var ObjectID = require('mongodb').ObjectID;
var bodyParser = require("body-parser");

var express = require('express'),
    mongoskin = require('mongoskin')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    "extended": false
}));
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var db;
const async = require('async');
module.exports = router => {

    // Android fetch
    router.get("/display/:classroomno", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        var classroomno = req.params.classroomno;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({
                classroomno: req.params.classroomno
            }).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result);
                db1.close();
            });
        });

    });

    router.get("/statusdata/", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;

        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("sensordata").find({}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                res.send(result);
                db1.close();
            });
        });

    });




    // Chatbot fetch
    router.get("/chatbotfetch/:classroomno", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        var classroomno = req.params.classroomno;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({
                classroomno: req.params.classroomno
            }).toArray(function(err, result) {
                if (err) throw err;
                var demo = "";
                console.log(result);
                for (var i = 0; i < result.length; i++) {
                    demo += result[i].day + " : " + result[i].slot + " ";

                }
                var jsonstring = {
                    "data": {
                        "type": "text",
                        "text": demo
                    }
                };
                console.log(jsonstring);
                res.send(jsonstring);
                db1.close();
            });
        });

    });

	
	  router.get("/chatbotstatus/:classroomno", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        var classroomno = req.params.classroomno;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({}).toArray(function(err, result) {
                if (err) throw err;
                var demo = "";
                console.log(result);
                      
		    
                    demo +="Air Conditioned is ON and Projector is ON";

                
                var jsonstring = {
                    "data": {
                        "type": "text",
                        "text": demo
                    }
                };
                console.log(jsonstring);
                res.send(jsonstring);
                db1.close();
            });
        });

    });
	
    router.get("/fetchsensordata/:acvalue/:projectorvalue/:timestamp", (req, res) => {

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("information");
            var myobj = {
                "ac": req.params.acvalue,
                "projector": req.params.projectorvalue,
                "time": req.params.timestamp
            };
            dbo.collection("sensordata").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");


                db.close();
            });
            //var dem = "The classroom"+ " " +req.params.classroomno +" " +"is booked for"+" "+req.params.subject+" "+"class" ;
            var result = "Sensor data inserted";
            res.send(result);
        });

    });



    router.get("/sensordata/:acvalue/:doorvalue/:projectorvalue/:timestamp", (req, res) => {

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;

            var dbo = db.db("information");


            var newvalues = {
                $set: {
                    "ac": req.params.acvalue,
		    "door":req.params.doorvalue,	
                    "projector": req.params.projectorvalue,
                    "time": req.params.timestamp
                }
            };
            //var doc = db.collection("sensordata").find({});
            //	var myquery1 = doc._id;
            //      var myquery = {"_id":myquery1};
            dbo.collection("sensordata").updateOne({
                "_id": ObjectID("5acb28c4c4df440014868805")
            }, newvalues, function(err, res) {
                if (err) throw err;
                console.log("1 document updated Now");

                db.close();
            });
            //var dem = "The classroom"+ " " +req.params.classroomno +" " +"is booked for"+" "+req.params.subject+" "+"class" ;
            //  var result = "Sensor data Updated";
            res.send("1 document updated");
        });

    });

    // Chatbot Availabiltity fetch
    router.get("/chatbotavailability/:classroomno/:day/:time", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;
        var classroomno = req.params.classroomno;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({
                $and: [{
                    classroomno: req.params.classroomno
                }, {
                    day: req.params.day
                }, {
                    slot: req.params.time
                }]
            }).toArray(function(err, result) {
                if (err) throw err;
                var demo = "The classroom ";
                console.log(result);
                if (result.length === 0) {
                    var jj = "The classroom" + " " + req.params.classroomno + " " + "is Available";
                    var jsonstring = {
                        "data": {
                            "type": "text",
                            "text": jj
                        }
                    };
                    console.log(jsonstring);
                    res.send(jsonstring);
                } else {
                    for (var i = 0; i < result.length; i++) {
                        demo += +" " + result[i].classroomno + "is booked for " + result[i].subject + "by Professor " + " " + result[i].faculty;

                    }
                    var jsonstring = {
                        "data": {
                            "type": "text",
                            "text": demo
                        }
                    };
                    console.log(jsonstring);
                    res.send(jsonstring);
                }

                db1.close();
            });
        });

    });




    // for alexa to fetch data	
    router.get("/checkavailabilityalexa/:day/:time", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;

        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({}).toArray(function(err, result) {
                if (err) throw err;
                var demo = "The classrooms available are" + " ";
                var counter = 0;
                var cars = ["305", "306", "307", "308"];
                var all = new Array();
                var j = 0;
                for (var i = 0; i < result.length; i++) {

                    var str = result[i].day;
                    var str1 = req.params.day;
                    var str2 = result[i].slot;
                    var str3 = req.params.time;
                    str3 = str3.toLowerCase()
                    if (str.trim() === str1.trim()) {
                        if (str2.trim() === str3.trim()) {
                            all[j] = result[i].classroomno;
                            j++;
                        }
                    }



                }

                for (var k = 0; k < cars.length; k++) {
                    var flag = 0;
                    var m = cars[k];
                    for (var t = 0; t < all.length; t++) {
                        if (m === all[t]) {
                            flag = 1;
                        }
                    }
                    if (flag === 0) {
                        demo += cars[k] + " ";
                    }

                }
                //result="The total classrooms available are"+" " + counter + " "+ "and classroom number are " + " " + demo;
                result = demo;
                console.log(result);
                res.send(result);
                db1.close();
            });
        });

    });


    // for alexa	
    router.get("/displayalexa/:classroomno/:day/:time", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;

        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("info").find({
                $and: [{
                    classroomno: req.params.classroomno
                }, {
                    day: req.params.day
                }, {
                    slot: req.params.time
                }]
            }).toArray(function(err, result) {
                if (err) throw err;
                var demo = "The classroom ";
                var counter = 0;
                if (result.length === 0) {
                    var jj = "The classroom" + " " + req.params.classroomno + " " + "is Available";
                    //  var jsonstring = {"data":{"type":"text","text":jj}};
                    console.log(jj);
                    res.send(jj);
                } else {
                    for (var i = 0; i < result.length; i++) {

                        demo += " " + result[i].classroomno + " " + "is alloted to professor " + " " + result[i].faculty + " " + "who takes " + " " + result[i].subject + " " + "class";
                        counter++;


                    }


                    //result="The total classrooms available are"+" " + counter + " "+ "and classroom number are " + " " + demo;
                    result = demo;
                    console.log(result);
                    res.send(result);
                }
                db1.close();
            });
        });

    });

	
	// for alexa	
    router.get("/alexaclassstatus/:classroomno", function(req, res, next) {
        var MongoClient = require('mongodb').MongoClient;

        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";
        var db1;
        MongoClient.connect(url, function(err, db1) {
            if (err) throw err;
            var dbo = db1.db("information");
            //Find the first document in the customers collection:
            dbo.collection("sensordata").find({}).toArray(function(err, result) {
                if (err) throw err;
                var jj = "Air Condition" + " " + result[0].ac + " " + "and  projector"+ " " +result[0].projector;
                    //  var jsonstring = {"data":{"type":"text","text":jj}};
                    console.log(jj);
                    res.send(jj);
                  
                db1.close();
            });
        });

    });
	
	
	
    router.get("/insertalexa/:classroomno/:date/:day/:time/:faculty/:subject", (req, res) => {

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("information");
            var myobj = {
                "classroomno": req.params.classroomno,
                "date": req.params.date,
                "day": req.params.day,
                "slot": req.params.time,
                "faculty": req.params.faculty,
                "subject": req.params.subject


            };
            dbo.collection("info").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");


                db.close();
            });
            var dem = "The classroom" + " " + req.params.classroomno + " " + "is booked for" + " " + req.params.subject + " " + "class";
            res.send(dem);
        });

    });




    router.get("/chatbotinsert/:classroomno/:date/:day/:time/:faculty/:subject", (req, res) => {

        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://root:root@ds113749.mlab.com:13749/information";

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("information");
            var myobj = {
                "classroomno": req.params.classroomno,
                "date": req.params.date,
                "day": req.params.day,
                "slot": req.params.time,
                "faculty": req.params.faculty,
                "subject": req.params.subject


            };
            dbo.collection("info").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");


                db.close();
            });
            var dem = "The classroom" + " " + req.params.classroomno + " " + "is booked for" + " " + req.params.subject + " " + "class";
            var jsonstring = {
                "data": {
                    "type": "text",
                    "text": dem
                }
            };
            console.log(jsonstring);
            res.send(jsonstring);
        });

    });

  router.post('/insertfeedback', (req, res) => {

        var data1 = req.body.name;
        var data2 = req.body.email;
        var data3 = req.body.classroomno;
        var data4 = req.body.aclevel;
        var data5 = req.body.projector;
        
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

                "name": data1,
                "email": data2,
                "classroomno": data3,
                "aclevel": data4,
                "projector": data5,
                


            };
            dbo.collection("feedback").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");


                db.close();
            });
            res.send("Inserted Sucessfully");
        });

    });
 

    router.post('/postdata', (req, res) => {

        var data1 = req.body.classroomno;
        var data2 = req.body.date;
        var data3 = req.body.day;
        var data4 = req.body.slot;
        var data5 = req.body.faculty;
        var data6 = req.body.subject;
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

                "classroomno": data1,
                "date": data2,
                "day": data3,
                "slot": data4,
                "faculty": data5,
                "subject": data6,


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

                'room': data1,
                'temp': data2,
                'humidity': data3,
                'timestamp': data4


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

                const token = jwt.sign(result, config.secret, {
                    expiresIn: 1440
                });

                res.status(result.status).json({
                    message: result.message,
                    token: token
                });

            })

            .catch(err => res.status(err.status).json({
                message: err.message
            }));
        //}
    });

    router.post('/users', (req, res) => {

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const facultyID = req.body.facultyID;

        if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim() || !facultyID.trim()) {


            res.status(400).json({
                message: 'Invalid Request !' + name
            });

        } else {

            register.registerUser(name, email, password, facultyID)

                .then(result => {

                    res.setHeader('Location', '/users/' + email);
                    res.status(result.status).json({
                        message: result.message
                    })
                })

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });




    router.get('/users/:id', (req, res) => {

        if (checkToken(req)) {

            profile.getProfile(req.params.id)

                .then(result => res.json(result))

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            res.status(401).json({
                message: 'Invalid Token !'
            });
        }
    });

    router.put('/users/:id', (req, res) => {

        if (checkToken(req)) {

            const oldPassword = req.body.password;
            const newPassword = req.body.newPassword;

            if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

                res.status(400).json({
                    message: 'Invalid Request !'
                });

            } else {

                password.changePassword(req.params.id, oldPassword, newPassword)

                    .then(result => res.status(result.status).json({
                        message: result.message
                    }))

                    .catch(err => res.status(err.status).json({
                        message: err.message
                    }));

            }
        } else {

            res.status(401).json({
                message: 'Invalid Token !'
            });
        }
    });

    router.post('/users/:id/password', (req, res) => {

        const email = req.params.id;
        const token = req.body.token;
        const newPassword = req.body.password;

        if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

            password.resetPasswordInit(email)

                .then(result => res.status(result.status).json({
                    message: result.message
                }))

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));

        } else {

            password.resetPasswordFinish(email, token, newPassword)

                .then(result => res.status(result.status).json({
                    message: result.message
                }))

                .catch(err => res.status(err.status).json({
                    message: err.message
                }));
        }
    });

    function checkToken(req) {

        const token = req.headers['x-access-token'];

        if (token) {

            try {

                var decoded = jwt.verify(token, config.secret);

                return decoded.message === req.params.id;

            } catch (err) {

                return false;
            }

        } else {

            return false;
        }
    }
}

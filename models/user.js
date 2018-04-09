'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({

	name 			: String,
	email			: String,
	personid        : String,
	hashed_password	: String,
	created_at		: String,
	temp_password	: String,
	temp_password_time: String

});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:root@ds139969.mlab.com:39969/node-login',{ useMongoClient: true });

module.exports = mongoose.model('user', userSchema);

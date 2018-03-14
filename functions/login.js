'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');

exports.loginUser = (email, password) =>

	new Promise((resolve,reject) => {

		user.find({email: email})

		.then(users => {

			if (users.length == 0) {

				reject({ status: 404, message: 'UserNotFound#404' });

			} else {

				return users[0];

			}
		})

		.then(user => {

			const hashed_password = user.hashed_password;

			if (bcrypt.compareSync(password, hashed_password)) {

				resolve({ status: 200, message:'Success#200' });

			} else {

				reject({ status: 401, message: 'InvalidCredentials#401' });
			}
		})

		.catch(err => reject({ status: 500, message: 'InternalServerError#500' }));

	});

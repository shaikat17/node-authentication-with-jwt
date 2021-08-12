const jwt = require("jsonwebtoken");

const User = require('../models/user');


const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt;

	//check token exits and verified
	if (token) {
		jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.redirect('/login');
			} else {
				//console.log(decodedToken);
				next();
			}
		});
	} else {
		res.redirect('/login');
	}
}

//check current user
const checkUser = (req, res, next) => {
	const token = req.cookies.jwt;

	//check token exits and verified
	if (token) {
		jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
			if (err) {
				console.log(err.message);
				res.locals.user = null;
				next();
			} else {
				//console.log(decodedToken);
				let user = await User.findById(decodedToken.id);
				res.locals.user = user;
				next();
			}
		});
	} else {
		res.locals.user = null;
		next();
	}
}

module.exports = { requireAuth, checkUser };
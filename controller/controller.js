const User = require('../models/user');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
	//console.log(err.message, err.code);
	let errors = { email: '', password: ''};


	//login error
	if (err.message === 'Enter valid info') {
		errors.email = 'Enter valid info';
	}

	//duplicate error code
	if (err.code === 11000){
		errors.email = 'That email already registered';
		return errors;
	}
	//validation errors
	if (err.message.includes('user validation failed')) {
		Object.values(err.errors).forEach(({properties}) => {
			errors[properties.path] = properties.message;
		});
	}
	//console.log(errors)
	return errors;
}

//create tokens
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
	return jwt.sign({ id }, process.env.SECRET_KEY, {
		expiresIn: maxAge
	});
}

module.exports.register_get = (req, res) => {
	res.render('register');
}

module.exports.login_get = (req, res) => {
	res.render('login');
}

module.exports.register_post = async (req, res) => {
	// console.log(req.body.length);
	// if(!req.body){
 //        res.status(400).send({message:"Content can not be empty!"});
 //        return;
 //    }
    const { email, password } = req.body;

	try {
		const user = await User.create({ email, password });
		const token = createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: maxAge * 1000
		});
		res.status(201).json({user: user._id})
	} catch (err) {
		const errors = handleErrors(err);
		// console.log(err);
		res.status(400).json({errors});
	}
	
	//res.render('register');
}

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email,password);
		const token = createToken(user._id);
		res.cookie('jwt', token, {
			httpOnly: true,
			maxAge: maxAge * 1000
		});
		res.status(200).json({user: user._id});
	} catch (err) {
		const errors = handleErrors(err);
		res.status(400).json({ errors });
	}
}

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', {
		maxAge: 1
	});
	res.redirect('/');
} 
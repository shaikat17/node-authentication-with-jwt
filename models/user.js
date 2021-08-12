const validator = require('validator');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: [true, "Please enter an email"],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please enter a valid email']
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
		minLength: [6, "Minimum password length is 6 character"]
	},
});

//fire a function after doc saved to db
userSchema.post('save', function(doc, next){
	//console.log('new user created and saved', doc);
	next();
});


//fire a function before doc saved to db
userSchema.pre('save', async function(next) {
	this.password = await bcrypt.hash(this.password, 10);
	next();
})

//static method to login user
userSchema.statics.login = async function(email, password) {
	const user = await this.findOne({ email });
	if (user) {
		const auth = await bcrypt.compare(password, user.password);
		if (auth) {
			return user;
		}
		throw Error('Enter valid info');
	}
	throw Error('Enter valid info');
}
const User = mongoose.model('user', userSchema);


module.exports = User;
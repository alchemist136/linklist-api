const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Library = require('./library.js');

const userSchema = new mongoose.Schema({
	firstname : {
		type: String,
		required: true,
		trim: true
	},
	surname: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		trim: true,
		validate(value) {
			if(!validator.isEmail(value)) {
				throw new Error('Email Invalid')
			}
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		trim: true,
	},
	tokens: [{
		token: {
			type: String,
			required: true,
		}
	}]
});

userSchema.virtual('libraries',{
	ref: 'Library',
	localField: '_id',
	foreignField: 'author',
});

userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete user.password;
	delete user.tokens;
	return userObject;
}

userSchema.methods.generateAuthToken = async function() {
	const user = this;
	const token = await jwt.sign({_id: user._id.toString()},'thisisauthsign');
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
}

userSchema.statics.findCredential = async (email,password) => {
	var user = await User.findOne({ email });
	if(!user) {
		throw new Error('Unable to Login');
	}
	
	const isMatch = await bcryptjs.compare(password,user.password);
	if(!isMatch) {
		throw new Error('Unable to Login');
	}
	
	return user;
}

userSchema.pre('save', async function (next) {
	var user  = this;
	if(user.isModified('password')) {
		user.password = await bcryptjs.hash(user.password,8);
	}
	next();
})

const User = mongoose.model('User',userSchema);

module.exports = User;
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const auth = async (req,res,next) => {
	try {
		const token = req.header('Authorization');
		const decoded = jwt.verify(token,'thisisauthsign');
		const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
		if(!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	}
	catch(e) {
		res.status(500).send({ error: 'User not authenticated' });
	}
};

module.exports = auth;
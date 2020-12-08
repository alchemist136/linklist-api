const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth.js');

router.post('/user/sign-up', async (req,res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(200).send({user, token});
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.post('/user/log-in', async (req,res) => {
	try {
		const user = await User.findCredential(req.body.email,req.body.password);
		const token = await user.generateAuthToken();
		res.status(200).send({user, token});
	}
	catch(e) {
		res.status(500).send(e);
	}
	
});

router.get('/user/me', auth, async (req,res) => {
	res.status(200).send(req.user);
});

module.exports = router;

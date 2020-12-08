const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth.js');
const bcryptjs = require('bcryptjs');

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

router.patch('/user/me', auth, async (req,res) => {
	const updates = Object.keys(req.body);
	const validUpdates = ['name'];
	const isUpdateValid = updates.forEach((update) => validUpdates.includes(update));
	if(!isUpdateValid) {
		res.status(500).send({error: 'Update not valid'});
	}
	try {
		updates.forEach((update) => req.user[update] = req.body[update]);
		await req.user.save();
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.patch('/user/me/password', auth, async(req,res) =>{
	const currentpassword = req.body.currentpassword;
	const newpassword = req.body.newpassword;
	const isMatch = await bcryptjs.compare(currentpassword,req.user.password);
	if(!isMatch) {
		res.status(500).send({error: 'Wrong Password'});
	}
	try {
		req.user.password = newpassword;
		await req.user.save();
	}
	catch(e) {
		res.status(500).send(e);
	}
})

module.exports = router;

const express = require('express');
const Library = require('../models/library.js');
const User = require('../models/user.js');
const Link = require('../models/link.js');
const router = new express.Router();
const auth = require('../middleware/auth.js');
var moment = require('moment');

router.post('/library',auth, async (req,res) => {
	const lib = new Library();
	lib.title = req.body.title;
	lib.author = req.user._id;
	lib.date = moment().format('L');
	try {
		await lib.save();
		res.status(200).send(lib);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.get('/library', auth, async (req,res) => {
	try {
		await req.user.populate('libraries').execPopulate();
		res.status(200).send(req.user.libraries);
	}
	catch(e) {
		res.status(500).send(e);
	}
	
});

router.get('/library/:id', auth, async (req,res) => {
	const _id = req.params.id;
	try {
		const lib = await Library.findOne({ _id, author: req.user._id });
		if(!lib) {
			return res.status(404).send();
		}
		await lib.populate('links._id').execPopulate();
		res.status(200).send(lib);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.patch('/library/:id', auth, async (req,res) => {
	const updates = Object.keys(req.body);
	const validUpdates = ['title'];
	const isValidOperation = updates.every((update) => validUpdates.includes(update));
	if(!isValidOperation) {
		res.status(500).send({error: 'Operation not valid'});
	}
	try {
		const lib = await Library.findOne({ _id: req.params.id, author: req.user._id });
		if(!lib) {
			return res.status(404).send();
		}
		updates.forEach((update) => lib[update] = req.body[update]);
		await lib.save();
		await lib.populate('links._id').execPopulate();
		res.status(200).send(lib);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.delete('/library/:id', auth, async(req,res) => {
	const _id = req.params.id;
	try {
		await Library.findOneAndDelete({ _id, author: req.user._id });
		res.status(200).send({status: 'deleted'});
	}
	catch(e) {
		res.status(500).send(e);
	}
})

router.post('/library/:id/link', auth, async (req,res) => {
	const _id = req.params.id;
	const link = new Link(req.body);
	try {
		await link.save();
		const lib = await Library.findOne({ _id, author: req.user._id });
		if(!lib) {
			return res.status(404).send();
		}
		lib.links = lib.links.concat({ _id: link._id });
		await lib.save();
		await lib.populate('links._id').execPopulate();
		res.status(200).send(lib);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.patch('/library/:id/link/:lid', auth, async (req,res) => {
	const updates = Object.keys(req.body);
	const validUpdates = ['title','link'];
	const isUpdateValid = updates.every((update) => validUpdates.includes(update));
	if(!isUpdateValid) {
		res.status(500).send({error: 'Operation not valid'});
	}
	const _id = req.params.lid;
	try {
		const link = await Link.findById(_id);
		if(!link) {
			return res.status(404).send();
		}
		updates.forEach((update) => link[update] = req.body[update]);
		await link.save();
		res.status(200).send(link);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

router.delete('/library/:id/link/:lid', auth, async (req,res)=>{
	const id = req.params.id;
	const lid = req.params.lid;
	
	try {
		const lib = await Library.findOne({ _id: id, author: req.user._id });
		if(!lib) {
			return res.status(404).send();
		}
		await Link.findOneAndDelete({ _id: lid });
		lib.links = lib.links.filter((link) => {
			return link._id != lid;
		});
		await lib.save();
		await lib.populate('links._id').execPopulate();
		res.status(200).send(lib);
	}
	catch(e) {
		res.status(500).send(e);
	}
});

module.exports = router;


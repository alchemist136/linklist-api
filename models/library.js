const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./user.js');
const Link = require('./link.js');

const librarySchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	date: {
		type: Date,
		required: true,
	},
	links: [{
		_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Link',
		}
	}]
});

const Library = mongoose.model('Library',librarySchema);

module.exports = Library;
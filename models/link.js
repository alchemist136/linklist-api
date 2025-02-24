const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	}
});

const Link = mongoose.model('Link',linkSchema);

module.exports = Link;

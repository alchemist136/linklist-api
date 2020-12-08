const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/attic-db', {
	useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


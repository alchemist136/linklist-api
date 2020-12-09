const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/linklist-db', {
	useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})


var express = require('express');
var userRouter = require('./routers/user');
var libraryRouter = require('./routers/library');
var db = require('./db/mongoose');
var moment = require('moment');


const app = express();
const port = process.env.port || 3000;

app.use(express.json());
app.use(userRouter);
app.use(libraryRouter);


app.listen(port, () => {
	console.log('Running at port '+port);
});



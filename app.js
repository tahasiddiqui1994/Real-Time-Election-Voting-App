const express = require('express') ;
const path = require('path') ;
const bodyParser = require('body-parser') ;
const cors = require('cors') ;
const port = 3000 ;
const logger = require('morgan');
const app = express() ;
const mongoose = require('mongoose') ;
const config = require('./config/database');
const poll = require('./routes/poll') ;

/*
mongoose.connect('mongodb://localhost:27017/traversymedia', { useNewUrlParser: true }, function(err){
	if (err) {
		console.log(err) ;
	} else {
		//console.log('Connected to MongoDB')
	};
}) ;
*/
/*
mongoose.connect(config.database, { useNewUrlParser: true }) ;
let db      = mongoose.connection ;

db.once('open', function(){
	console.log("Connected to MongoDB") ;
});
db.on('error', function(err){
	console.log("Error in Mongo Connection:", err) ;
});
*/
// Using Promise
// mongoose.Promise = global.Promise
mongoose.connect(config.database, { useNewUrlParser: true })
		.then(function() {
			console.log("Connected to MongoDB") ;
		})
		.catch(function(err){
			console.log("MongoDB Error: ", err) ;
		}) ;

app.use(express.static(path.join(__dirname, 'public'))) ;
app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended: false})) ;
app.use(logger('dev'));
app.use(cors()) ;

app.get('/', (req, res) => {
    res.render('index') ;
}) ;

app.use('/poll', poll) ;

app.listen(port, (err) => {
    if (err) {
        console.log(err) ;
    }
    console.log(`http://localhost:`+port) ;
}) ;

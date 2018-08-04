const mongoose = require('mongoose') ;

const UserSchema = new mongoose.Schema({

	party: {
		type: String,
		required: true
    },
	points: {
		type: String,
		required: true
	}
}) ;

let Poll = mongoose.model('Poll', UserSchema) ;
module.exports = Poll ;

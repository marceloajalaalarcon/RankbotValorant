const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
	_id: String,
	nick: String,
	limit: String,
	report: [String],
	history: [String],
	userData: {
		win: String,
		lose: String,
		points: String,
	},
	userConfig:{
		v2e: String,
	}
})

module.exports = mongoose.model('users', userSchema)
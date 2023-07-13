const mongoose = require('mongoose')

const staffSchema = mongoose.Schema({
	_id: String,
	perm: String,
	record: [String]
})

module.exports = mongoose.model('staff', staffSchema)
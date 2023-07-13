const mongoose = require('mongoose')

const lvlSchema = mongoose.Schema({
	_id: String,
	idServer: String,
	lvl: Number,
	extra_points: String
})

module.exports = mongoose.model('lvl', lvlSchema)
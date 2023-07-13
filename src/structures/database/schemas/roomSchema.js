 const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
	_id: String,
	visible: String,
	idServer: String,
	infoChannel: {
		staffId: String,
		date: String
	},
	vetoConfig: {
		bo: String,
		map: String,
		boCache: String,
		record: [String]
	},
	config: {
		max: String,
		role: String,
		limit: String,
		private: String
	},
	people: {
		teamA: [String],
		teamB: [String],
		players: [String],
		captain_1: String,
		captain_2: String,
	}
})

module.exports = mongoose.model('rooms', roomSchema)
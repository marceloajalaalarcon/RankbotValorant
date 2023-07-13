const mongoose = require('mongoose')

const configSchema = mongoose.Schema({
	_id: String,
	channelId: String,
	listId: String,
	parent: String,
	register: String,
	config: {
		deleteAccount: String,
		reportChannel: String
	}
})

module.exports = mongoose.model('guild', configSchema)
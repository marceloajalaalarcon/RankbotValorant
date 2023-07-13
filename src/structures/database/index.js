var db = './schemas'

module.exports = {
	mongo: require('../../../server.js'),
	userSchema: require(`./schemas/userSchema.js`),
	staffSchema: require(`./schemas/staffSchema.js`),
	lvlSchema: require(`./schemas/lvlSchema.js`),
	roomSchema: require(`./schemas/roomSchema.js`),
	configSchema: require(`./schemas/configSchema.js`)
}
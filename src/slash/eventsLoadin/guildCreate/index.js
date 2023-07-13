const client = require("../../../../index.js");
const { mongo, configSchema, staffSchema } = require('../../../structures/database')

client.on('guildCreate', async (guild) => {
	await mongo().then(async (mongoose) => {
	const guildsBot = await configSchema.findOne({
		_id: guild.id
	}, (err, guildsBot) => {

		if(!guildsBot){
			const guildGame = {
				_id: guild.id,
				register: ''
			}  
		configSchema(guildGame).save()
			}
		})
		
	const staffUser = `${guild.id}-${guild.ownerId}`
		const staff = await staffSchema.findOne({
		_id: staffUser
	}, (err, staff) => {

		if(!staff){
			const staffUserAdd = {
				_id: staffUser,
				perm: 'superuser'
			}  
		staffSchema(staffUserAdd).save()
			}
		})
		
	})
})
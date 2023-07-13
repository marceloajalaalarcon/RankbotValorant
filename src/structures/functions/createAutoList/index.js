const { configSchema, roomSchema } = require('../../database')
//Checks if there are any changes in the rooms and if so, updates the list of open rooms

async function createAutoList(client, interaction) {

let config_guild = await configSchema.findOne({_id: interaction.guild.id})
let db = await roomSchema.find({idServer: interaction.guild.id})
	
let botao = new Array()
		await db.forEach(async(e, i) => {
			botao.push(`${e._id}`)
		})
let bf = await roomSchema.find({_id: botao})
let tabo = new Array()
	if(parseInt(bf.visible) === parseInt(0)){
		return;
		
	} else {
		
		await bf.forEach(async(e, i) => {
			if(parseInt(e.visible) === parseInt(1)) {
				tabo.push(`<#${e._id}>`)
			}
		})
	if(tabo.length == 0){
		client.channels.cache.get(`${config_guild.channelId}`).messages.fetch(`${config_guild.listId}`).then(msg => msg.edit({content: `__**all rooms were closed**__`}))
	} else {
client.channels.cache.get(`${config_guild.channelId}`).messages.fetch(`${config_guild.listId}`).then(msg => msg.edit({content: `**Open rooms**\n${tabo.join('\n')}`}))
		
		}
	}
}

module.exports = createAutoList;
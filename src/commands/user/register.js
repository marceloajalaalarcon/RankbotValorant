const { yellow, red, green } = require('../../utils/colors');
const {  
	EmbedBuilder, 
	ApplicationCommandOptionType
} = require("discord.js");
const { 
	serverNotConfig,
	userRegistred,
	roleDefined,
	successfullyRegistered,
	WithoutPermission
} = require('../../utils/messages');
const { 
	mongo, 
	configSchema, 
	userSchema
} = require('../../structures/database');

module.exports = {
	name: 'register',
	description: 'register with the bot',
	options: [
		{
			name: 'nick',
			description: 'set a nickname to complete registration',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],
	run: async(client, interaction) =>{
	await mongo().then(async (mongoose) => {
		let member = interaction.user
		let nick = interaction.options.getString('nick');
		const memberRank = `${interaction.guild.id}-${interaction.user.id}`
		
			const config = await configSchema.findOne({ _id: interaction.guild.id })
		//check if the server is configured
			if(!config){
				//if you don't have it answer this
			let avisoMap = new EmbedBuilder()
			.setColor(red)
			.setTitle(serverNotConfig)
		interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
			}else{
				//if you have configured it answers this
			if (!config.register) {
				//if you don't have registration role
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle(roleDefined)
				interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})
			} else {
			//checks if the user is already registered
				const users = await userSchema.findOne({ _id: memberRank }, async(err, users) => {
					if (users) {
						let embed = new EmbedBuilder()
							.setColor(yellow)
							.setTitle(userRegistred)
						interaction.reply({ embeds: [embed], ephemeral: true})
					}

					if (!users) {
							//after all the checks it saves the user in the database, if the bot doesn't even find an error
						const user = {
							_id: memberRank,
							limit: '1',
							nick: nick,
							'userData.win':'0',
							'userData.lose':'0',
							'userData.points':'0',
						}
						userSchema(user).save()

						let embed = new EmbedBuilder()
							.setColor(green)
							.setTitle(successfullyRegistered)
						interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})

						let servidor = client.guilds.cache.get(config._id);
						let membro = servidor.members.cache.get(member.id);
						let cargo = servidor.roles.cache.get(config.register);
						
							membro.roles.add(cargo.id).then(() => {
							}).catch(e => {
					let avisoRole = new EmbedBuilder()
							.setColor(yellow)
							.setTitle('⚠️ Without permission')
							.setDescription(WithoutPermission)
						interaction.channel.send({ embeds: [avisoRole], ephemeral: true, fetchReply: false})
					})
						membro.setNickname(`[0] ${nick}`).then(() => {
						}).catch(e => {
							return
						servidor.members.cache.get('359125046050029570').setNickname(`[0] ${nick}`)
						})
					}
				})
			}
		}
	})
}
}
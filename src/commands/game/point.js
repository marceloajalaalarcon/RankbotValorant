//only god knows how it works!
const {  
	EmbedBuilder, 
	ApplicationCommandOptionType
} = require("discord.js");
const { 
	mongo, 
	configSchema,
	roomSchema,
	userSchema, 
	staffSchema
} = require('../../structures/database');
const { 
	ponto,
	tempoDecorrido
} = require('../../structures/functions/createPoints');
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');
const date = require('date-and-time')

module.exports={
		name: 'point',
	description: 'give points',
	options: [
		{
			name: 'team',
			description: 'choose between team a or b',
			type: ApplicationCommandOptionType.String,
			required: true,
			choices: [
						{
							name: "Team A",
							value: "a"
						},
						{
							name: "Team B",
							value: "b"
						}
			]
		}
	],
	run : async (client, interaction) => {	

	await mongo()
		.then(async (mongoose) => {
			const staffUser = `${interaction.guild.id}-${interaction.user.id}`
			const chack = await staffSchema.findOne({ _id: staffUser })

			if (!chack) {
				interaction.reply({
					content: "You don't have perms",
					ephemeral: true, 
					fetchReply: true
				})
			} else if (chack.perm === 'superuser' || chack.perm === 'admin') {

const chackRoom = await roomSchema.findOne({_id: interaction.channel.id})
if(!chackRoom) {
		let avisoMap = new EmbedBuilder()
			.setColor(red)
			.setTitle('> Server not configured')
		interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
}else if(chackRoom){
				
	var chackPlayers = chackRoom.config.limit
	var chackMaxPlayers = chackRoom.config.max
	if(chackPlayers != chackMaxPlayers){
		let avisoMap = new EmbedBuilder()
			.setColor(yellow)
			.setTitle('⚠️ not enough players')
		interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
	} else
if(chackPlayers === chackMaxPlayers){
				
				let fala = interaction.options.getString('team')
				if(!fala) return interaction.reply({content: 'time não encontrado', fetchReply: true})
				const config = await configSchema.findOne({ _id: interaction.guild.id })
					
				switch (fala) {
					case 'a':
					//	var a = 
					const boOFC = await roomSchema.findOne({_id: interaction.channel.id})
						var boOriginal = boOFC.vetoConfig.bo
						if(!boOriginal) {
						let avisoMap = new EmbedBuilder()
							.setColor(yellow)
							.setTitle('⚠️ undefined map!\nSet a map is after the points!')
						interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
						} else {
						var boCache = boOFC.vetoConfig.boCache
							
						if(parseInt(boOriginal) === parseInt(boCache)){

							let avisoMapM = new EmbedBuilder()
							.setColor(yellow)
							.setTitle('⚠️ the games in the room are already over!')
						interaction.reply({ embeds: [avisoMapM], ephemeral: true, fetchReply: true})
						
						}else{
							ponto(interaction, client, 'a')
							await tempoDecorrido()
						interaction.reply({ content: 'Terminado.', ephemeral: false, fetchReply: true})
							const contaBO = parseInt(boCache) + 1
							await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, {$set: {'vetoConfig.boCache': contaBO}})
						}
						}
						break;
					//=======================================
					case 'b':
					//	var b = 'b'
					const boOFCB = await roomSchema.findOne({_id: interaction.channel.id})
						var boOriginalB = boOFCB.vetoConfig.bo
						if(!boOriginalB) {
						let avisoMapB = new EmbedBuilder()
							.setColor(red)
							.setTitle('⚠️ undefined map!\nSet a map is after the points!')
						interaction.reply({ embeds: [avisoMapB], ephemeral: true, fetchReply: true})
						} else {
						var boCacheB = boOFCB.vetoConfig.boCache
							
						if(parseInt(boOriginalB) === parseInt(boCacheB)){

							let avisoMapLB = new EmbedBuilder()
							.setColor(red)
							.setTitle('⚠️ the games in the room are already over!')
						interaction.reply({ embeds: [avisoMapLB], ephemeral: true, fetchReply: true})
						
						}else{
							ponto(interaction, client, 'b')
							await tempoDecorrido()
						interaction.reply({ content: 'Terminado.', ephemeral: false, fetchReply: true})
							const contaBOB = parseInt(boCacheB) + 1
							await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, {$set: {'vetoConfig.boCache': contaBOB}})
						}
						}
						break;
				}
			}
			}
			} else {
				interaction.reply({
					content: "You don't have perms",
					ephemeral: true,
					fetchReply: true
				})
			}
		})
}
}
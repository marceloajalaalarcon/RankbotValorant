//only god knows how it works!
const { 
	EmbedBuilder,
	ApplicationCommandOptionType
} = require("discord.js");
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');
const { 
	mongo, 
	configSchema, 
	userSchema,
	roomSchema
} = require('../../structures/database');
const { 
	serverNotConfig,
	notRegisterd,
	captainNotExist,
	roomNotExist,
	youNotCaptain,
	playerNotRoom,
	playerNotRegisterd
} = require('../../utils/messages');


module.exports={
	name: 'pick',
	description: 'pick player for you',
	options: [
		{
			name: 'user',
			description: ' select player',
			type: ApplicationCommandOptionType.User,
			required: true
		}
	],
	run : async(client, interaction) => {
	await mongo().then(async (mongoose)=> {
		let user_invite_id = interaction.options.getUser('user');
		const room = await roomSchema.findOne({_id: interaction.channel.id})
		
		if(!room){
			let avisoMap = new EmbedBuilder()
			.setColor(red)
			.setTitle(serverNotConfig)
		interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
			
		} else {
		const user_invite_bot = `${interaction.guild.id}-${user_invite_id.id}`
			const user_invite = user_invite_bot.split('-')
		const playerIdDB = await userSchema.findOne({_id: user_invite_bot})
			
			if(!playerIdDB){
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle(notRegisterd)
				interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})
				
			}else{
		const player = playerIdDB._id.split('-')
		const limitPlayers = room.config.max / 2
				
		const verifi = room.people.captain_1 === interaction.user.id || room.people.captain_2 === interaction.user.id
		if(!room){ 
			let warn = new EmbedBuilder()
				.setColor(red)
				.setDescription(roomNotExist)
			interaction.reply({embeds: [warn], ephemeral: true, fetchReply: true})

		} else if(room){
			if(!room.people.captain_1){
				let warn = new EmbedBuilder()
					.setColor(red)
					.setDescription(captainNotExist)
				interaction.reply({embeds: [warn], ephemeral: true, fetchReply: true})

			} 
			else if(verifi === false){
				let warn = new EmbedBuilder()
					.setColor(red)
					.setDescription(youNotCaptain)
				interaction.reply({embeds: [warn], ephemeral: true, fetchReply: true})

			} else if(room.people.captain_1 == interaction.user.id){

				const invalide = await roomSchema.findOne({'people.players': user_invite[1]})
				const invalidePlayerA = await roomSchema.findOne({'people.teamA': player[1]})
				const invalidePlayerB = await roomSchema.findOne({'people.teamB': player[1]})
				
	var invalideJogador
				if (invalidePlayerA){
					 invalideJogador = "team A"
				}else if(invalidePlayerB){
					invalideJogador = "team B"
				}
				
				if(!player){
						let embed = new EmbedBuilder()
							.setColor(yellow)
							.setTitle(playerNotRegisterd)
						interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
						
					}else if(!invalide){
					let embed = new EmbedBuilder()
						.setColor(yellow)
						.setDescription(playerNotRoom)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})

					}else if(room.people.captain_1 == user_invite[1]){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on team A!`)
						interaction.reply({embeds: [embed], ephemeral: true, fetchReply: true})

					}else if(room.people.captain_2 == user_invite[1]){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on team B!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})

					} else if(room.people.teamA.length === limitPlayers){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ your team is already formed!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
					} 
					else if((invalidePlayerB === null)&&(invalidePlayerA === null)){
						let success = new EmbedBuilder()
							.setColor('#649549')
							.setDescription('✅ Player successfully added')
						interaction.reply({embeds: [success], ephemeral: false, fetchReply: true})
						await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.teamA': player[1] }})
					} else {
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on ${invalideJogador}!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
					}
				
/*====================================================================================================================
======================================================================================================================*/
			}else if(!room.people.captain_2){
				let warn = new EmbedBuilder()
					.setColor(red)
					.setDescription(captainNotExist)
				interaction.reply({embeds: [warn], ephemeral: true, fetchReply: true})

			} else if(room.people.captain_2 == interaction.user.id){

				const invalide = await roomSchema.findOne({'people.players': user_invite[1]})

		const invalidePlayerA = await roomSchema.findOne({'people.teamA': player[1]})
				const invalidePlayerB = await roomSchema.findOne({'people.teamB': player[1]})
				
	var invalideJogador
				if (invalidePlayerA){
					 invalideJogador = "team A"
				}else if(invalidePlayerB){
					invalideJogador = "team B"
				}
				
				if(!player){
						let embed = new EmbedBuilder()
							.setColor(yellow)
							.setTitle(playerNotRegisterd)
						interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
						
					}else if(!invalide){
					let embed = new EmbedBuilder()
						.setColor(yellow)
						.setDescription(playerNotRoom)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})

					}else if(room.people.captain_1 == user_invite[1]){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on team A!`)
						interaction.reply({embeds: [embed], ephemeral: true, fetchReply: true})

					}else if(room.people.captain_2 == user_invite[1]){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on team B!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})

					} else if(room.people.teamB.length === limitPlayers){
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ your team is already formed!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
					} 
					else if((invalidePlayerB === null)&&(invalidePlayerA === null)){
						let success = new EmbedBuilder()
							.setColor('#649549')
							.setDescription('✅ Player successfully added')
						interaction.reply({embeds: [success], ephemeral: false, fetchReply: true})
						await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.teamB': player[1] }})
					} else {
						let embed = new EmbedBuilder()
							.setColor('RED')
							.setDescription(`⚠️ this player is on ${invalideJogador}!`)
						interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
					}
			}
		}
		}
	}
	})
}
}
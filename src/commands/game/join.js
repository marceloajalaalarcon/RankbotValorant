//only god knows how it works!
const {  
	EmbedBuilder, 
	ApplicationCommandType
} = require("discord.js");
const {
	yellow,
	red,
	green
} = require('../../utils/colors');
const { 
	mongo, 
	userSchema, 
	roomSchema
} = require('../../structures/database');
const { 
	createAutoList
} = require('../../structures/functions');

module.exports={
		name: 'join',
	description: 'enter a random room',
	type: ApplicationCommandType.ChatInput,

	run : async (client, interaction) => {
	await mongo().then(async (mongoose) => {
		
	const user = `${interaction.guild.id}-${interaction.user.id}`
		const cache = await roomSchema.findOne({ _id: interaction.channel.id })
		if (!cache) {
			let embed = new EmbedBuilder()
				.setColor(red)
				.setTitle('⚠️ room is not registered!')
			interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
		} else if (cache.config.private == 0) {
			let embed = new EmbedBuilder()
				.setColor(red)
				.setTitle('⚠️ private room, impossible to enter!')
			interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true })
		} else if (cache.config.private == 1) {
			
			const usuario = await userSchema.findOne({ _id: user })
			if (!usuario) {
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle('⚠️ you are already registered!')
				interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
			}
			if (usuario) {
				const room = await roomSchema.findOne({ _id: interaction.channel.id })

				if (!room) {
					let embed = new EmbedBuilder()
						.setColor(red)
						.setTitle('⚠️ This channel is not a game room!')
					interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true })
				}
				if (room) {

					const infoPeople = await roomSchema.findOne({ _id: interaction.channel.id })
					const pTeamA = infoPeople.people.teamA
					const pTeamB = infoPeople.people.teamB
					const pPlayers = infoPeople.people.players

					const timeA = new Array()
					await pTeamA.forEach(async (e, i) => {
						timeA.push(`<@${e}>`)
					})
					const timeB = new Array()
					await pTeamB.forEach(async (e, i) => {
						timeB.push(`<@${e}>`)
					})
					const people = new Array()
					await pPlayers.forEach(async (e, i) => {
						people.push(`<@${e}>`)
					})

					if (room.config.limit === room.config.max) {
						let embed = new EmbedBuilder()
							.setColor(green)
							.setTitle('Teams')
							.setDescription(`**TeamA:**\n${timeA.join('\n')}\n\n**TeamB:**\n${timeB.join('\n')}\n\n**Registered players:**\n${people.join('\n')}`)
						interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})

					} else {
						const userlimit = await userSchema.findOne({ _id: user })
						const infoAll = await roomSchema.findOne({ _id: interaction.channel.id })
						if (infoAll.people.players == userlimit.userId) {
							let embed = new EmbedBuilder()
								.setColor(yellow)
								.setTitle('⚠️ you have already entered this room!!')
							interaction.reply({ embeds: [embed], ephemeral: false,fetchReply: true })
						} else if (userlimit.limit <= 0) {
							let embed = new EmbedBuilder()
								.setColor(yellow)
								.setTitle('⚠️ you are already in a room, finish it or leave it to continue!')
							interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true })
						} else {
							const roomlimit = await roomSchema.findOne({ _id: interaction.channel.id })
							let calc = parseInt(roomlimit.config.limit) + parseInt(1)
							let calcu = parseInt(userlimit.limit) - parseInt(1)
							await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.players': interaction.user.id }, $set: { 'config.limit': calc } })
							await userSchema.findOneAndUpdate({ _id: user }, { limit: calcu })
							let mit = await roomSchema.findOne({ _id: interaction.channel.id })
							let embed = new EmbedBuilder()
								.setColor(green)
								.setTitle(`✅ entered successfully\nThis Room(${mit.config.limit}/${mit.config.max})`)
							interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true })

							const data = await roomSchema.findOne({ _id: interaction.channel.id })
							if ((data.people.captain_1 == null) || (data.people.captain_2 == null)) {
								if (data.config.limit >= data.config.max) {
									var a = data.people.players
							function func() {
							
							    for (var i = 0; i < a.length; i++) {
							        if (a[i] === `${data.people.captain_1}`) {
							            var spliced = a.splice(i, 1);
							        }else if(a[i] === `${data.people.captain_2}`){
													var spliced = a.splice(i, 1);
											}
							    }
							}
							func();
									//a 
									n = a.length;

									for (var i = n - 1; i > 0; i--) {
										var j = Math.floor(Math.random() * (i + 1));
										var tmp = a[i];
										a[i] = a[j];
										a[j] = tmp;
									}
									var ultimo = a.length
									let captain_11 = a[0]
									let captain_22 = a[ultimo -= 1]

									let verificar = await roomSchema.findOne({ _id: interaction.channel.id })

									if ((verificar.people.captain_1 == null) && (verificar.people.captain_2 == null)) {
										console.log('fiz esse aqui dos dois capitões')
										await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.teamA': captain_11, 'people.teamB': captain_22 }, $set: { visible: 0, 'people.captain_1': captain_11, 'people.captain_2': captain_22 } })
									} else if((verificar.people.captain_1 === null)) {
										await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.teamA': captain_11 }, $set: { visible: 0, 'people.captain_1': captain_11 } })
									} else if ((verificar.people.captain_2 === null)) {
										await roomSchema.findOneAndUpdate({ _id: interaction.channel.id }, { $push: { 'people.teamB': captain_22 }, $set: {visible: 0, 'people.captain_2': captain_22 }})
									}

									const final = await roomSchema.findOne({ _id: interaction.channel.id })
									const regis = final.people.players
									const players_registered = new Array()
									await regis.forEach(async (e, i) => {
										players_registered.push(`<@${e}>`)
									})
									const a11 = final.people.captain_1 ? `<@${final.people.captain_1}>` : "Undefined"
									const a22 = final.people.captain_2 ? `<@${final.people.captain_2}>` : "Undefined"
									let embed = new EmbedBuilder()
										.setColor(green)
										.setTitle('Teams')
									.setDescription(`Captain team A: ${a11}\nCaptain team B: ${a22}\n**Registered players**\n${players_registered.join('\n')}`)
									await interaction.channel.send({ embeds: [embed] })
									await createAutoList(client, interaction)
									
								} else {

									const final = await roomSchema.findOne({ _id: interaction.channel.id })
									const regis = final.people.players
									const players_registered = new Array()
									await regis.forEach(async (e, i) => {
										players_registered.push(`<@${e}>`)
									})

									let embed = new EmbedBuilder()
										.setColor(green)
										// .setTitle('Teams')
										.setDescription(`**Registered players**\n${players_registered.join('\n')}`)
									await interaction.channel.send({ embeds: [embed] })

									await createAutoList(client, interaction)

								}
							}
						}
					}
				}
			}
		}
	})
}
}
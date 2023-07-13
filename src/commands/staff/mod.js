const { 
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ApplicationCommandOptionType,
	ActionRowBuilder,
	SelectMenuBuilder
} = require("discord.js");
const { 
	mongo, 
	userSchema, 
	staffSchema,
	roomSchema,
} = require('../../structures/database');
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');
const { 
	resetRoomError,
	resetRoom,
	createAutoList
} = require('../../structures/functions');
const date = require('date-and-time')

module.exports = {
	name: 'mod',
	description: 'Commands for moderators',
	options: [
		{
			name: 'room',
			description: 'manage room',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'limit',
					description: 'set player limit',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
						name: 'number',
						description: 'Set number of players',
						type: ApplicationCommandOptionType.Number,
						required: true
						}
					]
				},
				{
					name: 'reset',
					description: 'reset the room',
					type: ApplicationCommandOptionType.Subcommand
				},
				{
						name: 'leave',
						description: 'usar leave',
						type: ApplicationCommandOptionType.Subcommand,
						options: [
							{
								name: 'user',
								description: 'mention a user',
								type: ApplicationCommandOptionType.User,
								required: true
							}
						]
				}
			]
		},
		{
			name: 'map',
			description: 'define the map that will be played',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'veto',
					description: 'choose the map',
					type: ApplicationCommandOptionType.Subcommand,
					options: [

						{
						name: 'bo',
						description: 'exemple 1, 3, 5',
						type: ApplicationCommandOptionType.Number,
						required: true,
							choices: [
								{
									name: "1",
									value: 1
								},
								{
									name: "3",
									value: 3
								},
								{
									name: "5",
									value: 5
								}
							]
						}
						
					]
				}
			]
		}
		
	], run : async (client, interaction) => {
		await interaction.deferReply()
	await mongo().then(async (mongoose)=>{
//check if the user is from the staff
	var staffUserChack = `${interaction.guild.id}-${interaction.user.id}`
	var chack = await staffSchema.findOne({_id: staffUserChack})
	//check if the room exists
	const cache = await roomSchema.findOne({ _id: interaction.channel.id })
		if (!cache) {
			let embed = new EmbedBuilder()
				.setColor(red)
				.setTitle('⚠️ room is not registered!')
			interaction.editReply({ embeds: [embed], ephemeral: true, fetchReply: true})
		} else {
//if it exists, check which command was used
			
		
	if(interaction.options.getSubcommand() === 'limit'){
//check if the user is from the staff
			if(!chack) { 
				interaction.editReply({
					content: "You don't have perms",
					ephemeral: true,
					fetchReply: true
			})
			}else if(chack.perm == 'superuser' || chack.perm == 'admin' || chack.perm == 'moderador') {
			
		let number = interaction.options.getNumber('number')

// var total = number/2;
//check if the number is even or odd
if(number & 1){
			let error_impar = new EmbedBuilder()
				.setColor(yellow)
			.setTitle('⚠️ this operation cannot be completed')
		 .setDescription('> Reasons:\n- It looks like the number given is odd.')
interaction.editReply({embeds: [error_impar], ephemeral: true})

	//if it is even, if the room is smelly and the number informed is equal to or greater than the number of people, you need to confirm the operation
} else 
	if(cache.config.limit >= number) {	
		let yes_erro_limit = new ButtonBuilder(
		{
			style: ButtonStyle.Success,
			label: 'Yes',
			customId: 'yes_erro'
		})
		let no_erro_limit = new ButtonBuilder(
		{
			style: ButtonStyle.Danger,
			label: 'No',
			customId: 'no_erro'
		})
	//if the limit is less than the number of players			
		let error_limit = new EmbedBuilder()
		 .setDescription(`Looks like you've set a limit less than the amount of players\n\` In which case you want to reset the room?\``)
			let row_limit = new ActionRowBuilder({ components: [yes_erro_limit, no_erro_limit] })
			
		let msgErro = await interaction.editReply({embeds: [error_limit], components: [row_limit], fetchReply: true,ephemeral: true, fetchReply: true})

		let collector = msgErro.createMessageComponentCollector({  time: (3 * 60000) })

		//create the collector
	collector.on('collect', async (i) => {
		switch (i.customId) {
			case 'yes_erro':
				await resetRoomError(interaction, cache, number)
				await createAutoList(client, interaction)
				
		let embed1 = new EmbedBuilder()
			.setColor(green)
			.setTitle('✅ channel reset')
		interaction.editReply({embeds: [embed1], components: [], ephemeral: true})

				

			break;
			case 'no_erro':			 							
				let embed = new EmbedBuilder()
					.setColor(green)
					.setTitle('Operation canceled')
				interaction.editReply({embeds: [embed], components: [], ephemeral: true})
			break;
	}
})
			 
	} else {
		//if everything goes right
	let success = new EmbedBuilder()
		.setColor(green)
		.setDescription(`✅ Limit set for ${number} players`)
	interaction.editReply({embeds: [success], ephemeral: false, fetchReply: true})
	await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {visible: 1, 'config.max': number}})
	await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$push: {"vetoConfig.record": `Defined room limit\n${interaction.user.username} (id: ${interaction.user.id})\nMax before: ${cache.config.max} | Later: ${number} \nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}`}
				})
			 //update open room list
			 await createAutoList(client, interaction)
		}
	}
	}

			

	if(interaction.options.getSubcommand() === 'leave') {
//check if the user is from the staff
	if(!chack) { 
				interaction.editReply({
					content: "You don't have perms",
					ephemeral: true,
					fetchReply: true
			})
			}else if(chack.perm == 'superuser' || chack.perm == 'admin' || chack.perm == 'moderador') {

let userMembro = interaction.options.getUser('user');
//check if the room exists and if not, send a message
			const channel_name = await roomSchema.findOne({_id: interaction.channel.id})
			if(!channel_name){
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle('⚠️ it\'s not a room!')
				interaction.editReply({embeds: [embed], ephemeral: false, fetchReply: true})
			} else {
				//checks if the room is open
				if(channel_name.config.visible === 0){
					return;
				} else {
					//checks if the user is in the room
		const channel_player = await roomSchema.findOne({'people.players': userMembro.id})
				if(!channel_player){
				let embed = new EmbedBuilder()
					.setColor(yellow)
					.setTitle('⚠️ this operation cannot be completed')
					.setDescription('> Reasons:\n- Player not found in this room\n- Mentioned player not registered')
				interaction.editReply({embeds: [embed], ephemeral: false, fetchReply: true})
		} else	if(channel_player._id === interaction.channel.id){
					var player_user = userMembro.id
					let conta_room = parseInt(channel_name.config.limit) - parseInt(1)
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$pull: {'people.players': player_user, 'people.teamA': player_user, 'people.teamB': player_user}, $set: {'config.limit': conta_room}})
//check if you have a team captain
				if(userMembro.id == channel_name.people.captain_1) {
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_1': null}})
				}else if(userMembro.id === channel_name.people.captain_2){
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_2': null}})
				}
//updates the status from full to free, without the vacancy of the user who was removed
				if(parseInt(channel_name.visible) === parseInt(0)) {
						await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {visible: '1'}})
				}
					//make updates to the user
				const roomUser = `${interaction.guild.id}-${player_user}`
				let limit_add = await userSchema.findOne({_id: roomUser})
				let conta = parseInt(limit_add.limit) + parseInt(1)
				await userSchema.findOneAndUpdate({_id: roomUser},{limit: conta})
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$push: {"vetoConfig.record": `Player removed\n${interaction.user.username} (id: ${interaction.user.id})\nPlayer: ${limit_add._nick}\nId Player ${userMembro.id}\nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}`}
				})
	interaction.editReply({content: 'Successful player removal', ephemeral: false, fetchReply: true})
//update the list					
await createAutoList(client, interaction)
//if the room is not registered
				} else if(channel_player._id != interaction.channel.id) {
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle('⚠️ This player is not in a room')
				interaction.editReply({embeds: [embed], ephemeral: false, fetchReply: true})
				}
			}
		}
	}
}

			
if(interaction.options.getSubcommand() === 'reset'){
		let channel = interaction.channel
//check if the user is from the staff
if(!chack) { 
				interaction.editReply({
					content: "You don't have perms",
					ephemeral: true,
					fetchReply: true
			})
}else if(chack.perm == 'superuser' || chack.perm == 'admin' || chack.perm == 'moderador') {
	//checks if the searched channel is the same as the channel you are on
	let cache = await roomSchema.findOne({_id: channel.id})
		if(cache._id === channel.id){

		//reset to room
		await resetRoom(interaction, cache)
		
			
		let embed = new EmbedBuilder()
			.setColor(green)
			.setTitle('✅ channel reset')
		interaction.editReply({embeds: [embed], ephemeral: false, fetchReply: true})	

			setTimeout(async() => {  await createAutoList(client, interaction) }, 10000); 
			
		}
}
	
}


if(interaction.options.getSubcommand() === 'veto'){

	let max = interaction.options.getNumber('bo');
	//add options to menu
	let row = new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setPlaceholder('vote')
						.setCustomId('select')
						.setMinValues(max)
						.setMaxValues(max)
						.addOptions([
							{
								label: 'FRACTURE',
								value: 'FRACTURE',
							},
							{
								label: 'BREEZE',
								value: 'BREEZE',
							},
							{
								label: 'ICEBOX',
								value: 'ICEBOX',
							},
								{
								label: 'BIND',
								value: 'BIND',
							},
							{
								label: 'HAVEN',
								value: 'HAVEN',
							},
							{
								label: 'SPLIT',
								value: 'SPLIT',
							},
							{
								label: 'ASCENT',
								value: 'ASCENT',
							},
						])
				)
//splice the message with the image
				let msgSelect = new EmbedBuilder()
					.setColor(transparent)
					.setImage('https://media.discordapp.net/attachments/767892690192695336/929187168784637962/IMG_20220107_213748.png')
				const msg = await interaction.editReply({ embeds: [msgSelect] , components: [row], fetchReply: true , ephemeral: false});
//makes the filter so that only those who make the command can interact				
				const filter = (i) => i.user.id === interaction.user.id
				const collector = msg.createMessageComponentCollector({ filter ,time: (3 * 60000), max: 1})
	//creates the collector and registers it in the room, with the maps and the number of games
	collector.on('collect', async (i) => {
		
		await i.deferUpdate();
			var chack1 = i.user.id
			
			const room = roomSchema.findOne({_id: interaction.channel.id})

			let msgVerificado = new EmbedBuilder()
			msgVerificado.setColor(green)

		switch(max){
			case 1:
				
			const teste = 	await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {
						$push: {
   					 "vetoConfig.record": `Room map choices\n${interaction.user.username} (id: ${interaction.user.id})\nMap: ${i.values[0]} : BO1\nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}`
						}, $set: {
						"vetoConfig.map": `${i.values[0]}`,
						"vetoConfig.bo": `1`,
						"vetoConfig.boCache": '0'
						}
				
				})

					msgVerificado.setDescription(`<:verificado:927259156791042099> The map was selected successfully\nmaps: \` ${i.values[0]} \``)

			await	interaction.editReply({embeds: [msgSelect, msgVerificado], components: [ ]})
			break;
			case 3:
				
				await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {
						$push: {
   					 "vetoConfig.record": `Room map choices\n${interaction.user.username} (id: ${interaction.user.id})\nMap: ${i.values[0]} | ${i.values[1]} | ${i.values[2]} : BO3\nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}`
						},
						$set: {
						"vetoConfig.map": `${i.values[0]} | ${i.values[1]} | ${i.values[2]}`,
						"vetoConfig.bo": `3`,
						"vetoConfig.boCache": '0'
						}
				})

					msgVerificado.setDescription(`<:verificado:927259156791042099> The map was selected successfully\nmaps: \` ${i.values[0]} | ${i.values[1]} | ${i.values[2]} \``)

				await interaction.editReply({embeds: [msgSelect, msgVerificado], components: []})

			break;
			case 5:
						await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {
						$push: {
   					 "vetoConfig.record": `Room map choices\n${interaction.user.username} (id: ${interaction.user.id})\nMap: ${i.values[0]} ${i.values[1]} ${i.values[2]} ${i.values[3]} ${i.values[4]} : BO5\nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}`
						},
						$set: {
						"vetoConfig.map": `${i.values[0]} | ${i.values[1]} | ${i.values[2]} | ${i.values[3]} | ${i.values[4]}`,
						"vetoConfig.bo": `5`,
						"vetoConfig.boCache": '0'
						}
				})

					msgVerificado.setDescription(`<:verificado:927259156791042099> The map was selected successfully\nmaps: \` ${i.values[0]} | ${i.values[1]} | ${i.values[2]} | ${i.values[3]} | ${i.values[4]} \``)

				await interaction.editReply({embeds: [msgSelect, msgVerificado], components: []})
			break;
		}
	})
	
}


		
		}
	})
	}
}
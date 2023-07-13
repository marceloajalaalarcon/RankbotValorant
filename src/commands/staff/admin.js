const { 
	EmbedBuilder,
	ApplicationCommandOptionType,
	PermissionsBitField
} = require("discord.js");
const { 
	mongo, 
	configSchema, 
	userSchema, 
	staffSchema,
	roomSchema,
	lvlSchema
} = require('../../structures/database');
const {
	yellow,
	red,
	green
} = require('../../utils/colors');
const { 
	createAutoList,
} = require('../../structures/functions');
const date = require('date-and-time')

module.exports = {
	name: 'admin',
	description: 'Commands for Admin',
	options: [{
			name: 'room',
			description: 'manage room',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [{
					name: 'create',
					description: 'create channel',
					type: ApplicationCommandOptionType.Subcommand,
					options: [{
						name:'name',
						description: 'Set name of channel',
						type: ApplicationCommandOptionType.String,
						required: true
					}]
			},
			{
				name: 'close',
				description: 'create channel',
				type: ApplicationCommandOptionType.Subcommand,
				options: [{
					name:'channel',
					description: 'Select channel',
					type: ApplicationCommandOptionType.Channel,
					required: true
			}]
		},
		{
			name: 'leave',
			description: 'create public room',
			type: ApplicationCommandOptionType.Subcommand,
			options: [{
					name: 'user',
					description: 'mention a user',
					type: ApplicationCommandOptionType.User,
					required: true
			}]
		},
		{
			name: 'register',
			description: 'set role register',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name:'role',
					description: 'mention the role',
					type: ApplicationCommandOptionType.Role,
					required: true
				}
			]
		}]
		},
					{
						name: 'level',
						description: 'level create',
						type: ApplicationCommandOptionType.SubcommandGroup,
						options: [{
							name:'create',
							description:'create level',
							type: ApplicationCommandOptionType.Subcommand,
							options: [{
								name:'name',
								description: 'Set name of level',
								type: ApplicationCommandOptionType.String,
								required: true	
							},
							{
								name:'level',
								description: 'Set level',
								type: ApplicationCommandOptionType.Integer,
								required: true	
							},
							{
								name:'extra_points',
								description: 'Example: 1 or 1,2 or 2 or 2,9',
								type: ApplicationCommandOptionType.Number,
								required: false	
							}]
						},
						{
							name:'delete',
							description:'delete level',
							type: ApplicationCommandOptionType.Subcommand,
							options: [	{
								name:'role',
								description: 'mention the role',
								type: ApplicationCommandOptionType.Mentionable,
								required: true
							}]
						},
						{
							name:'edit',
							description:'edit level',
							type: ApplicationCommandOptionType.Subcommand,
							options: [
							{
								name:'role',
								description: 'mention the role',
								type: ApplicationCommandOptionType.Mentionable,
								required: true
							},
							{
								name:'name',
								description: 'reset point',
								type: ApplicationCommandOptionType.String,
								required: false								
							},
							{
								name:'level',
								description: 'reset point',
								type: ApplicationCommandOptionType.Integer,
								required: false								
							}]
						}]
					}
	],
run : async (client, interaction) => {

	await mongo().then(async (mongoose)=>{
		let permissons = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
		if(!permissons) { 
			//Check user permissions
				interaction.reply({content: "You don't have perms",ephemeral: true,fetchReply: true})
			} else if(permissons.perm == 'superuser' || permissons.perm == 'admin') { 
			
	if(interaction.options.getSubcommandGroup(false) === 'room') {
		//check which command group is
	if(interaction.options.getSubcommand() === 'create'){
		//check which command is
		let name = interaction.options.getString('name');
				
	let config = await configSchema.findOne({_id: interaction.guild.id})
	const channelCreate = await interaction.guild.channels.create({ parent: config.parent, name: `${name}`, type: 0, reason: `Channel for hosting games`})
		await channelCreate.permissionOverwrites.create(config.register, {
			ViewChannel: true
		})
		//create channel and permissions
		
	const verify_channel = await roomSchema.findOne({_id: channelCreate.id}, async(err, channels_released) => {
		if(channels_released) {
			let embed = new EmbedBuilder()
				.setColor('RED')
				.setTitle('⚠️ you are already registered!')
			interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
			
		}else if(!channels_released){
			const dbChannel = {
				_id: channelCreate.id,
				visible: 1,
				idServer: interaction.guild.id,
				'config.limit': '0',
				'config.private': '1',
				'config.max': 10,
				'infoChannel.staffId': interaction.user.id,
				'infoChannel.date': date.format(new Date(), 'DD/MM/YYYY HH:mm')
			}
		roomSchema(dbChannel).save()
//checks if the id is not duplicated and if not creates a record in the database
			
			let completed = new EmbedBuilder()
				.setColor('#00e600')
				.setDescription(`Room: <#${channelCreate.id}> | Limit: 10`)
			interaction.reply({embeds: [completed], ephemeral: false, fetchReply: true})
			
			await createAutoList(client, interaction)
			
			let enter_the_game = new EmbedBuilder()
				.setColor('#00e600')
				.setTitle('to login use /join command')
			channelCreate.send({embeds: [enter_the_game]})
			//sends confirmation messages and completion of the creation of rooms, in addition to updating the list of open channels
			}
		})
	}
		
		if(interaction.options.getSubcommand() === 'leave'){
			//check if the room is registered
				const channel_name = await roomSchema.findOne({ _id: interaction.channel.id })
			if (!channel_name) {
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle('⚠️ room is not registered!')
				interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
			}	else {

			//Check if the user is registered
			let userMembro = interaction.options.getUser('user');
			const userId = `${interaction.guild.id}-${userMembro.id}`
			const channel_player = await roomSchema.findOne({'people.players': userMembro.id})
				
				//if the user does not have it, he will receive this message
				if(!channel_player){
					let embed = new EmbedBuilder()
						.setColor(yellow)
						.setTitle('⚠️ this operation cannot be completed')
						.setDescription('> Reasons:\n- Player not found in this room\n- Mentioned player not registered')
					interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
					
					//here he will do some checks to get the bot out of the room
				} else	if(channel_player._id === interaction.channel.id){
					var player_user = userMembro.id
					const conta_room = parseInt(channel_name.config.limit) - parseInt(1)
				await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$pull: {'people.players': player_user, 'people.teamA': player_user, 'people.teamB': player_user}, $set: {'config.limit': conta_room}})

				if(userMembro.id == channel_name.people.captain_1) {
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_1': null}})
				}else if(userMembro.id === channel_name.people.captain_2){
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_2': null}})
				}
					
				//if the room is not visible in the list it will be updated and will appear in the list
				if(parseInt(channel_name.visible) === parseInt(0)) {
						await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {visible: '1'})
				}

					//here he returns the permission for the player to go to more rooms
					const limit_add = await userSchema.findOne({_id: userId})
					const count_points = parseInt(limit_add.limit) + parseInt(1)
						await userSchema.findOneAndUpdate({_id: userId},{limit: count_points})
					
					//update room list
					await createAutoList(client, interaction)
					
					interaction.reply({content: 'Successful player removal', ephemeral: false, fetchReply: true})
				} else if(channel_player._id != interaction.channel.id) {
					let embed = new Discord.MessageEmbed()
						.setColor(red)
						.setTitle('⚠️ This player is not in a room')
					interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
				}
			}
	}
			
		if(interaction.options.getSubcommand() === 'close'){
			let selectChannel = interaction.options.getChannel('channel');
			const cache = await roomSchema.findOne({ _id: selectChannel.id })
			if (!cache) {
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle('⚠️ room is not registered!')
				interaction.reply({ embeds: [embed], ephemeral: true, fetchReply: true})
			}	else {
//checks if the mentioned channel is registered in the database
				
			const room = await roomSchema.findOne({_id: selectChannel.id})
			var playersRoom = room.people.players
		
			await playersRoom.forEach(async (e, i) => {
			const users = await userSchema.findOne({_id: e})
				if(!users) {
					return
				} else {
					let pontos = parseInt(users.limit) + parseInt(1)
					await userSchema.findOneAndUpdate({_id: e}, {limit: pontos})
				}
			})	
			//is returning permission to subscribe to another channel, for players registered in that channel
				
		await roomSchema.deleteMany({_id: selectChannel.id})

				
		await createAutoList(client, interaction)
				
		interaction.reply({content: 'Successfully deleted room', ephemeral: false})
		selectChannel.delete()
//deletes the channel from the server and from the database, in addition to updating the channel list
				
			}
		}

		if(interaction.options.getSubcommand() === 'register'){
			let role = interaction.options.getRole('role')
			   await configSchema.findOneAndUpdate({_id: interaction.guild.id}, {register: role.id,})
	   
			   let embed = new EmbedBuilder()
				   .setColor('#649549')
				   .setTitle('✅ role set successfully')
			   interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
		}

		}

			
if(interaction.options.getSubcommandGroup(false) === 'level'){
		if(interaction.options.getSubcommand() === 'create'){
			let name = interaction.options.getString('name');
			let level= interaction.options.getInteger('level');
			let extra_points = interaction.options.getNumber('extra_points');
			
//create role and tell the reason to create it
			const level_create = await interaction.guild.roles.create({ name: `${name}`,  permissions: [PermissionsBitField.Flags.ViewChannel], reason: `Position created for the level ${level}`})

//checks if the role id is already registered
const level_chack = await lvlSchema.findOne({
		lvl: level
	}, (err, level_status) => {
			if(level_status){
				let embed = new EmbedBuilder()
				.setColor('RED')
				.setTitle('⚠️ level already registered!')
			interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})	
				
				//register this role in the database
			}else if(!level_status){
			const levelDataBase = {
				_id: level_create.id,
				lvl: level,
				extra_points: extra_points ? extra_points : 1,
				idServer: interaction.guild.id
			}
		lvlSchema(levelDataBase).save()
				
//success message
	let embed = new EmbedBuilder()
				.setColor(green)
				.setTitle('✅ level created successfully')
		interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
			}
	
	})
	}

		if(interaction.options.getSubcommand() === 'delete'){
			let role = interaction.options.getMentionable('role');
			
			const levelDB = await lvlSchema.findOne({_id: role.id})
				if(!levelDB){
					let embed = new EmbedBuilder()
						.setColor(red)
						.setTitle('Unable to complete action')
					interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
				}else if(levelDB){
					
					let embed = new EmbedBuilder()
						.setColor(green)
						.setTitle('level deleted')
					interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
					await lvlSchema.deleteMany({_id: role.id})
					role.delete('role not used')
				}
		//
	}
	
	if(interaction.options.getSubcommand() === 'edit'){
		let role = interaction.options.getMentionable('role');
		let name = interaction.options.getString('name');
		let level = interaction.options.getInteger('level');
		let point = interaction.options.getNumber('point');
		

		if(name){
				role.edit({
          name: name,
					reason: `level name reset`
        })
		}
		if(level){
			await lvlSchema.findOneAndUpdate({ _id: role.id }, {$set: {lvl: level}})
		}
		if(point) {
			await lvlSchema.findOneAndUpdate({ _id: role.id }, {$set: {extra_points: point}})
		}
		let embed = new EmbedBuilder()
				.setColor(green)
				.setTitle('✅ level edited successfully')
		interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
	}
	
}

				} else {
					interaction.reply({content: "You don't have perms",ephemeral: true,fetchReply: true})
				}	
		
		})
	}
}
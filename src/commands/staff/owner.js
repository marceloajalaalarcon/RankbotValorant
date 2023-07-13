const { 
	EmbedBuilder,
	ApplicationCommandOptionType,
} = require("discord.js");
const { 
	mongo, 
	staffSchema,
	configSchema
} = require('../../structures/database');
const {
	yellow,
	red,
	transparent
} = require('../../utils/colors');
const { 
	resetRoom,
} = require('../../structures/functions');

module.exports = {
	name: 'owner',
	description: 'Commands for Owner',
	options: [
		{
			name: 'staff',
			description: 'manage staff',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [{
				name: 'add',
				description: 'add staff',
				type: ApplicationCommandOptionType.Subcommand,
				options:[{
					name: 'user',
					description: 'mention user',
					type: ApplicationCommandOptionType.User,
					required: true
				},
				{
					name: 'function',
					description: 'set function',
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{
							name: "Admin",
							value: "admin"
							},
							{
							name: "Moderador",
							value: "moderador"
							}
						]
				}]
			},
			{
				name: 'remove',
				description: 'remove staff',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'user',
					description: 'mention who wants to give a role to the bot.',
					type: ApplicationCommandOptionType.User,
					required: true
				}]
			},
			{	
			name: 'view',
			description: 'view staff',
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: 'perm',
					description: 'select function',
					type: ApplicationCommandOptionType.String,
					required: true,
					choices: [
						{
							name: "Super user",
							value: "superuser"
						},
						{
							name: "Admin",
							value: "admin"
							},
							{
							name: "Moderador",
							value: "moderador"
							}
						]
				}
			]
			}]
		},
		{
			name: 'room',
			description: 'manage room',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options:[
				{
					name:'warning',
					description: 'define the channel where the complaints will be sent',
					type: ApplicationCommandOptionType.Subcommand,
					options:[
						{
							name: 'channel',
							description:'select the channel',
							type: ApplicationCommandOptionType.Channel,
							required: true
						}
					]
				},
				{
					name:'list',
					description: 'define the channel list',
					type: ApplicationCommandOptionType.Subcommand,
					options:[
						{
							name: 'channel',
							description:'select the channel',
							type: ApplicationCommandOptionType.Channel,
							required: true
						}
					]
				}
			]
		}
	],
	run: async (client, interaction) => {
		//create database connection
		await mongo().then(async (mongoose)=>{
			//checks if the user has permission to use this command
			let permissons = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
				if(!permissons) { 
					//Check user permissions
						interaction.reply({content: "You don't have perms",ephemeral: true,fetchReply: true})
					} else if(permissons.perm == 'superuser') {

							//If the requested command is from the staff group, it continues
						  if(interaction.options.getSubcommandGroup(false) === 'staff') {
							//if the command is add it execute
							if(interaction.options.getSubcommand() === 'add'){
									let user = interaction.options.getUser('user')
									let function_user = interaction.options.getString('function')
								
										const user_id = `${interaction.guild.id}-${user.id}`
								
										//checks if the mentioned user is already registered
										const user_staff = await staffSchema.findOne({ _id: user_id }, (err, check_user_staff) => {
										if (check_user_staff) {
											let embed = new EmbedBuilder()
												.setColor(red)
												.setTitle('⚠️ you are already registered!')
											interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})
										}
										//create a record if the user does not have
										if (!check_user_staff) {
											const equipe = {
												_id: user_id,
												perm: function_user
											}
											staffSchema(equipe).save()
										interaction.reply({content: '✅', ephemeral: true, fetchReply: true})
										}})
							}
							//if the command is remove it execute
							if(interaction.options.getSubcommand() === 'remove'){
										let user_id = interaction.options.getUser('user');
										const user_token = `${interaction.guild.id}-${user_id.id}`
								
										//checks if the mentioned user is already registered
										const user_staff = await staffSchema.findOne({ _id: user_token }, async (err, check_user_staff) => {
											if (!check_user_staff) {
												let embed = new EmbedBuilder()
													.setColor(red)
													.setTitle('⚠️ you are already registered!')
												interaction.reply({ embeds: [embed], ephemeral: false, fetchReply: true})
											}
											//delete the record if the user is already registered
											if(check_user_staff){
												interaction.reply({content: '✅', ephemeral: false, fetchReply: true})
												await staffSchema.deleteMany({ _id: user_token })
											}
									})
							}
								if(interaction.options.getSubcommand() === 'view'){
									const views = interaction.options.getString('perm')

									//get the records that have or less name selected
									const staff = await staffSchema.find({perm : views})
									
									if(staff.length===0){
										let embed = new EmbedBuilder()
											.setColor(yellow)
											.setDescription(`No registered staff: ${views}`)
										await interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
									} else {
										
								//create the response for the user
								let staff_info = new Array()
									await staff.forEach(async (e, i) => {
										const staffUserBot = e._id
										const staffUser = staffUserBot.split('-')
											var id = staffUser[1] ? `<@${staffUser[1]}>` : "Undefined"
												if(staffUser[0] === interaction.guild.id){
													staff_info.push(`name: ${id} | id: ${staffUser[1]}`)
												}
									})
										//send the answer
										let embed = new EmbedBuilder()
											.setColor(transparent)
											.setDescription("> **Staff**: "+views+'\n\n'+staff_info.join('\n---------------------\n'))
										await interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
		
									}
								}
						}
					if(interaction.options.getSubcommandGroup(false) === 'room'){
						if(interaction.options.getSubcommand() === 'warning'){
//save the channel in the database
							let channel = interaction.options.getChannel('channel')
							
							await configSchema.findOneAndUpdate({_id: interaction.guild.id}, {$set:{ 'config.reportChannel': `${channel.id}` }})
						}

						if(interaction.options.getSubcommand() === 'list'){
							let channel = interaction.options.getChannel('channel')
							//let parent = interaction.options.getChannel('parent')
							const lista_msg = await	channel.send('loadin...')
								
							//await configSchema.findOneAndUpdate({_id: interaction.guild.id}, {})
							if(!channel.parentId){

								let embed1 = new EmbedBuilder()
									
									.setDescription('the channel in the list needs to be within a category')
								interaction.reply({embeds: [embed1], fetchReply: true  })

							} else {

						await configSchema.findOneAndUpdate({_id: interaction.guild.id}, {channelId: channel.id, parent: channel.parentId, listId: lista_msg.id})
						
						let embed1 = new EmbedBuilder()
									.setColor('#649549')
									.setDescription('✅ list set successfully')
								interaction.reply({embeds: [embed1], fetchReply: true  })
						}
					}
					

					}
					
					} else {
					//if the user who ran the code does not have permission, he will receive this message
					interaction.reply({content: "You don't have perms",ephemeral: true,fetchReply: true})
				}	
		})
	}
}

//https://replit-homepage-starfield.omar.repl.co/
const { 
	AttachmentBuilder,
	ModalBuilder,
	TextInputStyle,
	TextInputBuilder, 
	SelectMenuBuilder, 
	ActionRowBuilder, 
	EmbedBuilder, 
	ButtonBuilder,
	ButtonStyle,
	ApplicationCommandOptionType
} = require("discord.js");
const { 
	warningTimeToReact, 
	notRegisterd, 
	accountSuccessfullyDeleted, 
	operactionCanceled, 
	finishTheGame, 
	wantDeleteAccount,
	cYouHaveNotPerm
} = require('../../utils/messages');
const { 
	mongo, 
	userSchema, 
	staffSchema
} = require('../../structures/database');
const { 
	createProfile,
	createPagination,
	checkReport
} = require('../../structures/functions');
const { 
	tempoDecorrido,
	roles
} = require('../../structures/functions/checkMember');
const {
	yellow,
	red,
	transparent
} = require('../../utils/colors');

module.exports ={
	name: 'profile',
	description: 'view beta profile',
	options: [
		{
			name: 'user',
			description: 'mention someone to see their beta profile',
			type: ApplicationCommandOptionType.User,
			required: false
		}
	],
	
run : async ( client, interaction ) => {
	await interaction.deferReply()
	await mongo().then(async (mongoose) => {
		let user_id_member = interaction.options.getUser('user') || interaction.user;
		const user = `${interaction.guild.id}-${user_id_member.id}`
//verify user
			const users = await userSchema.findOne({ _id: user})
//if the user is not registered
			if (!users) {
				let embed = new EmbedBuilder()
					.setColor(red)
					.setTitle(`${notRegisterd}`)
				interaction.editReply({ embeds: [embed], ephemeral: false, fetchReply: true})
				
				//if the user is not registered
			}else if (users){
	//create user profile
		const attach = new AttachmentBuilder(await createProfile(client, interaction, user_id_member.id, users), {name: `profile.png`});
		//add the menu
		if (user_id_member === interaction.user) {

				let menuUser = new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setPlaceholder('⚙️ Settings')
						.setCustomId('select')
						.setDisabled(false)
						.setMinValues(1)
						.setMaxValues(1)
						.addOptions([
							{
								label: 'Change Username',
								value: 'Username',
								description: 'Here you can change your username'
							},
							{
								label: 'Game History',
								value: 'record',
								description: 'View game history'
							},
							{
								label: 'Delete account',
								value: 'delete',
								description: '⚠️ your account will be permanently deleted.'
							}
						])
				)
			//send the message
	const msgPrivada = await interaction.editReply({ components: [menuUser], files:[attach], fetchReply: true  }).catch(err => {
		return
	});
		//filter to see if whoever called the command owns the profile
		const filter = (i) => i.user.id === user_id_member.id
		const collector = await interaction.channel.createMessageComponentCollector({ filter, time: (3 * 6500) })
//create buttons
	const row2 = new ActionRowBuilder()
			.addComponents(
	new ButtonBuilder()
			.setCustomId('yes')
			.setLabel('Yes')
			.setStyle(ButtonStyle.Success),
	new ButtonBuilder()
			.setCustomId('no')
			.setLabel('No')
			.setStyle(ButtonStyle.Danger),
)
//creates the collector, if the user wants to see the history, want to change the name or delete the account
	collector.on('collect', async (i) => {

		if(!i.customId) return
				if (i.customId === 'yes') {
				roles({interaction, client}, user_id_member.id)
				await tempoDecorrido()
				await userSchema.deleteMany({ _id: user })
			let sucessOperaction = new EmbedBuilder()
				.setColor('#00e600')
				.setTitle(`${accountSuccessfullyDeleted}`)
			interaction.editReply({ embeds: [sucessOperaction], components: []})

		} else if (i.customId === 'no') {
			let canceledOperaction = new EmbedBuilder()
				.setColor(red)
				.setTitle(`${operactionCanceled}`)
			await interaction.editReply({embeds: [canceledOperaction], components: [menuUser]})
				.then(msgCanceled => {
				  setTimeout(async function() {
				    await msgCanceled.edit({embeds: []})
				  }, 4000);
				})
await i.deferUpdate();
		}
		
	if(!i.values)return
					switch (i.values[0]) {
	
						case 'delete':
								await i.deferUpdate();

							var chack = i.user.id == user_id_member.id

							if (chack) {
								const userlimit = await userSchema.findOne({ _id: user })
								if (userlimit.limit <= 0) {

									let embed = new EmbedBuilder()
										.setColor(red)
										.setTitle(`${finishTheGame}`)
									interaction.channel.send({ embeds: [embed] })
								}
								if (userlimit.limit > 0) {
									let warnA = new EmbedBuilder()
										.setColor(yellow)
										.setTitle('⚠️ Warning')
									.setDescription(`${wantDeleteAccount}`)
									interaction.editReply({ embeds: [warnA], components: [ row2], fetchReply: true })
								}
							}
							if (!chack) {

								msg.delete().catch(O_o => { });
								interaction.editReply({ content: '<@' + i.user.id + '> the action cannot be completed' })

							}

							break;
						case 'record':
							await i.deferUpdate();
							const history_user = await userSchema.findOne({ _id: user })
								if(history_user.history.length == 0){
									let history = new EmbedBuilder()
										.setColor(transparent)
										.setDescription(`\n\`\`\`js\n${users.nick} has no game history.\n\`\`\`\n`)
								interaction.channel.send({embeds: [history]})
									} else {
							var inverter = history_user.history.reverse()
							await createPagination(interaction, {
								content: inverter,
								message: `${users.nick} history | page {start} of {end}`
							})
							}
							break;

						case 'Username':

							var chack = i.user.id == user_id_member.id

							if (chack) {
							const newNick = new ModalBuilder()
										.setCustomId('newNick')
										.setTitle('Change username');
														
									const newName = new TextInputBuilder()
										.setCustomId('newName')
										.setLabel("What's your new nick name?")
										.setStyle(TextInputStyle.Short);
							
									const firstActionRow = new ActionRowBuilder().addComponents(newName);
							
									newNick.addComponents(firstActionRow);

								i.showModal(newNick)
					
							} else {
								return;
							}
							break;
					}
				})
//time for collector to close
		collector.on('end', collected => {
		let wttrUser = new EmbedBuilder()
			.setColor(yellow)
			.setTitle('⚠️ Warning')
			.setDescription(`${warningTimeToReact}`)
			
    if (collected.size == 0){
			interaction.editReply({embeds: [wttrUser], components: []}).then(limitMsg => {
			  setTimeout(async function() {
			    await limitMsg.edit({embeds: []})
			  }, 4000);
			})
		}
  })
		} else {
const chackStaff = `${interaction.guild.id}-${interaction.user.id}`
const staff = await staffSchema.findOne({_id: chackStaff})
			//checks if the user is from the staff
	var optionsMenu = []
if(!staff){
			optionsMenu.push(
				{
					label: 'Game History',
					value: 'history',
					description: 'View game history'
				},
				{
					label: 'Report',
					value: 'report',
					description: '⚠️ report user.'
				}
			)
	}else if(staff === 'superuser' || 'admin'){
	optionsMenu.push(
		{
			label: 'Game History',
			value: 'history',
			description: 'View game history'
		},
		{
			label: 'View report',
			value: 'viewReport',
			description: '🔍 View report user.'
		},
		{
			label: 'Report',
			value: 'report',
			description: '⚠️ report user.'
		}
	)
}
			//add the menu
	let menuMention = new ActionRowBuilder().addComponents(
					new SelectMenuBuilder()
						.setPlaceholder('Mention')
						.setCustomId('select')
						.setDisabled(false)
						.setMinValues(1)
						.setMaxValues(1)
						.addOptions(
							optionsMenu
						)
				)
				//send the message
				const msgPublica = await interaction.editReply({ components: [menuMention], files:[attach], fetchReply: true, ephemeral: false });
				//filter to see if whoever called the command owns the profile
				const filter = (i) => i.user.id === interaction.user.id
				const collector = await msgPublica.createMessageComponentCollector({ filter, time: (3 * 6500) })

			//creates the collector, in case the user wants to see the history or report it
				collector.on('collect', async (i) => {

					switch (i.values[0]) {
						case 'history':
								await i.deferUpdate();
							const history_user = await userSchema.findOne({ _id: user })
							if(history_user.history.length == 0){
									let history = new EmbedBuilder()
										.setColor(transparent)
										.setDescription(`\n\`\`\`js\n${users.nick} has no game history.\n\`\`\`\n`)
								interaction.channel.send({embeds: [history]})
									} else {
							var inverter = history_user.history.reverse()
							await createPagination(interaction, {
								content: inverter,
								message: `${users.nick} history | page {start} of {end}`
							})
							}
							break;
						case 'report':
							const reportNew = new ModalBuilder()
								.setCustomId(user)
								.setTitle('Roport');
												
							const newReport = new TextInputBuilder()
								.setCustomId('newReport')
								.setLabel("make a complaint")
								.setStyle(TextInputStyle.Paragraph);
					
							const firstRow = new ActionRowBuilder().addComponents(newReport);
					
							reportNew.addComponents(firstRow);
							i.showModal(reportNew);

						break;
						case 'viewReport':
						await i.deferUpdate();
						const staffca = await staffSchema.findOne({_id: interaction.user.id})
					
							if(!filter){
								interaction.editReply({
									content: `${cYouHaveNotPerm}`,
									ephemeral: true,
									fetchReply: true
								})
							}else{
							const report_user = await userSchema.findOne({ _id: user })
							if(report_user.report.length == 0){
									let denuncia = new EmbedBuilder()
										.setColor(transparent)
										.setDescription(`\n\`\`\`js\n${users.nick} has no Report history.\n\`\`\`\n`)
								interaction.channel.send({embeds: [denuncia]})
							} else {
							var inverter = report_user.report.reverse()
							await checkReport(interaction, {
								content: inverter,
								message: `${users.nick} Report history | page {start} of {end}`
							})
							}
							}
							break;
							}
				})

			//time for collector to close
	collector.on('end', collected => {
		let wttrUser = new EmbedBuilder()
			.setColor(yellow)
			.setTitle('⚠️ Warning')
			.setDescription(`${warningTimeToReact}`)
			
    if (collected.size == 0){
			interaction.editReply({embeds: [wttrUser], components: []})
				.then(limitMsg => {
			  setTimeout(async function() {
			    await limitMsg.edit({embeds: []})
			  }, 4000);
			})
		}
  })
			
		}
		}
	})
	
}
}
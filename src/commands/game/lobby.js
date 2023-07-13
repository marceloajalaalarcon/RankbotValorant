const { 
	ActionRowBuilder, 
	EmbedBuilder, 
	ButtonBuilder,
	ButtonStyle,
	ApplicationCommandType,
	createMessageComponentCollector
} = require("discord.js");
const { 
teamNull
} = require('../../utils/messages');
const { 
	mongo, 
	roomSchema,
	staffSchema
} = require('../../structures/database');
const { 
	createPagination
} = require('../../structures/functions');
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');

module.exports ={
		name: 'lobby',
	description: 'info for lobby',
	type: ApplicationCommandType.ChatInput,
	run : async (client, interaction) => {
	await mongo().then(async (mongoose) => {
		
	const record = new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setLabel('Record')
			.setCustomId('record')
	const teans =	new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setLabel('Teans')
			.setCustomId('teans')
	const home =	new ButtonBuilder()
			.setStyle(ButtonStyle.Primary)
			.setLabel('Back')
			.setCustomId('home')
		
		const info = await roomSchema.findOne({_id: interaction.channel.id})
		if(!info){
			interaction.reply({content: 'lobby not register'})
		} else{
			let permissons = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
		//lists all database information
	const maps = info.vetoConfig.map ? `${info.vetoConfig.map}` : "`Undefined`"
	const captain_1 = info.people.captain_1 ? `<@${info.people.captain_1}>` : "`Undefined`"
	const captain_2 = info.people.captain_2 ? `<@${info.people.captain_2}>` : "`Undefined`"
	const boin = info.vetoConfig.bo ? `${info.vetoConfig.bo}` : "`Undefined`"
	const boinCache = info.vetoConfig.boCache ? `${info.vetoConfig.boCache}` : "`Undefined`"
	const staffIdHome = info.infoChannel.staffId ? info.infoChannel.staffId : "`Undefined`"
	const dateChannelHome = info.infoChannel.date ? info.infoChannel.date : "`Undefined`"
	
			//creates and organizes the message that will be sent
			let embed = new EmbedBuilder()
				.setFooter({text: '🖥️ Panel RankBot'})
				.setDescription(`Staff: ${staffIdHome}\nDate: ${dateChannelHome}\nMax: ${info.config.max}\nPlayers: ${info.config.limit}\nMatches: ${boin}\nCompleted matches: ${boinCache}\nlevel require: ${info.config.role}\nMaps: \`${maps}\`\nCaptain A: ${captain_1}\nCaptain B: ${captain_2}`)
			//check if the user is staff
			var buttonStaff
			if(!permissons){
				buttonStaff = new ActionRowBuilder({ components: [teans] })
			}else if(permissons.perm === 'superuser' || permissons.perm === 'admin'){
				buttonStaff = new ActionRowBuilder({ components: [record, teans] })
			}
			
			const msg = await interaction.reply({ components: [buttonStaff], embeds: [embed], fetchReply: true, ephemeral: false});
			
//creates the filter, along with the collector
				const filter = (i) => i.user.id === interaction.user.id
				const collector = msg.createMessageComponentCollector({ filter, time: (3 * 60000) })

				collector.on('collect', async (i) => {

					switch (i.customId) {
						case 'record':
							await i.deferUpdate();
						
							const info = await roomSchema.findOne({_id: interaction.channel.id})
							if(info.vetoConfig.record.length === 0){
							let noRegistry = new EmbedBuilder()
								.setColor(yellow)
								.setDescription(`Apparently this room has no record`)
							interaction.editReply({embeds: [noRegistry], components: []})
							} else {
								var inverter = info.vetoConfig.record.reverse()
								await createPagination(interaction, {
										content: inverter,
										message: `Record | page {start} of {end}`
							})
							}
				
							break;
						case 'teans':
							await i.deferUpdate();
							
							const peoples = await roomSchema.findOne({_id: interaction.channel.id})

								let chackPlayers = peoples.config.limit
								let chackMaxPlayers = peoples.config.max
							
								if(chackPlayers != chackMaxPlayers){

let permissons_Back_one = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
			var buttonStaff_Back_one
			if(!permissons_Back_one){
				buttonStaff_Back_one = new ActionRowBuilder({ components: [home] })
			}else if(permissons_Back_one.perm === 'superuser' || permissons_Back_one.perm === 'admin'){
				buttonStaff_Back_one = new ActionRowBuilder({ components: [record, home] })
			}
									
								let Aviso= new EmbedBuilder()
									.setColor(yellow)
								.setDescription(teamNull)
							  interaction.editReply({embeds: [Aviso], components: [buttonStaff_Back_one]})
									
								} else {

									let captain_a = peoples.people.captain_1
									let captain_b = peoples.people.captain_2
									let aCaptains = peoples.people.teamA
									let bCaptains = peoples.people.teamB
									let Pplayers = peoples.people.players
									
							var tabelaP = new Array()
							await Pplayers.forEach(async(e,i)=>{
								tabelaP.push(`<@${e}>`)
							})
							
							var tabelaA = new Array()
								await aCaptains.forEach(async (e, i) => {
										if(captain_a === e){
										tabelaA.push(`<@${captain_a}> 👑`)
									}else{
										tabelaA.push(`<@${e}>`)
										}
								})

							var tabelaB = new Array()
								await bCaptains.forEach(async (e, i) => {
							if(captain_b === e){
									tabelaB.push(`<@${captain_b}> 👑`)
									}else{
									tabelaB.push(`<@${e}>`)
									//tabelaB.splice(tabelaB.indexOf(captain_b),1)
							}
								
								})
					 
							let teansEmbed = new EmbedBuilder()
								.setDescription(`team A:\n${tabelaA.join('\n')}\nteam B:\n${tabelaB.join('\n')}\n\nPlayers registred:\n${tabelaP.join('\n')}`)
								.setFooter({text: 'the crown(👑) represents the leader of each team.'})
									
		let permissonsBack = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
			var buttonStaffBack
			if(!permissonsBack){
				buttonStaffBack = new ActionRowBuilder({ components: [home] })
			}else if(permissonsBack.perm === 'superuser' || permissonsBack.perm === 'admin'){
				buttonStaffBack = new ActionRowBuilder({ components: [record, home] })
			}
									
		interaction.editReply({embeds: [teansEmbed], components: [buttonStaffBack]})
					}
						break;
							
						case 'home': 
							await i.deferUpdate();
							const infohome = await roomSchema.findOne({_id: interaction.channel.id})
							
							const maps1 = infohome.vetoConfig.map ? `${infohome.vetoConfig.map}` : "`Undefined`"
							const captain_11 = infohome.people.captain_1 ? `<@${infohome.people.captain_1}>` : "`Undefined`"
							const captain_22 = infohome.people.captain_2 ? `<@${infohome.people.captain_2}>` : "`Undefined`"
							const staffId = infohome.infoChannel.staffId ? infohome.infoChannel.staffId : "`Undefined`"
							const dateChannel = infohome.infoChannel.date ? infohome.infoChannel.date : "`Undefined`"

								let homeEmbed = new EmbedBuilder()
								.setFooter({text: '🖥️ Panel RankBot'})
							.setDescription(`Staff: ${staffId}\nDate: ${dateChannel}\nMax: ${infohome.config.max}\nPlayers: ${infohome.config.limit}\nlevel require: ${infohome.config.role}\nMaps: \`${maps1}\`\nCaptain A: ${captain_11}\nCaptain B: ${captain_22}`)

																
		let permissonsBack_two = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})
			var buttonStaffBack_two
			if(!permissonsBack_two){
				buttonStaffBack_two = new ActionRowBuilder({ components: [home] })
			}else if(permissonsBack_two.perm === 'superuser' || permissonsBack_two.perm === 'admin'){
				buttonStaffBack_two = new ActionRowBuilder({ components: [record, home] })
			}
							
							interaction.editReply({embeds: [homeEmbed], components: [buttonStaffBack_two]})
					break;
					}
					})
		}
	})
}
}
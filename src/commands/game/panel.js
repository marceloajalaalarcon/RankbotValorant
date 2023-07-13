const {  
	SelectMenuBuilder, 
	ActionRowBuilder, 
	EmbedBuilder, 
	ApplicationCommandType
} = require("discord.js");
const { 
	mongo,
	roomSchema,
	configSchema, 
	lvlSchema, 
	staffSchema
} = require('../../structures/database');
const { 
ChangesSaved
} = require('../../utils/messages');
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');

module.exports={
		name: 'panel',
	description: 'options panel',
	type: ApplicationCommandType.ChatInput,
	
	run : async(client, interaction) => {
	var cor = "0x2f3136";

await mongo().then(async (mongoose)=>{
let permissons = await staffSchema.findOne({_id: `${interaction.guild.id}-${interaction.user.id}`})

			if(!permissons) { 
				//Check user permissions
				interaction.reply({content: "You don't have perms", ephemeral: true,fetchReply: true
			})
			}else if(permissons.perm === 'superuser' || permissons.perm === 'admin'){

const config = await configSchema.findOne({_id: interaction.guild.id})
	if(!config){
		let avisoMap = new EmbedBuilder()
			.setColor(red)
			.setTitle('⚠️ server not configured')
		interaction.reply({ embeds: [avisoMap], ephemeral: true, fetchReply: true})
	}else{
		//lists all content in the database
		var server = config._id
		var register = config.register ? `<@&${config.register}>` : "/admin room register"
		var canal = config.channelId ? `<#${config.channelId}>` : "/owner room list"
		var parent = config.parent ? `<#${config.parent}>` : "Undefined"
		var msgId = config.listId ? `[Click me](https://discord.com/channels/${server}/${config.channelId}/${config.listId})` : "Undefined"
		var deleteConta = config.config.deleteAccount ? `${config.config.deleteAccount}` : "false"
		
//lists all content in the database
		let embed = new EmbedBuilder()
			.setColor(transparent)
			.setTitle('Painel')
			.setDescription("> **Server config**\n- Role for player registration:\n"+register+"\n\n- Channel where the list of open rooms will be:\n"+canal+"\n\n-List of open rooms (Do not delete):\n"+msgId+"\n\n- Open room list channel category:\n"+parent+"\n\n- Delete players account after leaving the server?:\n"+deleteConta)

//check status of account delete permission
var statusDelete
	if(deleteConta === 'false'){
		statusDelete = '❌'
	} else {
		statusDelete = '✅'
	}

	//create the menu
	let row = new ActionRowBuilder().addComponents(
		new SelectMenuBuilder()
		.setPlaceholder('📁 Panel')
		.setCustomId('select')
	  .setDisabled(false)
		.setMinValues(1)
		.setMaxValues(1)
		.addOptions([
	      {
	        label: 'Server config',
	        emoji: '⚙️',
	        value: 'config',
	        description: 'View home'
	      },
	      {
	        label: 'Levels',
	        emoji: '⚜️',
	        value: 'lvl',
	        description: 'View levels game'
	      },
				{
	        label: `Delete player account: ${deleteConta}`,
	        emoji: `${statusDelete}`,
	        value: `${deleteConta}`,
	        description: 'Auto delete user account'
	      },		
	    ])
	)

//send the message with the menu
const msg = await interaction.reply({ components: [row], embeds: [embed], fetchReply: true, ephemeral: false});

//creates the filter of who can move the menu
	const stffUs = permissons._id.split('-')
	const filter = (i) => i.user.id === stffUs[1]
 	const collector = msg.createMessageComponentCollector({ filter, time: (3 * 60000), })

	//creates collector with each response for each menu action
  collector.on('collect', async (i) => {

	switch (i.values[0]) {
		case 'config':
		await i.deferUpdate();

		let embed2 = new EmbedBuilder()
			.setColor(transparent)
			.setTitle('Painel')
			.setDescription("> **Server config**\n- Role for player registration:\n"+register+"\n\n- Channel where the list of open rooms will be:\n"+canal+"\n\n- List of open rooms (Do not delete):\n"+msgId+"\n\n- Open room list channel category:\n"+parent+"\n\n- Delete players account after leaving the server?:\n"+deleteConta)
		
		await interaction.editReply({embeds: [embed2]})

	break;
	case 'lvl':
await i.deferUpdate();
const lvlS = await lvlSchema.find({idServer: interaction.guild.id})

let tabo = new Array()
await lvlS.forEach(async (e, i) => {
	var id = e._id ? `<@&${e._id}>` : "Undefined"
	tabo.push(`Role: ${id} | ID: ${e._id} | level: ${e.lvl}`)
})

		let embed = new EmbedBuilder()
			.setColor(transparent)
			.setTitle('Painel')
			.setDescription("> **Levels**\n`levels registered\n`"+tabo.join('\n'))
		await interaction.editReply({embeds: [embed]})
		
  break;
		case 'false':
				let avisoAtualizaF = new EmbedBuilder()
				.setColor(green)
				.setTitle(`${ChangesSaved}`)
				.setDescription('Status: true')
			await configSchema.findOneAndUpdate({_id: interaction.guild.id}, { $set: { 'config.deleteAccount': true } })
			await interaction.editReply({embeds: [avisoAtualizaF], components: []})
	break;
		case 'true':
			let avisoAtualiza = new EmbedBuilder()
				.setColor(green)
				.setTitle(`${ChangesSaved}`)
				.setDescription('Status: false')
			await configSchema.findOneAndUpdate({_id: interaction.guild.id}, { $set: { 'config.deleteAccount': false } })
			await interaction.editReply({embeds: [avisoAtualiza], components: []})
		break;
	 }
		
	})

	collector.on('end', collected => {
    if (collected.size == 0) msg.edit({content: `Did not react in time!`})
  })
			}
//if you do not have permission, this message appears
}  else {
			interaction.reply({content: "You don't have perms", ephemeral: true,	fetchReply: true
		})
			}
	})
}
}
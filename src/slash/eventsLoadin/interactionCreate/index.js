const client = require('../../../../index.js');
const { EmbedBuilder } = require('discord.js')
const { yellow, red, green } = require('../../../utils/colors');
const { 
	mongo, 
	configSchema, 
	userSchema, 
	hitorySchema, 
	staffSchema,  
} = require('../../../structures/database');
const { 
	InteractionType
} = require("discord.js");
const date = require('date-and-time')

client.on("interactionCreate", async(interaction) => {
    if(interaction.isChatInputCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);
        if(!cmd)
        return interaction.reply({
            content: "An Error Has Occered In Slash Command"
        });

        const guild =  client.guilds.cache.get(interaction.guildId);
        const args = [];

        for(let option of interaction.options.data) {
            if(option.type === "SUB_COMMAND") {
                if(option.name) args.push(option.name);
                option.options ?.forEach((x) => {
                    if(x.value)
                    args.push(x.value);
                })
            } else if(option.value)
            args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction, guild, interaction.options);
    }

	//modal
		if (interaction.type === InteractionType.ModalSubmit) {
	await mongo().then(async(mongoose) => {
		if(interaction.customId === 'newNick'){
				const hobbies = await interaction.fields.getTextInputValue('newName');
					const user = `${interaction.guild.id}-${interaction.user.id}`
					await userSchema.findOneAndUpdate({ _id: user }, { nick: hobbies })
					interaction.reply({ content: 'Username updated successfully' })		

			const userN = await userSchema.findOne({_id: user})
			const configN = await configSchema.findOne({_id: interaction.guild.id})
			
				let servidor = client.guilds.cache.get(configN._id);
						let membro = servidor.members.cache.get(interaction.user.id);
					const dono = servidor.ownerId
						membro.setNickname(`[${userN.userData.points}] ${userN.nick}`).then(() => {
						}).catch(e => {
							return
						})
		} else {
			
		const idModel = await userSchema.findOne({_id: interaction.customId})
		if(!idModel){
			return
		} else {
			const hobbies = await interaction.fields.getTextInputValue('newReport');
			const userIn = interaction.user.id
			const peopleUserIDV = idModel._id
  			const peopleIDV = peopleUserIDV.split('-')
			const warning = await configSchema.findOne({_id: interaction.guild.id})
			const warning_channel = warning.config.reportChannel

			await userSchema.findOneAndUpdate({ _id: idModel._id}, {
				$push: {
					report:`Complaint made on the day: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}\nComplaint author: ${userIn}\nDenounced:  \n> ID: ${peopleIDV[1]}\n> Nick: ${idModel.nick}\nComplaint: ${hobbies}`
				}
			})

			interaction.reply({content: 'report sent successfully', ephemeral: true, fetchReply: true})

			if(!warning || !warning_channel){
				return
			}else{
				let avisoMap = new EmbedBuilder()
					.setColor(yellow)
					.setTitle('Warning')
					.setDescription(`Complaint made on the day: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}\nComplaint author: ${userIn}\nDenounced:  \n> ID: ${peopleIDV[1]}\n> Nick: ${idModel.nick}\nComplaint: ${hobbies}`)
				client.channels.cache.get(`${warning_channel}`).send({ embeds: [avisoMap], fetchReply: false})
			}
		}
		}
		})
	}
	
})
const { 
	EmbedBuilder, 
	ApplicationCommandType
} = require("discord.js");
const {
	yellow,
	red,
	green,
	transparent
} = require('../../utils/colors');
const { 
	createAutoList,
} = require('../../structures/functions');
const { 
	mongo, 
	configSchema, 
	userSchema,
	staffSchema, 
	roomSchema 
} = require('../../structures/database');

module.exports={
	name: 'leave',
	description: 'leave the room',
	type: ApplicationCommandType.ChatInput,
	
	run : async( client, interaction ) => {
	await mongo().then(async (mongoose)=> {
		const userId = `${interaction.guild.id}-${interaction.user.id}`

		//check if the room is registered
			const channel_name = await roomSchema.findOne({_id: interaction.channel.id})
			if(!channel_name){
				let embed = new EmbedBuilder()
					.setColor(yellow)
					.setTitle('⚠️ it\'s not a room!')
				interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
			} else {
				if(channel_name.config.visible === 0){
					return;
				} else {

		//Check if the user is registered
		const channel_player = await roomSchema.findOne({'people.players': interaction.user.id})

		//if the user does not have it, he will receive this message
		if(!channel_player){
				let embed = new EmbedBuilder()
					.setColor(yellow)
					.setTitle('⚠️ this operation cannot be completed')
					.setDescription('> Reasons:\n- Player not found in this room\n- Mentioned player not registered')
			
				interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})

			//here he will do some checks to get the bot out of the room
		} else	if(channel_player._id === interaction.channel.id){
					var player_user = interaction.user.id
					const conta_room = parseInt(channel_name.config.limit) - parseInt(1)
				await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$pull: {'people.players': player_user, 'people.teamA': player_user, 'people.teamB': player_user}, $set: {'config.limit': conta_room}})

				if(interaction.user.id == channel_name.people.captain_1) {
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_1': null}})
				}else if(interaction.user.id === channel_name.people.captain_2){
					await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {$set: {'people.captain_2': null}})
				}

				//if the room is not visible in the list it will be updated and will appear in the list
				if(parseInt(channel_name.visible) === parseInt(0)) {
						await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, {visible: '1'})
				}

			//here he returns the permission for the player to go to more rooms
				const limit_add = await userSchema.findOne({_id: userId})
				const conta = parseInt(limit_add.limit) + parseInt(1)
				await userSchema.findOneAndUpdate({_id: userId},{limit: conta})
			
				//update room list
				await createAutoList(client, interaction)
			
				interaction.reply({ content:'you left successfully', ephemeral: false, fetchReply: true})
				}else if(channel_player._id != interaction.channel.id) {
				let embed = new EmbedBuilder()
					.setColor(yellow)
					.setTitle('⚠️ you\'re not playing in this room')
				interaction.reply({embeds: [embed], ephemeral: false, fetchReply: true})
				}
				}
			}
	})
}
}
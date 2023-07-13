const { 
	mongo, 
	configSchema, 
	userSchema, 
	staffSchema,
	roomSchema,
	lvlSchema
} = require('../../database');
const {
	yellow,
	red,
	green,
	transparent
} = require('../../../utils/colors');
const date = require('date-and-time')

async function resetRoomError(interaction, cache, number) {

const players = cache.people.players
			const channel = interaction.channel
			let count = 0
				await players.forEach(async (e, f) => {
					count += 1
					const user_id = await userSchema.findOne({_id: `${interaction.guild.id}-${e}`})
					if(!user_id) return;
					var conta_limit = parseInt(user_id.limit) + 1
					await userSchema.findOneAndUpdate({_id: `${interaction.guild.id}-${e}`}, {limit: conta_limit})
					await roomSchema.findOneAndUpdate({_id: channel.id}, {$pull: {'people.players': e,  'people.teamA': e, 'people.teamB': e}})
					
					if ((f + 1) === count) {
							await roomSchema.findOneAndUpdate({_id: channel.id}, {$set:{'config.limit': 0, 'config.visible': 1, 'config.max': number, visible: 1}})
							await roomSchema.findOneAndUpdate({_id: channel.id}, {$set:{'people.captain_1': null, 'people.captain_2': null}})
						

			await roomSchema.findOneAndUpdate({_id: interaction.channel.id}, { $push: {"vetoConfig.record": `Room boundary set by force\n${interaction.user.username} (id: ${interaction.user.id})\nMax before: ${cache.config.max} | Later: ${number} \nDefined in: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}` }
			})
		}
	})
}

module.exports = resetRoomError
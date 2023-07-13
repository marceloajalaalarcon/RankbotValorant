const client = require("../../../../index.js");
const { mongo, userSchema, roomSchema, configSchema } = require('../../../structures/database/index.js')

client.on('guildMemberRemove', async (member) => {
	const guildMember = member.guild
	
	const user = `${guildMember.id}-${member.id}`
	await mongo().then(async (mongoose) => {
			const roomCache = await roomSchema.findOne({'people.players': member.id})
			const userCache = await userSchema.findOne({_id: user})
			if(!userCache){
				return;
			}else if(!roomCache){
		const serverSatusConfig = await configSchema.findOne({_id: guildMember.id})					
			if(serverSatusConfig.config.deleteAccount === 'true'){
				await userSchema.deleteMany({ _id: user })
				}
				
			} else {
			var conta = parseInt(roomCache.config.limit) - 1 
				const cheke =  roomCache.people.players.includes(member.id)
				console.log(cheke)
							if(cheke){
								await roomSchema.findOneAndUpdate({'people.players': member.id}, {$pull:{'people.players': member.id}, $set: {'config.limit': conta}, visible: '1' })
								await roomSchema.findOneAndUpdate({'people.players': member.id}, {$pull:{'people.teamA': member.id}})
								await roomSchema.findOneAndUpdate({'people.players': member.id}, {$pull:{'people.teamB': member.id}})
								
			const serverSatusConfig = await configSchema.findOne({_id: guildMember.id})					
			if(serverSatusConfig.config.deleteAccount === 'true'){
				await userSchema.deleteMany({ _id: user })
				}
					}
					
					
			}
		})
})
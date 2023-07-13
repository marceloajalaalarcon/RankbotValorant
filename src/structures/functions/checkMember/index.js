const Discord = require('discord.js')
const { mongo, userSchema, configSchema, lvlSchema, roomSchema, hitorySchema, staffSchema } = require('../../database')
const date = require('date-and-time')
//só deus sabe como funciona!

var inicio;
//====================Inicia aqui====================//
		async function roles({ interaction, client }, e) {
			inicio = new Date().getTime();
			const config = await configSchema.findOne({ _id: interaction.guild.id })
			const levelRole = await lvlSchema.find({ idServer: interaction.guild.id })
			const roleRegister = config.register

				const servidor = client.guilds.cache.get(config._id)
				const membro = servidor.members.cache.get(e)
				membro.roles.remove(roleRegister).then(() => {
							}).catch(e => {
					let avisoRole = new Discord.MessageEmbed()
							.setColor('#ffff00')
							.setTitle('⚠️ Without permission')
							.setDescription(`> Reasons:\n- Member above the bot\n- Bot is not allowed to withdraw the role`)
						interaction.channel.send({ embeds: [avisoRole], ephemeral: true, fetchReply: false})
					})
			
			await levelRole.forEach(async (l, i) => {

				const userLLLBB = `${interaction.guild.id}-${e}`
				const userPoints = await userSchema.findOne({ _id: userLLLBB })

				const servidor = client.guilds.cache.get(config._id)
				const membro = servidor.members.cache.get(e)
					membro.roles.remove(l._id).then(() => {
							}).catch(e => {
					return;
					})

			})
			setTimeout(tempoDecorrido, 1000);
		}
//====================Termina aqui====================//








//====================Inicia aqui====================//
async function tempoDecorrido() {
	var fim = new Date().getTime();
	var tempo = fim - inicio;

}
module.exports = {
	roles: roles,
	tempoDecorrido: tempoDecorrido
};
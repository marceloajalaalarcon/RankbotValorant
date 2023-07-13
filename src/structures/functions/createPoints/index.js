const Discord = require('discord.js')
const { mongo, userSchema, configSchema, lvlSchema, roomSchema } = require('../../database')
const date = require('date-and-time')
//só deus sabe como funciona!

var inicio;
async function ponto(interaction, client, result) {
inicio = new Date().getTime();
	const config = await configSchema.findOne({ _id: interaction.guild.id })
	const team = await roomSchema.findOne({ _id: interaction.channel.id })

	var teamVencedor 
	var teamPerdedor
	
	if(result === 'a'){
		var teamVencedor = await team.people.teamA
		var teamPerdedor = await team.people.teamB
	}else if(result === 'b'){
		var teamVencedor = await team.people.teamB
		var teamPerdedor = await team.people.teamA
	}

	await teamVencedor.forEach(async (e, i) => {
		const userLLL = `${interaction.guild.id}-${e}`
 		const people = await userSchema.findOne({ _id: userLLL })

		const points_user_lvl = parseInt(people.userData.points)
		const points_lvl = await lvlSchema.findOne({$and: [{lvl: {$lte: points_user_lvl}}, {idServer: `${interaction.guild.id}`}]})
		var count_extra_points
		if(!points_lvl) {
			count_extra_points = 0
		} else if(points_lvl){
			count_extra_points = points_lvl.extra_points
		}
		
			const peopleUserIDV = people._id
  		const peopleIDV = peopleUserIDV.split('-')
		if (!people) return;

		const pontos = parseInt(people.userData.points) + parseInt(10) + parseInt(count_extra_points)
		const winner = parseInt(people.userData.win) + parseInt(1) 
		await userSchema.findOneAndUpdate({ _id: userLLL }, {$push: {history: `won day: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}, in the channel: #${interaction.channel.name}\nPoints received: ${pontos}`}, $set: {'userData.win': winner, 'userData.points': pontos}})

		const nickANDlevel = await userSchema.findOne({ _id: userLLL })
		let servidor = client.guilds.cache.get(config._id);
		let membro = servidor.members.cache.get(peopleIDV[1]);
		if (!membro) {
			return;
		}
		
		membro.setNickname(`[${nickANDlevel.userData.points}] ${nickANDlevel.nick}`).then(() => {
		}).catch(async (e) => {
			return

		})
		
		levels(interaction, client,e)
	})
	//========================= TIME QUE PERDEU =========================
	await teamPerdedor.forEach(async (e, i) => {
	const userLLLBB = `${interaction.guild.id}-${e}`
		const peopleP = await userSchema.findOne({ _id: userLLLBB })
			const peopleUserID = peopleP._id
  		const peopleID = peopleUserID.split('-')
		if (!peopleP) return;

		const pontos = parseInt(peopleP.userData.points) - parseInt(10)
		const lose = parseInt(peopleP.userData.lose) + parseInt(1)
	await userSchema.findOneAndUpdate({ _id: userLLLBB }, {$push: {history: `lost day: ${date.format(new Date(), 'DD/MM/YYYY HH:mm')}, in the channel: #${interaction.channel.name}\nPoints received: ${pontos}`}, $set: {'userData.lose': lose, 'userData.points': pontos}})

		const nickANDlevel = await userSchema.findOne({ _id: userLLLBB })
		let servidor = client.guilds.cache.get(config._id);
		let membro = servidor.members.cache.get(peopleID[1]);
		if (!membro) {
			return;
		}

		membro.setNickname(`[${nickANDlevel.userData.points}] ${nickANDlevel.nick}`).then(() => {
		}).catch(async (err) => {
			return
			//console.log(err)
			//servidor.members.cache.get(servidor.ownerId).setNickname(`[${nickANDlevel.points}] ${nickANDlevel.nick}`)
		})
		levels(interaction, client,e)
	})
setTimeout(tempoDecorrido, 1000);
}
//====================Termina aqui====================//








//====================Inicia aqui====================//
		async function levels( interaction, client , e) {
			inicio = new Date().getTime();
		const config = await configSchema.findOne({ _id: interaction.guild.id })
			const levelRole = await lvlSchema.find({ idServer: interaction.guild.id })

			await levelRole.forEach(async (l, i) => {

				const userLLLBB = `${interaction.guild.id}-${e}`
				const userPoints = await userSchema.findOne({ _id: userLLLBB })
				const chack = parseInt(userPoints.userData.points) >= parseInt(l.lvl)

				
				const nickANDlevel = await userSchema.findOne({ _id: userLLLBB })
				const servidor = client.guilds.cache.get(config._id)
				const membro = servidor.members.cache.get(e)
				
			if (!chack) {
				membro.roles.remove(l._id).then(() => {
						}).catch(e => {
							return
						})
				
				}else{

					if (!membro) {
						return;
					}
				const targetRole = interaction.guild.roles.cache.find(r => r.id === l._id)

				if (!targetRole) {
					console.log('mo gay: ' + targetRole)
					console.log('ku: ' + !targetRole)
				} else {
					if (!membro.roles.cache.has(l._id)) {
						membro.roles.add(l._id).then(() => {
						}).catch(e => {
							return
						})
					} 
				}
			}
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
	ponto: ponto,
	//pontoB: ponto,
	tempoDecorrido: tempoDecorrido
};
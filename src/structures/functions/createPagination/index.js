const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')
const { transparent } = require('../../../utils/colors')

	const pagination = async (interaction, { message, content }) => {

	const backButton = new ButtonBuilder({
		style: ButtonStyle.Primary,
		label: 'Back',
		emoji: '⬅️', //Bota emojizin pro lado UNICODE
		customId: 'back'
	})

	const fowardButton = new ButtonBuilder({
		style: ButtonStyle.Primary,
		label: 'Foward',
		emoji: '➡️', //Bota emojizin pro lado dnv UNICODE
		customId: 'foward'
	})

	let currentIndex = 0
	let pagesNumbers = 10
	let page = 0
	

	const generateEmbed = async (start) => {
		const currentPage = content.slice(start, start + pagesNumbers)

		return new EmbedBuilder({
			title: message
				.replace('{start}', page + 1)
				.replace('{end}', Math.ceil(content.length / pagesNumbers)),
			description: `\`\`\`js\n${currentPage.map(h => `${h}`).join('\n==============================\n')}\n\`\`\`\n`,
			color: transparent
		})
	}

	const canFitOnOnePage = content.length <= pagesNumbers
	const embedMessage = await interaction.followUp({
		embeds: [await generateEmbed(0)],
		components: canFitOnOnePage ? []
		: [new ActionRowBuilder({ components: [fowardButton] })],ephemeral: false, fetchReply: false,
	})

	if (canFitOnOnePage) return

	const collector = embedMessage.createMessageComponentCollector({
		filter: (c) => c.user.id === interaction.user.id,
		time: (3 * 60) * 1000
	})
	
	collector.on('collect', async i => {
		i.customId === 'back' ? (currentIndex -= pagesNumbers) : (currentIndex += pagesNumbers)

		if (i.customId === 'back') {
			page -= 1
		} else {
			page += 1
		}

		await i.update({
			embeds: [await generateEmbed(currentIndex)],
			components: [
				new ActionRowBuilder({
					components: [
						...(currentIndex ? [backButton] : []),
						...(currentIndex + pagesNumbers < content.length ? [fowardButton] : [])
					]
				})
			]
		})
	})
}

module.exports = pagination
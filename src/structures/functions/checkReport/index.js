const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js')

const checkReport = async (interaction, { message, content }) => {
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
	let page = 0
	let pageNumbers = 5

	const generateEmbed = async (start) => {
		const currentPage = content.slice(start, start + pageNumbers)

		return new EmbedBuilder({
			title: message
				.replace('{start}', page + 1)
				.replace('{end}', Math.ceil(content.length / pageNumbers)),
			description: `\`\`\`js\n${currentPage.map(h => `${h}`).join('\n==========================\n')}\n\`\`\`\n`,
			color: 0x2f3136
		})
	}

	const canFitOnOnePage = content.length <= pageNumbers
	const embedMessage = await interaction.followUp({
		ephemeral: true, fetchReply: false,
		embeds: [await generateEmbed(0)],
		components: canFitOnOnePage ? []
		: [new ActionRowBuilder({ components: [fowardButton] })]})

	if (canFitOnOnePage) return

	const collector = embedMessage.createMessageComponentCollector({
		filter: (c) => c.user.id === interaction.user.id,
		time: (3 * 60) * 1000
	})
	
	collector.on('collect', async i => {
		i.customId === 'back' ? (currentIndex -= pageNumbers) : (currentIndex += pageNumbers)

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
						...(currentIndex + pageNumbers < content.length ? [fowardButton] : [])
					]
				})
			]
		})
	})
}

module.exports = checkReport
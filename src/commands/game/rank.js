const { 
	mongo,  
	userSchema, 
} = require('../../structures/database');
const { join } = require('path')
const { loadImage, createCanvas, GlobalFonts } = require("@napi-rs/canvas")
GlobalFonts.registerFromPath(join('src', 'utils', 'canvas', 'fontpuristabold', 'puristabold.ttf'), 'Poppins Black')
const { 
	ApplicationCommandOptionType,
	AttachmentBuilder
} = require("discord.js");
const { createPagination } = require('../../structures/functions');

module.exports ={
	name: 'rank',
	description: 'top 5 players',
	options: [
		{
			name: 'player',
			description: 'Rank for player',
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: 'global',
					description: 'Show global player rank',
					type: ApplicationCommandOptionType.Subcommand,
				},
				{
					name: 'server',
					description: 'Show server player rank',
					type: ApplicationCommandOptionType.Subcommand,
				}
			]
		}
],
run : async (client, interaction) => {
//organize and search the points
	await interaction.deferReply()
	await mongo().then(async (mongoose) => {
			userSchema.find().sort([
        ['userData.points', 'descending']
      ]).exec(async(err, res) => {
//create the dimensions of the image, and set it to 2d
  const canvas = await createCanvas(1027, 1025);
  const ctx = canvas.getContext('2d');

//generate the background
  const rank = await loadImage("https://media.discordapp.net/attachments/767892690192695336/938633841281753208/IMG_20220202_231532.png");
  ctx.drawImage(rank, 0, 0, canvas.width, canvas.height)
				 
//defines the positions of names and points
const matrixNames = [
    [ 235, 333 ],
    [ 235, 473 ],
    [ 235, 620 ],
    [ 235, 761 ],
    [ 235, 907 ]
]

const matrixPoints = [
		[707, 333],
		[707, 473],
		[707, 620],
		[707, 761],
		[707, 907]
]

//set the text font
		ctx.textAlign = 'left'
		ctx.font = '35px Poppins Black'
		ctx.fillStyle = '#ffffff'


//check which command was used
if(interaction.options.getSubcommandGroup(false) === 'player') {
if(interaction.options.getSubcommand() === 'global'){

//putting the points in the "target" variable organizes the points
let target = [ ...res ]

target.sort((a, b) => b.userData.points-a.userData.points)
	
//check that the result is no more than 5 players
	const verificar = 5 > target.length
	var limitLop
			
	if(verificar === false){
		limitLop = 5
	} else {
		limitLop = target.length
	}
	
	//generates the image, with the information collected
for (let i = 0; i < limitLop; i++) {
	
    ctx.fillText(target[i].nick, matrixNames[i][0], matrixNames[i][1])
    ctx.fillText(kFormatter(target[i].userData.points), matrixPoints[i][0], matrixPoints[i][1])
	
 	}
		ctx.textAlign = 'left'
		ctx.font = '25px Poppins Black'
		ctx.fillStyle = 'rgb(207, 48, 75)'
		ctx.fillText('GLOBAL', 235, 257)

	const rankGlobal = await canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
	const attach = new AttachmentBuilder(rankGlobal, {name: `rankGlobal.png`})
	 await interaction.editReply({files: [attach], fetchReply: true}).catch(err => {
		return
	});
	}

//=====================================================================
//=====================================================================
//=====================================================================				 
if(interaction.options.getSubcommand() === 'server'){
	
//putting the points in the "target" variable organizes the points
let target = [ ...res ]
const final = target
	
//checks if the server is the same where the command was called
var array = []
for (const user of final) {
  const userId = user._id
  const userServer = userId.split('-')

  if (userServer[0] === interaction.guild.id) {
     array.push(user)
  }
}

array.sort((a, b) => b.userData.points-a.userData.points)
	
//check that the result is no more than 5 players
const verificar = 5 > array.length
	var limitRes
			
	if(verificar === false){
		limitRes = 5
	} else {
		limitRes = array.length
	}
	//generates the image, with the information collected				 
for (let i = 0; i < limitRes; i++) {
	
    ctx.fillText(array[i].nick, matrixNames[i][0], matrixNames[i][1])
    ctx.fillText(kFormatter(array[i].userData.points), matrixPoints[i][0], matrixPoints[i][1])
		
 	}
		ctx.textAlign = 'left'
		ctx.font = '25px Poppins Black'
		ctx.fillStyle = 'rgb(207, 48, 75)'
		ctx.fillText('SERVER', 235, 257)
	
	const rankServer = await canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE })
	const attach = new AttachmentBuilder(rankServer, {name: 'rankServer.png'})
	await interaction.editReply({files: [attach], fetchReply: true}).catch(err => {
		return
	});
	
			}
			}
		})
	})
}
}
//convert the points with the symbols example: 1, 1k, 1L...
var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function kFormatter(number) {

 var tier = Math.log10(Math.abs(number)) / 3 | 0;
 if(tier == 0) return number;
 var suffix = SI_SYMBOL[tier];
 var scale = Math.pow(10, tier * 3);
 var scaled = number / scale;
 return scaled.toFixed(1) + suffix;

}
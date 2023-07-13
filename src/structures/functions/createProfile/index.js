const { 
	mongo, 
	userSchema,
	staffSchema, 
} = require('../../database');
const { request } = require('undici');
const { loadImage, createCanvas, GlobalFonts } = require("@napi-rs/canvas")
GlobalFonts.registerFromPath('src/utils/canvas/Valorant-Font/Valorant-Font.ttf', 'Valorant-Font')

	const width = 1000
	const height = 1000

async function createProfile(client,interaction, user_id_member, users) {
	
const	canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d")
//get the user's profile picture
	const { body } = await request(client.users.cache.get(user_id_member).displayAvatarURL({ extension: 'jpg' }));

	const avatar = await loadImage(await body.arrayBuffer())
ctx.drawImage(avatar, 679, 120, 204, 204);

//load profile background
const background = await loadImage("https://cdn.discordapp.com/attachments/767892690192695336/987144787687788565/1655424050971.png");
		ctx.drawImage(background, 0, 0, width, height);
		
const calc = parseInt(users.userData.win) + parseInt(users.userData.lose)

				
const detalhes = [
	[users.userData.win, 275, 556],
	[calc, 275, 772],
	[users.userData.lose, 713, 556],
	[users.userData.points, 720, 772]
]

	ctx.font = '60px Valorant-Font';
	ctx.fillStyle = "rgb(253, 255, 252)";
	ctx.fillText(`${users.nick}`, 85, 264);

const chack_Staff = `${interaction.guild.id}-${user_id_member}`
const staff_perm = await staffSchema.findOne({_id: chack_Staff})
				
var status
var color

	if(staff_perm === null){
	
			color = "rgb(89,89,89)"
			status = 'member'
	} else{
	
	switch (staff_perm.perm) {
		case 'superuser': 
			color = 'rgb(169, 255, 0)'
			status = `${staff_perm.perm}`
		break;
		case 'admin':
			color = 'rgb(0, 255, 236)'
			status = `${staff_perm.perm}`
		break;
		case 'moderador':
			color = 'rgb(49, 84, 255)'
			status = `${staff_perm.perm}`
		break;
		default:
				status = 'member'
				color = "rgb(89, 89, 89)";
	}
	}
	ctx.font = '30px Valorant-Font';
	ctx.fillStyle = color;
	ctx.fillText(`${status}`, 85, 296);

  ctx.textAlign = 'center'
	ctx.font = '110px Valorant-Font';
	
				
for (let i = 0; i < 4; i++) {
if(detalhes[i][0] === users.points){
	if(Math.sign(users.points) === -1){
		corIndent = "rgb(179, 0, 0)"
	}else{
		corIndent = "rgb(253, 255, 252)"
	}
}else{
	corIndent = "rgb(253, 255, 252)"
}
	ctx.fillStyle = corIndent
	ctx.fillText(`${kFormatter(detalhes[i][0])}`.substr(0, 11), detalhes[i][1], detalhes[i][2]);

}		
	
	return canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE });
	
}

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function kFormatter(number) {

 var tier = Math.log10(Math.abs(number)) / 3 | 0;
 if(tier == 0) return number;
 var suffix = SI_SYMBOL[tier];
 var scale = Math.pow(10, tier * 3);
 var scaled = number / scale;
 return scaled.toFixed(1) + suffix;

}

module.exports = createProfile

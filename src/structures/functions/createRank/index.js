const { loadImage, createCanvas, GlobalFonts } = require("@napi-rs/canvas");
GlobalFonts.registerFromPath('src/utils/canvas/Valorant-Font/Valorant-Font.ttf', 'Poppins Black');

async function createRank(target, kFormatter) {
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

    return canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE });

}
module.exports = createRank
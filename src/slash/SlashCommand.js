let slash = []
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Slash Commands")
	.setAlign(0, ascii.CENTER)
	.setAlign(1, ascii.CENTER);
table.setHeading('Command name', 'Status');


module.exports = async(client) => {

    readdirSync("./src/commands/").forEach(dir => {
        const commands = readdirSync(`./src/commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
				
          let pull = require(`../commands/${dir}/${file}`)

				if(pull.name){
					client.slashCommands.set(pull.name, pull)
		      slash.push(pull)
					table.addRow(file, '✔️');
				}else{
					table.addRow(file, '❌');
          continue;
				}

        }
    });
    client.on("ready", async () => {
      await client.application.commands.set(slash);
		console.log(`${table.toString()}\n${slash.length} commands registered`);		
    })
}
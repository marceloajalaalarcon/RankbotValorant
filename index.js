require('./server')
const config= require('./config.js')
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs')

const client = new Client({ intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences
	], 
		partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember] });

module.exports = client;

client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require('./config.js');

['events', 'SlashCommand', 'antiCrash'].forEach(handler => {
	require(`./src/slash/${handler}`)(client);
})

client.once('ready', ()=> {

//put here

	console.log(`[READY] ${client.user.tag} is ready`)
})

// process.on('unhandleRejection', err => {
// 	console.log(`[ERROR] Unhandled promise rejection: ${err.message}`);
// 	console.log(err)
// })

// client
// .on("debug", console.log)
// .on("warn", console.log)
// .on("erro", console.log)

client.login(config.token)
const { Client } = require('discord.js');
const fs = require('fs');
const { functions } = require('./forExport.js');

let token = fs.readFileSync('token.txt', 'utf8');

const bot = new Client();
const BOT_TOKEN = token;
bot.login(BOT_TOKEN);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on('message', message => {
	
	//ignoring bot messages
	if (message.author.bot) return;

	//ignoring messages without '!' prefix
	if (!message.content.startsWith('!')) return;


	let command = message.content;
	command.toLowerCase();

	//main for commands
	switch (command) {
		case "!e" || "!exercises":
			message.channel.send("No exercises currently uploaded");
	}
});
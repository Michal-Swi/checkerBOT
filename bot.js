const { Client } = require('discord.js');
const fs = require('fs');
const { functions } = require('./forExport.js');
const path = require('path');

let token = fs.readFileSync('token.txt', 'utf8');
const bot = new Client();


const BOT_TOKEN = token;
bot.login(BOT_TOKEN);


bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});


function isPDF(file) {
    if (file[file.length - 1] == 'f' && file[file.length - 2] == 'd' 
        && file[file.length - 3] == 'p' && file[file.length - 4] == '.') {
        return true;
    }
    return false;
}

bot.on('message', message => {
	
	//ignoring bot messages
	if (message.author.bot) return;

	console.log(message.content);

	//ignoring messages without '!' prefix
	if (!message.content.startsWith('!')) return;


	let command = message.content;
	command.toLowerCase();


	//uploading an exercise is not treated as a normal command
	if (message.content.startsWith('!u') || message.content.startsWith('!upload')) {
		if (message.attachments.size === 0) {
			message.channel.send('No exercise to upload');
		} else if (message.attachments.size > 1) {
			message.channel.send('One exercise can be uploaded at once');
		} else if (message.attachments.size === 1) {
			let file = message.attachments.first().name;

			console.log(file);

			let i = isPDF(file);
			console.log(i);
		}
	}
		

	//main for commands
	switch (command) {
		
		//list of exercises
		case "!e" || "!exercises":
			message.channel.send("No exercises currently uploaded");
			break;

	}
});
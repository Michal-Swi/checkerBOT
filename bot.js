const { Client } = require('discord.js');
const fs = require('fs');
const functions = require('./forExport.js');
const path = require('path');
const request = require('request');

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

	//logging command
	let date = new Date();
	fs.appendFileSync('savedData.txt', message.author.username + ' ' + command + ' ' + date + '\n', 'UTF-8', {'flags': 'a'});

	//main for commands
	switch (command) {
		
		//list of exercises
		case "!e":
			message.channel.send("No exercises currently uploaded");
			break;
		case "!exercises":
			message.channel.send("No exercises currently uploaded");
			break;
		case "!u":
			if (!functions.delayUploading(message, message.guild.id)) {
				message.channel.send('Not enough time has passed since the last upload');
				break;
			}

			functions.uploadCommand(message);
			break;
		case "!upload":
			if (!functions.delayUploading(message, message.guild.id)) {
				message.channel.send('Not enough time has passed since the last upload');
				break;
			}
			
			functions.uploadCommand(message);
			break;
	}
});
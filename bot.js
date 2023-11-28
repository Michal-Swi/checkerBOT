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

	//uploading an exercise is not treated as a normal command
	if (message.content.startsWith('!u') || message.content.startsWith('!upload')) {
		if (message.attachments.size === 0) {
			message.channel.send('No exercise to upload');
		} else if (message.attachments.size > 1) {
			message.channel.send('One exercise can be uploaded at once');
		} else if (message.attachments.size === 1) {
			let file = message.attachments.first();

			if (file.size > 200000) {
				message.channel.send('File size is too large');
				return;
			}

			if (!functions.isPDF(file.name)) {
				message.channel.send('Bot only accepts PDF files');
				return;
			}

			functions.uploadExercise(file.url, file.name, message.guild.id);
		}
	}
		

	//main for commands
	switch (command) {
		
		//list of exercises
		case "!e":
			message.channel.send("No exercises currently uploaded");
			break;
		case "!exercises":
			message.channel.send("No exercises currently uploaded");
			break;
	}
});
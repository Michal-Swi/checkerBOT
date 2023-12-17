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


async function makeSend(list, message) {
   let send = 'Exercises currently uploaded: \n';

  for (let i = 0; i < list.length; i++) {
    send += (i + 1) + '. ';
    send += list[i]; 
    send += '\n';
  }
    
  message.channel.send(send);   
}

async function upload(message) {
	if (!functions.delayUploading(message, message.guild.id)) {
		message.channel.send('Not enough time has passed since the last upload');
	} else {
		const temp = functions.uploadCommand(message);

		if (temp == 4) {
			message.channel.send('File uploaded correctly!');
		} else if (temp == 5) {
			message.channel.send('Such file already exists');
		}
	}
}

async function uploadTemplate(message) {
	if (message.attachments.size !== 1) {
		message.channel.send('The correct number of attachment is one.');
	}

	console.log(functions.isCode(message));
}

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
	if (command === '!u' || command === '!upload') {
		upload(message);
	} else if (command === '!e' || command === '!exercises') {
		const list = functions.listExercises(message.guild.id);
		if (list === false || list === undefined) {
			message.channel.send('what(): Exercises?');
		} else {
			makeSend(list, message);
		}
	} else if (command === '!ut' || command == '!uploadtemplate') {
		uploadTemplate(message);
	}
});
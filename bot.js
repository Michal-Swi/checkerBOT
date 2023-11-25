const { Client } = require('discord.js');
const fs = require('fs');
const functions = require('./forExport.js');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

let token = fs.readFileSync('token.txt', 'utf8');
const bot = new Client();

const log = new sqlite3.Database('log.db');

//making the log databse
log.run(`
  CREATE TABLE IF NOT EXISTS commands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userUsername TEXT,
    command TEXT,
    timestamp TEXT
  )
`);



//I killed readability by this I know but I wanted the database to be in one file with the bot
function logCommand(userUsername, command) {
  const timestamp = new Date().toISOString();

  log.run(
    'INSERT INTO commands (userUsername, command, timestamp) VALUES (?, ?, ?)',
    [userUsername, command, timestamp],
    (err) => {
      if (err) {
        console.error('ERROR NOT FATAL: ', err);
      } else {
        console.log('LOG UPDATED: ', command);
      }
    }
  );
}



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
	logCommand(message.author.username, message.content);

	let command = message.content;
	command.toLowerCase();


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

			message.channel.send('Uploading the exercise...');
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
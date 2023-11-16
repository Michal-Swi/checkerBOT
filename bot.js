const { Client } = require('discord.js');
const fs = require('fs');

let token = fs.readFileSync('token.txt', 'utf8');

const bot = new Client();
const BOT_TOKEN = token;
bot.login(BOT_TOKEN);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});
import os
import discord

from discord.ext import commands 

intents = discord.Intents.default()

with open("token.txt", "rb") as file:
	TOKEN = file.read().decode('utf-8')
print(TOKEN)

bot = discord.Client(intents = intents)

@bot.event
async def on_ready():
	print('Bot is online')

@bot.event
async def on_message(message):
	if (message.content == "!ping"):
		print('chuj lol')

bot.run(TOKEN)
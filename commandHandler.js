const functions = require('./forExport.js');
const fs = require('fs');

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
	console.log(message.attachments.size);

	if (!functions.delayUploading(message, message.guild.id)) {
		message.channel.send('Not enough time has passed since the last upload');
	} 
	else if (message.attachments.size !== 1) {
		message.channel.send('Invalid attachment size!'); 
	} else {
		const temp = functions.uploadCommand(message);

		if (temp == 4) {
			message.channel.send('File uploaded correctly!');
		} else if (temp == 5) {
			message.channel.send('Such file already exists');
		}
	}
}




// Written whithout testing it once, test later!!! 
async function uploadTests(message) {
	if (message.attachments.size !== 1) {
		message.channel.send('Invalid amount of attachments!');
		return;
	}
	
	if (message.attachments.first().size > 10000) {
		message.channel.send('File too big!');
		return;
	}

	const name = functions.fileName(message.content);
	if (!name) {
		message.channel.send('Invalid file name!');
		return;
	}

	const isNameCorrect = functions.specialCharacters(name);
	if (!isNameCorrect) {
		message.channel.send('Invalid file name! Consider removing special characters!');
		return;
	}
        
	const uploadingSuccessful = functions.uploadTests(message, extension, );
}	





async function printExercise(message) {
	const directory = message.guild.id;
	const fileName = functions.fileName(message);

	if (!fileName) {
		message.channel.send('Invalid file name');
		return;
	}

	if (!functions.exerciseExists(fileName, message.guild.id)) {
		message.channel.send('Exercise does not exist');
		return;
	}

	let exercise = '<@' + message.author.id + '> exercise: ' + fileName + '\n';
	exercise += functions.readExercise(message.guild.id, fileName);

	message.channel.send(exercise);
}

async function deleteExercise(message) {
	const exercise = functions.fileName(message);

	if (!functions.exerciseExists(exercise, message.guild.id)) {
		message.channel.send('No exercise to delete');
		return;
	}

	functions.deleteDirectory(exercise, message);
	message.channel.send('File deleted correctly');
}

async function commandHandler(message) {

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
		functions.returnToDeafultDir();

		if (list === false || list === undefined) {
			message.channel.send('what(): Exercises?');
		} else {
			makeSend(list, message);
		}

	} else if (command.startsWith('!printexercise') || command.startsWith('!pe')) {
		printExercise(message);

	} else if (command.startsWith('!de') || command.startsWith('!deleteexercise')) {
		deleteExercise(message);
	} else if (command.startsWith('!ut') || command.startsWith('!uploadtests') {
		uploadTests(message);
	}
}

module.exports = {
	commandHandler,
};

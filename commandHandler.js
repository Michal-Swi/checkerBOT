const functions = require('./forExport.js');
const fs = require('fs');
const { execSync } = require('child_process');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();

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



// Checks if attachment meets safety conditions and returns true or false.
function attachmentChecker(message, size, amount) {
	// Veryfied guilds bypass the safety conditions.
	if (functions.isVeryfied(message.guild.id)) {
		return true;
	}

	console.log(message.attachments.size);
	if (message.attachments.size !== amount) {
		message.channel.send('Invalid amount of attachments!');
		return false;
	}

	console.log(message.attachments.first().size);

	// Large files may cause safety issues
	if (message.attachments.first().size > size) {
		message.channel.send('File too large!');
		return false;
	}

	// Checks if there are any spaces in the name.
	const name = functions.fileName(message);

	if (!name) {
		message.channel.send('Invalid file name!');
		return false;
	}

	// Checks whether the file name contains unwanted special characters.
	const isNameCorrect = functions.specialCharacters(name);

	if (!isNameCorrect) {
		message.channel.send('Invalid file name! Consider removing special characters!');
		return false;
	}

	// All conditions were met.
	return true;
}



// Uploads manualy written test cases.
async function uploadTestsCommand(message) {
	if (!attachmentChecker(message, 10000, 1)) {
		return;
	}

	// const uploadingSuccessful = functions.uploadTests(message, extension, );
}	




async function uploadTemplate(message) {
	if (!attachmentChecker(message, 20000, 1)) {
		return;
	}

	// Template can cause problems while renaming 
	if (message.attachments.first().name === 'template') {
		message.channel.send('Invalid attachment name! "template" name is forbidden!');
		return;
	}

	// Double check but better safe than sorry!
	const exerciseName = functions.fileName(message);
	if (!exerciseName) {
		message.channel.send('Invalid file name!');
		return;
	}

	const executedCorrectly = functions.goToExerciseDirectory(message.guild.id, exerciseName);
	console.log(executedCorrectly);

	if (!executedCorrectly) {
		message.channel.send('Exercise doesnt exist!');
		functions.returnToDeafultDir();
		return;
	}

	// Downloading the exercise
	execSync('curl -o ' + message.attachments.first().name + ' ' + message.attachments.first().url);	

	// Renaming the template name to 'template'.
	execSync('mv ' + message.attachments.first().name + ' template.cpp');

	functions.returnToDeafultDir();
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
	} else if (command.startsWith('!ute') || command.startsWith('!uploadtemplate')) {
		uploadTemplate(message);
	} else if (command.startsWith('!ut') || command.startsWith('!uploadtestcases')) {
		uploadTestsCommand(message);
	}
}

module.exports = {
	commandHandler,
};

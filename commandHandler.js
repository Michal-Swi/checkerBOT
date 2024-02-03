const fs = require('fs');
const functions = require('./forExport.js');
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
	if (!attachmentChecker(message, 1000, 1)) {
		return;
	}

	if (message.attachments.first().name !== 'input.txt') {
		message.channel.send('Tests can only be named input.txt');
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

	try {
		execSync('rm input.txt');
	} catch (e) {
		console.error(e);
	}

	// Downloading the tests.
	execSync('curl -o ' + message.attachments.first().name + ' ' + message.attachments.first().url);	
	message.channel.send('Tests uploaded successfully!');

	const input = fs.readFileSync('input.txt', 'utf-8');
  const inputSorted = input.split('\n').map(String);
	
	const correctContents = functions.checkContentsOfTests(inputSorted);
	console.log(correctContents);

	if (correctContents !== true) {
		message.channel.send('Makefile file was not created correctly! Invalid contents of the input file! Consider removing this character: ' + correctContents);
		return;
	}

	const writingToMakefileExecutedCorrectly = functions.createMakeFile(inputSorted);
	if (!writingToMakefileExecutedCorrectly) {
		message.channel.send('The tests uploaded successfully, but makefile file was not created, try again.');
	} else {
		message.channel.send('Makefile was created successfully!');
	}

	functions.returnToDeafultDir();
}	




async function uploadTemplate(message) {
	if (!attachmentChecker(message, 20000, 1)) {
		return;
	}

	console.log(message.attachments.first());
	console.log(functions.messageExtension(message.attachments.first().name));

	// Template can cause problems while renaming 
	if (message.attachments.first().name === 'template.cpp') {
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

	// Deleting previous template
	try {
		execSync('rm template.cpp');
	} catch (e) {
		console.error(e);
	}

	// Downloading the exercise
	execSync('curl -o ' + message.attachments.first().name + ' ' + message.attachments.first().url);	

	// Renaming the template name to 'template'.
	execSync('mv ' + message.attachments.first().name + ' template.cpp');

	try {
		execSync('g++ template.cpp');
	} catch (err) {
		message.channel.send('The template doesnt compile, remove it');
		try {
			execSync('rm template.cpp');
		} catch (err) {
			
		}

		message.channel.send('Template removed');
		console.error(err);
	}

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





async function uploadSolution(message) {
	if (!attachmentChecker(message, 20000, 1)) {
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



	// Deleting previous answer
	try {
		execSync('rm ' + message.author.name + '.cpp');
	} catch (e) {
		console.error(e);
	}

	try {
		execSync('curl -o ' + message.author.username + '.cpp ' + message.attachments.first().url);
	} catch (err) {
		console.error(err);
		message.channel.send('FATAL ERROR: FILE WAS NOT UPLOADED');
		
		process.exit(5);
		return;
	}

	message.channel.send('The solution was uploaded successfully!');

	// Trying to compile the downloaded code
	try {
		execSync('g++ ' + message.author.name + '.cpp');
	} catch (err) {
		console.error(err);

		message.channel.send('The solution did not compile and returned the following error: ' + err);

		try {
			execSync('rm ' + message.author.username + '.cpp');
		} catch (err) {
			console.error(err);
			
			message.channel.send('The file wasnt deleted FATAL ERROR');
			
			process.exit(5);
			return;
		}

		message.channel.send('File deleted successfully!');
		return;
	}

	functions.returnToDeafultDir();
}




async function () {}




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
	} else if (command.startsWith('!us') || command.startsWith('!uploadsolution')) {
		uploadSolution(message);
	} else if (command.startsWith('!ts') || command.startsWith('!testsolution')) {
		testSolution(message);
	}
}

module.exports = {
	commandHandler,
};

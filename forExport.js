const { execSync } = require('child_process');
const fs = require('fs');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();

//REMINDER make it a db
let delay = new Map();

function returnToDeafultDir() {
    process.chdir(deafultDir);
}

function readExercise(guildId, exerciseName) {
    process.chdir('servers/');
    process.chdir(guildId + '/');
    process.chdir(exerciseName);
    
    const exercise = fs.readFileSync(exerciseName);
    returnToDeafultDir();

    return exercise;
}

//REMINDER make it a db not a txt file idiot
function isVeryfied(guildId) {
    const guilds = fs.readFileSync('veryfiedGuilds.txt', 'utf-8');

    const guildsId = guilds.split('\n').map(String);
    
    //guild id can go over the number limit I think
    guildId = guildId.toString();

    console.log(guildId, ' ', guildsId, ' ', guildsId.includes(guildId));

    return guildsId.includes(guildId);
}

//anti - flood
function delayUploading(message, guildId) {  
    if (isVeryfied(guildId)) {
        console.log('Guild is veryfied');
        return true;
    }
    
    const now = Date.now();
    
    if (!isNaN(delay[message.author.id])) {
        if ((((now - delay[message.author.id]) / 1000) / 60) > 30) {
            console.log('Delay passed, uploading...');
            delay[message.author.id] = now;
            return true;
        } else {
            console.log('Not enough time has passed');
            console.log('Only', ((now - delay[message.author.id]) / 1000), 'seconds have passed');
            return false;
        }
    }

    console.log('First exercise uploaded, setting up the delay..., uploading...');
    delay[message.author.id] = now;
    return true;
}

function messageExtension(file) {
    let extension = '';

    console.log(file);
    for (let i = file.length - 1; i >= 0; i--) {
        if (file[i] !== '.') {
            extension = file[i] + extension;
        } else if (file[i] === '.') {
            return extension;
        }
    }

    return -1;
}

function nothing() {

}

function downloadMake(url, fileName, guildId, extension) {
    const download = url + '\n' + fileName;

    returnToDeafultDir();

    execSync('g++ download.cpp');

    console.log('writing to file');
    fs.writeFileSync('input.txt', download);
    
    console.log('c++ with input');
    execSync('./a.out input.txt');

    console.log('moving the file');
    execSync('mv ' + fileName + extension + ' ' + deafultDir + 'servers/' + guildId + '/' + fileName);
    returnToDeafultDir();
}

//cheking whether a server directory already exists
function fileExists(path) {
    try {
        if (fs.existsSync(path)) {
            //file does exist
            return true;
        }

    } catch(err) {
            //file doesnt exist
            console.error(err);
        }
    
        return false;
}


//bot only accepts pdf files
function isPDF(file) {
    if (file[file.length - 1] == 'f' && file[file.length - 2] == 'd' 
        && file[file.length - 3] == 'p' && file[file.length - 4] == '.') {
        return true;
    }
    return false;
}

function deletePDF(fileName) {
    let noPDF = '';

    for (let i = 0; i < fileName.length - 4; i++) {
        noPDF += fileName[i];
    }

    return noPDF;
}

//for uploading exercises
function uploadExercise(fileUrl, fileName, guildId) {
    console.log("Switching dir to servers/");
    process.chdir('servers/');

    if (!fileExists(guildId)) {
        console.error("Making guild directory");
        execSync('mkdir ' + guildId); //making a new server directory 
    }

    console.log("Switching dir to guild directory");
    process.chdir(guildId + '/'); //go to the server dir

    fileName = deletePDF(fileName);
    if (fileExists(fileName)) {
        console.error('Exercise already exists');
        returnToDeafultDir();
        return false;
    }

    console.log("Making exercise directory");
    execSync('mkdir ' + fileName);

    console.log('Changing exercise directory to exercise: ', fileName);
    process.chdir(fileName + '/');

    execSync('echo "' + fileUrl + '" >> ' + fileName);
    returnToDeafultDir();

    return true; 
}

function specialCharacters(fileName) {
    acceptedCharacters = ['_', '.'];

    [...fileName].forEach(character => {
        if (character.toLowerCase() !== character.toUpperCase() && 
            !acceptedCharacters.includes(character)) {
            return false;
        }
    });

    return true;
}

//handling !u and !upload command
function uploadCommand(message) {
    if (!specialCharacters(message.attachments.first().name)) {
        message.channel.send('Only accepted special characters are . and /');
        return 6;
    }

    if (message.attachments.size === 0) {
        message.channel.send('No exercise to upload');
        return 0;
    }

    if (message.attachments.size > 1) {
        message.channel.send('One exercise can be uploaded at once');
        return 1;
    }


    if (message.attachments.size === 1) {
        let file = message.attachments.first();

        if (file.size > 200000) {
            message.channel.send('File size is too large');
            return 2;
        }

        if (!isPDF(file.name)) {
            message.channel.send('Bot only accepts PDF files');
            return 3;
        }

        const exists = uploadExercise(file.url, file.name, message.guild.id);
        if (!exists) return 5;

        return 4;
    }
}

function listDir(guildId) {
    try {
        return fs.readdirSync(guildId);
    } catch (err) {
        console.error('Error');
    }
}

function listExercises(guildId) {
    console.log('Changing dir to servers');
    process.chdir('servers/');

    if (fileExists(guildId)) {
        const list = listDir(guildId);
        console.log(list);

        returnToDeafultDir();

        return list;
    } else {
        returnToDeafultDir();
        return false;
    }
}

function isCode(message) {
    const acceptedFileExtensions = ['cpp'];

    const s = message.attachments.first().name;
    const extension = messageExtension(s);

    return acceptedFileExtensions.includes(extension);
}

//name without the previous command and spaces are invalid
function fileName(message) {
    let name = '';

    let add = false;
    for (let i = 0; i < message.content.length; i++) {
        if (!add && message.content[i] === ' ') {
            add = true;
        } else if (add && message.content[i] !== ' ') {
            name += message.content[i];
        } else if (add && message.content[i] === ' ') {
            return false;
        }
    }

    return name;
}

function exerciseExists(fileName, guildId) {
    returnToDeafultDir();

    process.chdir('servers/');
    process.chdir(guildId + '/');

    const ret = fileExists(fileName);

    returnToDeafultDir();

    return ret;
}

function uploadTests(fileName, extension, guildId, exerciseName) {
    execSync('g++ download.cpp');
    
    let succes = true;
    try {
        execSync('./a.out input.txt');
    } catch (err) {
    	console.error(err);
	message.channel.send('An error has occured while downloading!');

	return false;
    }

    // Moving the file into desired directory
    execSync('mv ' + fileName + ' ' + deafultDir + 'servers/' +  + '/' )

}

// Exporting functions so that bot.js can remain clean
module.exports = {
    fileExists,
    isPDF,
    uploadExercise,
    uploadCommand,
    delayUploading,
    listExercises,
    isCode,
    fileName,
    exerciseExists,
    returnToDeafultDir,
    readExercise,
    deleteDirectory,
    messageExtension,
    specialCharacters,
};

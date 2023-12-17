const { execSync } = require('child_process');
const fs = require('fs');
const fsAsync = require('fs').promises;

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();

//REMINDER make it a db
let delay = new Map();

function returnToDeafultDir() {
    process.chdir(deafultDir);
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

function downloadMake(url, fileName, guildId) {
    const download = url + '\n' + fileName;

    returnToDeafultDir();

    console.log('writing to file');
    fs.writeFileSync('input.txt', download);
    
    console.log('c++ with input');
    execSync('./a.out input.txt');

    console.log('moving the file');
    execSync('mv ' + fileName + '.pdf ' + deafultDir + 'servers/' + guildId + '/' + fileName);
    returnToDeafultDir();
}

// exec('ls -l',
//     function (error, stdout, stderr) {
//         console.log('stdout: ' + stdout);
//         console.log('stderr: ' + stderr);
//         if (error !== null) {
//              console.log('exec error: ' + error);
//         }
//     });

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

    downloadMake(fileUrl, fileName, guildId);

    returnToDeafultDir();

    return true; 
}

//handling !u and !upload command
function uploadCommand(message) {
    if (message.attachments.size === 0) {
        message.channel.send('No exercise to upload');
        return 0;
    } else if (message.attachments.size > 1) {
        message.channel.send('One exercise can be uploaded at once');
        return 1;
    } else if (message.attachments.size === 1) {
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

    let s;

    console.log(message.attachments.first().url, ' ', message.attachments.first().size, ' ', message.attachments.first().name);
    for (let i = message.attachments.first().size - 1; i >= 0; i--) {
        if (message.attachments.first()[i] === '.') return s;
        s = message.attachments.first()[i] + s;
    }

    console.log(message.content, ' ', s);

    const r = acceptedFileExtensions.includes(s);
    console.log(r);
}

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    isPDF,
    uploadExercise,
    uploadCommand,
    delayUploading,
    listExercises,
    isCode,
};
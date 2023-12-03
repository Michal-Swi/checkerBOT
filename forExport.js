const { execSync } = require('child_process');
const fs = require('fs');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();

//REMINDER make it a databse
let delay = new Map();

function returnToDeafultDir() {
    process.chdir(deafultDir);
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

//REMINDER make it a databse not a txt file idiot
function isVeryfied(guildId) {
    const guilds = fs.readFileSync('veryfiedGuilds.txt', 'utf-8');
    
    const guildsId = guilds.split('\n').map(Number)

    let isTrue = false;

    guildsId.forEach((value, key) => {
        if (value == guildId) {
            isTrue = true;
            return;
        }
    });

    if (isTrue) return true;
    else return false;
}

function delayUploading(message, guildId) {  
    if (isVeryfied(guildId)) {
        return true;
    }

    let date = new Date();
    console.log(date.getTime());
}

//handling !u and !upload command
function uploadCommand(message) {
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

        if (!isPDF(file.name)) {
             message.channel.send('Bot only accepts PDF files');
            return;
        }

        uploadExercise(file.url, file.name, message.guild.id);
    }
}

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    isPDF,
    uploadExercise,
    uploadCommand,
};
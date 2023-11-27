const { execSync } = require('child_process');
const fs = require('fs');
const request = require('request');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();


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

//for donwloading exercises
function downloadExercise(url) {
    request.get(url)
        .on('error', console.error)
        .pipe(fs.createWriteStream(url));
}

function returnToDeafultDir() {
    execSync(deafultDir);
}

//for uploading exercises
function uploadExercise(fileUrl, fileName, guildId) {
    console.log("Switching dir to servers/");
    process.chdir('servers/');

    if (!fileExists(guildId)) {
        console.log("Making guild directory");
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

    downloadExercise(fileUrl);  
    
    returnToDeafultDir();

    return true; 
}

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    isPDF,
    downloadExercise,
    uploadExercise,
};
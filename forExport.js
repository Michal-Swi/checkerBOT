const { execSync } = require('child_process');
const fs = require('fs');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();


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
    execSync('mv ' + fileName + '.pdf ' + deafultDir + guildId + '/' + fileName);
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

uploadExercise('https://cdn.discordapp.com/attachments/987828161083482162/1179141800129208440/zadanie_Kalkulator.pdf?ex=6578b460&is=65663f60&hm=6c15ec2939b26c387f3b7df26d3cb9019484b664be554da1f124875179820260&', 'zadanie', 1);

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    isPDF,
    uploadExercise,
};
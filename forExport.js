const exec = require('child_process').exec;
const fs = require('fs');

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

//making server directory for containing exercises used in a given server
function createDir(guildId) {
    let s = guildId;

    if (fileExists(s)) {
        console.log("exists");
    } else {
         s = 'mkdir ' + s;
        exec(s);
    }
}

//bot only accepts pdf files
function isPDF(file) {
    if (file[file.length - 1] == 'f' && file[file.length - 2] == 'd' 
        && file[file.length - 3] == 'p' && file[file.length - 4] == '.') {
        return true;
    }
    return false;
}

//crucial for writing into json files
function writeToFile(data, success, fail) {
  fs.writeFile('savedData.json', JSON.stringify(data), function(error) {
    if(error) { 
        console.error(error);
    } else {
        if (success)
          success();
    }
  });
}

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    createDir,
    isPDF,
    writeToFile,
};
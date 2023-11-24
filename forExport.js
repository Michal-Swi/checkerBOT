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


//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    createDir,
};
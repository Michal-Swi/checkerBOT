const exec = require('child_process').exec;

exec('ls -l',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
    });

function createPath(guildName) {
    let s = "";
    s += trim(guildName);
    s += '.txt';

    if (fileExists(s)) {
        console.log("exists");
    } else {
         s = 'touch ' + s;
        exec(s);
    }
}

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

//exporting functions to so bot.js can remain clean
module.exports = {
    fileExists,
    createPath,
};
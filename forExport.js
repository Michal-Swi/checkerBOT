const { execSync } = require('child_process');
const fs = require('fs');

const deafultDir = fs.readFileSync('deafultdir.txt', 'utf-8').toString();

//REMINDER make it a db
// biome-ignore lint/style/useConst: <it does get reassigned I have no idea what is LSP talking about>
let  delay = new Map();

function returnToDeafultDir() {
    process.chdir(deafultDir);
}

function readExercise(guildId, exerciseName) {
    process.chdir('servers/');
    process.chdir(`${guildId}/`);
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
    const newGuildId = guildId.toString();

    console.log(guildId, ' ', guildsId, ' ', guildsId.includes(guildId));

    return guildsId.includes(newGuildId);
}

//anti - flood
function delayUploading(message, guildId) {  
    if (isVeryfied(guildId)) {
        console.log('Guild is veryfied');
        return true;
    }
        
    const now = Date.now();
    if (!Number.isNaN(delay[message.author.id])) {
        if ((((now - delay[message.author.id]) / 1000) / 60) > 30) {
            console.log('Delay passed, uploading...');
            delay[message.author.id] = now;
            return true;
        }
        
        // Function quits anyway in the if statment
        console.log('Not enough time has passed');
        console.log('Only', ((now - delay[message.author.id]) / 1000), 'seconds have passed');
        return false;
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
    if (file[file.length - 1] === 'f' && file[file.length - 2] === 'd' 
        && file[file.length - 3] === 'p' && file[file.length - 4] === '.') {
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
        execSync(`mkdir ${guildId}`); //making a new server directory 
    }

    console.log("Switching dir to guild directory");
    process.chdir(`${guildId}/`); //go to the server dir

    fileName = deletePDF(fileName);
    if (fileExists(fileName)) {
        console.error('Exercise already exists');
        returnToDeafultDir();
        return false;
    }

    console.log("Making exercise directory");
    execSync(`mkdir ${fileName}`);

    console.log('Changing exercise directory to exercise: ', fileName);
    process.chdir(`${fileName}/`);

    execSync(`echo "${fileUrl}" >> ${fileName}`);
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
        message.channel.send('Only accepted special characters are . and _');
        return 6;
    }

    if (message.attachments.first().name === 'template') {
        message.channel.send('The name "template" is forbidden!');
        return;
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
        const file = message.attachments.first();

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
    }
    
    returnToDeafultDir();
    return false;
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
    process.chdir(`${guildId}/`);

    const ret = fileExists(fileName);

    returnToDeafultDir();

    return ret;
}

function deleteDirectory(exercise, message) {
    returnToDeafultDir();

    process.chdir('servers/');
    process.chdir(`${message.guild.id}/`);

    try {
        execSync(`rm -rf ${exercise}`);
    } catch (e) {
        console.error(e);
        message.channel.send('Unexpected error: ' + e + ' FATAL');
    }

    returnToDeafultDir();
}

function goToExerciseDirectory(guildId, exerciseName) {
    returnToDeafultDir();

    process.chdir('servers/');

    try {
        process.chdir(guildId + '/' + exerciseName + '/');
    } catch (e) {
        return false; // Guild directory doesnt exist
    }

    return true; // Function executed correctly.
}

function isAlpha(character) {
    return character.toUpperCase() !== character.toLowerCase();
}

// Returns true if character is allowed.
function characterIsCorrect(character) {
    let isCorrect = false;
    if (!isNaN(character) || isAlpha(character) || character === '!' || 
        character === '_' || character === '-') { isCorrect = true; }

    return isCorrect;
}

// Does stuff and returns uwnanted character or true
function checkContentsOfTests(tests) {
    console.log(tests);

    for (let i = 0; i < tests.length; i++) {
        for (let j = 0; j < tests[i].length; j++) {
            console.log(tests[i][j] + ' ' + characterIsCorrect(tests[i][j]));
            if (!characterIsCorrect(tests[i][j])) { return tests[i][j]; }
        }
    }

    return true;
}

// Returns true if makefile is created and false otherwise.
function createMakeFile(inputSorted) {
    try {
        execSync('rm makefile');
    } catch (err) {
        console.error(err);
    }

    try {
        execSync('touch makefile');
    } catch (err) {
        console.error(err);
        return false;
    }

    let itr = '0';
    let toFile = ""; 

    for (let i = 0; i < inputSorted.length; i++) {

        if (itr === '21' || itr >= '21') {
            break;
        }

        const input = inputSorted[i];

        toFile += 'test' + itr + ':\n';
        toFile += '\techo "';

        for (let j = 0; j < input.length - 1; j++) {
            toFile += input[j];
        }

        toFile += '" | ./a.out\n';

        itr++;
    }

    execSync('echo "' + itr + '" > amount');

    try {
        fs.writeFileSync('makefile', toFile);
    } catch (err) {
        console.error(err);
        return false;
    }

    returnToDeafultDir();
    return true; // The function executed correctly!
}

async function test(message, command) {
    console.log(command);

    execSync(command, (error, stdout, stderr) => {
        console.log(stdout);

        if (stderr !== null) {
            execSync(`touch error${message.author.username}`);
            execSync(`echo "${stderr}" > error${message.author.username}`);
            return;
        }

        if (error !== null) {
            console.error('exec error: ' + error);
            execSync('touch error' + message.author.username);
            return;
        }

        execSync('touch success' + message.author.username);
        execSync('echo "' + stdout + '" > success' + message.author.username);
    });
}

// Waits a certain amount of time.
function waitForAmount(amount, start) {
    let timeNow = Date.now();

    while (timeNow - start < amount) {
        timeNow = Date.now();
    }

    console.log(amount / 1000 + ' seconds delay has passed!');
}

function testExercise(message) {    
    let amount;

    try {
        amount = fs.readFileSync('amount').toString();
    } catch (err) {
        console.error(err);

        message.channel.send('Upload tests before uploading a template!');
        return 1; 
    }

    console.log('First step');

    if (isNaN(amount[0])) {
        message.channel.send('No test to test!');
        console.log('whatt why');
        return 1; // No amount.
    }

    let amountOfTests = amount[0];
    if (!isNaN(amount[1])) {
        amountOfTests = amountOfTests * 10 + amount[1];
    }

    for (let i = 0; i < amountOfTests; i++) {
        const answer = test(message, 'make test' + i);

        waitForAmount(2000, Date.now()); // Starts a two seconds timeout.    

        let signal;

        return 0;

        try {
            signal = execSync('pgrep -x a.out');
        } catch (err) {
            console.error('The test was finished already');
            signal = false;
        }

        if (!signal) {
            // Good test done
        } else {
            // Test was not finished
            try {
                execSync('kill ' + signal);
                message.channel.send('The tests took to long to pass. Killing the process');
                return 2;
            } catch (err) {
                console.error(err);
            }
        }

        // Handling the error
        try {
            const error = execSync('cat error');
            if (error === null) {
                message.channel.send('The tests werent tested');
                return 2;
            } else {
                message.channel.send('The tests didnt compile with the following error: ' + error);
                return 2;
            }

            return 2;
        } catch (err) {
            console.error(err);
        }

        try {
            const ans = execSync('cat success' + message.author.username);
            execSync('echo "' + ans + '" > test' + i);
            execSync('rm success' + message.author.username);  
        } catch (err) {
            message.channel.send('I have no idea why this would ever happen so good luck figuring it out!');
            return 2;
        }
    }

    console.log(amount);

    // Zero means success.
    return 0;
}

// Exporting functions so that bot.js can remain clean
module.exports = {
    deletePDF,
    testExercise,
    checkContentsOfTests,
    createMakeFile,
    goToExerciseDirectory,
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
    messageExtension,
    specialCharacters,
    isVeryfied,
    deleteDirectory,
};

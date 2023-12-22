const { execSync } = require('child_process');
const fs = require('fs');
const functions = require('./forExport.js');

const dataStructures = {
	SHORT_MIN: -3278,
	SHORT_MAX: 3278,
	USHORT_MAX: 65535,
	USHORT_MIN: 0,
	INT_MIN: -2147483647,
	INT_MAX: 2147483647,
	UNIT_MAX: 4294967295,
	UNIT_MIN: 0,
	LLONG_MIN: -9223372036854775807,
	LLONG_MAX: 9223372036854775807,
	ULLONG_MAX: 18446744073709551615,
	ULLONG_MIN: 0,
};

function writeToMakefile(guildId, fileName, test, iterator) {
	functions.returnToDeafultDir();

	process.chdir('servers/');

	if (!functions.fileExists(guildId)) {
		functions.returnToDeafultDir();
		return false;
	}

	process.chdir(guildId + '/');

	if (!functions.fileExists(fileName)) {
		functions.returnToDeafultDir();
		return false;
	}

	process.chdir(fileName + '/');
	

}

const tests = fs.readFileSync('veryfiedGuilds.txt', 'utf-8');
const guildsId = guilds.split('\n').map(String);


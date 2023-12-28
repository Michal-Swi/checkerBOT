#include <fstream>
#include <iostream> //only for debugging delete later 
#include <climits>
#include <string>
#include <unordered_map>
#include <vector>
#include <unordered_set>
#include <random>

using namespace std;

enum ErrorStatus {
	No_Error = 0, 
	No_File_Found = 1,
	Wrong_Amount_Of_Test_Cases = 2,
	Syntax_Error = 3,
	Line_Too_Long = 4,
	Invalid_Datatype = 5,
};

vector<string> input;
string s;

ofstream tests("makefile");
unordered_set<string> datatypes = {"INT", "STRING", "BOOL", "SHORT", "LL", "ULL", "CHAR"};
unordered_set<char> specialSymbols = {'$', ':', '*', '-', '/'};
unordered_map<string, pair<string, string>> variables;

string trim(string &s) {
	string sol;

	for (auto ch : s) isalpha(ch) ? sol += ch : sol += "";

	return sol;
}

string makeUppercase(string &s) {
	string sol;
	for (auto ch : s) sol += toupper(ch);
	return sol;
}

string maxMin(string dataType) {
	bool negative = rand() % 2;
	negative == true ? cout << "true " : cout << "false ";
 
	if (dataType == "INT") {
		//faster but unreadable
		string ret;		
		negative == true ? ret = to_string((rand() % INT_MAX + 1) * -1) : ret = to_string((rand() % INT_MAX + 1)); 

		return ret;
	} else if (dataType == "BOOL") {
		return to_string(rand() % 2);
	} else if (dataType == "LL") {
		if (negative) {
			return to_string((rand() % LONG_LONG_MAX) * -1);
		} else {
			return to_string(rand() % LONG_LONG_MAX + 1);
		}
	} else if (dataType == "ULL") {
		return to_string(rand() % ULLONG_MAX + 1);
	} else if (dataType == "SHORT") {
		if (negative) {
			return to_string((rand() % SHRT_MAX) * -1);
		} else {
			return to_string((rand() % SHRT_MAX));
		}
	} else return "Invalid_Datatype";
}

//returns amount of variables from conditions
long long getAmount(string amount) {
	long long ret = -1;

	try {
		ret = stoll(amount);
	} catch (...) {
		return -1;
	}

	bool nameAlready = false;

	//n for nothing 
	char operation = 'n';
	string name;

	for (auto ch : amount) {
		if (nameAlready) {

			if (ch == ';') break; //end of name 

			//variable names can be only letters
			if (!isalpha(ch)) {
				return Syntax_Error;
			}

			name += ch;
		}

		//for some godforsaken reason ASCII for whitespace is 13, well its not but ehh
		else if (!nameAlready and (ch == ' ' or int(ch) == 13)) continue;
		else if (!nameAlready and (ch == '$')) { //$ is how many variables are necessarys 
			operation = ch;
			nameAlready = true;
		} else {
			//syntax error or smth
			break;
		}
	}

	//-1 is obviously invalid amount of wanted variables

	try {
		ret = stoll(variables[name].second);
	} catch (...) {
		return -1;
	}

	if (operation == 'n') return ret;
	else return -1;
}

//same as getValue but for strings and chars
pair<string, bool> letterTypeValues(bool isString, vector<string> &conditions) {
	if (conditions.empty()) { //conditions are necessary for letter types
		return make_pair("", false);
	}

	
}

//returns the first (if more than one is needed) generated variable
pair<string, bool> getValue(string dataType, vector<string> &conditions) {
	string value;

	if (dataType == "STRING" or dataType == "CHAR") {
		return letterTypeValues(dataType == "STRING" ? 1 : 0, conditions);
	}

	if (conditions.empty()) {
		//no conditions generate based off the datatype
		auto generated = maxMin(dataType);
		test << generated + " ";

		return make_pair(generated, true);
	}


	auto amount = getAmount(conditions[0]);
	if (amount < 1) {
		return make_pair("", false);
	}

	while (amount--) {

	}

	return make_pair("", false);
}

//3 loops but still O(n) where n is the input length
ErrorStatus generateTestCase(int &iterator) {
	tests << "test" + iterator + ':' + '\n';
	tests << "echo: ";

	string sol;

	for (int i = 0; i < input.size(); i++) {
		string temp = input[i];

		temp = makeUppercase(temp);

		string dataType;
		bool space = false;

		int j = 0;

		//getting the data type
		for (j; j < temp.length(); j++) {
			if (temp[j] != ' ') {
				dataType += temp[j];
			} else if (temp[j] == ' ') {
				break;
			}
		}

		//deleting unwanted characters
		dataType = trim(dataType);

		if (datatypes.find(dataType) == datatypes.end()) {
			return Invalid_Datatype;
		}

		space = false;
		string name;

		//getting the name of the variable
		for (j; j < temp.length(); j++) {
			if (temp[j] != ' ') {
				space = true;
			}
			
			if (space and isalpha(temp[j])) {
				name += temp[j];
			} else if (space and !isalpha(temp[j])) {
				break;
			}
		}

		//deleting unwanted characters (non letters) proboably useless but better safe than sorry!
		name = trim(name);
		++j;

		vector<string> conditions;
		string condition;

		for (j; j < temp.size(); j++) {

			if (temp[j] == ' ' or int(temp[j]) == 13) {
				if (j + 1 == temp.size()) break;
			} if (isalpha(temp[j]) or isdigit(temp[j]) 
				or specialSymbols.find(temp[j]) != specialSymbols.end()) {

				condition += temp[j];
			} else if (temp[j] == ';') {
				conditions.push_back(condition);
				condition = "";
			} else {
				return Syntax_Error;
			}
		}

		//last one never gets pushed back
		conditions.push_back(condition);

		// for (auto s : conditions) cout << s << endl;

		variables[name].first = dataType;
		pair<string, bool> value = getValue(dataType, conditions);

		if (!value.second) return Syntax_Error;
		variables[name].second = value.first;

	} //end of i loop

	variables.clear();

	return No_Error;
}

int main(int argc, char **argv) {
	if (argc < 2) {
		return No_File_Found; 
	}

	srand(time(NULL));

	ifstream code(argv[1]);
	getline(code, s);

	//max number of test cases is 20 but new line counts as a character
	if (s.length() > 5) {
		return Wrong_Amount_Of_Test_Cases;
	}

	int amountOfTestCases = stoi(s);
	if (amountOfTestCases > 20 or amountOfTestCases < 1) {
		return Wrong_Amount_Of_Test_Cases;
	}

	while(!code.eof()) {
		getline(code, s);

		if (s.empty()) continue;
		if (s.length() > 100) return Line_Too_Long;

		input.push_back(s);
	}

	s = "";
	int iterator = 1;

	while (amountOfTestCases--) {
		auto error = generateTestCase(iterator);
		iterator++;

		if (error == Invalid_Datatype) {
			return Invalid_Datatype;
		} else if (error == Syntax_Error) {
			return Syntax_Error;
		}
	}
	
	return 0;
}
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
unordered_set<char> specialSymbols = {'$', ':', '*', '-'};

string trim(string &s) {
	string sol;

	for (auto ch : s) isalpha(ch) ? sol += ch : sol += "";

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

//returns the full input from one line in the file
string getValue(string dataType, vector<string> &conditions) {
	string value;

	if (conditions.empty()) {
		//no conditions generate based off the datatype
		return maxMin(dataType);
	}

	return "";
}

//3 loops but still O(n) where n is the input length
ErrorStatus generateTestCase(int &iterator) {
	unordered_map<string, pair<string, string>> variables;

	string sol;

	for (int i = 0; i < input.size(); i++) {
		string temp = input[i];

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
		variables[name].second = getValue(dataType, conditions);

	} //end of i loop

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
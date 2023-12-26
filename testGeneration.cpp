#include <fstream>
#include <iostream> //only for debugging delete later 
#include <climits>
#include <string>
#include <unordered_map>
#include <vector>
#include <unordered_set>

using namespace std;

enum Error {
	No_File_Found = 1,
	Wrong_Amount_Of_Test_Cases = 2,
	Syntax_Error = 3,
	Line_Too_Long = 4,
	Invalid_Datatype = 5,
};

vector<string> input;
string s;

unordered_set<string> datatypes = {"INT", "STRING", "BOOL", "SHORT", "LL", "ULL", "CHAR"};
unordered_set<char> specialSymbols = {'*', ':'};

string trim(string &s) {
	string sol;

	for (auto ch : s) isalpha(ch) ? sol += ch : sol += "";

	return sol;
}

// bool validDataType()

int generateTestCase() {
	unordered_map<string, string> mp;

	string sol;

	for (int i = 0; i < input.size(); i++) {
		string temp = input[i];

		string dataType;
		bool space = false;

		int j = 0;
		for (j; j < temp.length(); j++) {
			if (temp[j] != ' ') {
				dataType += temp[j];
			} else if (temp[j] == ' ') {
				break;
			}
		}

		dataType = trim(dataType);
		auto it = datatypes.find(dataType);
		if (it == datatypes.end()) {
			return Invalid_Datatype;
		}

		space = false;
		string name;

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

		name = trim(name);
	}	
}

int main(int argc, char **argv) {
	if (argc < 2) {
		return No_File_Found; 
	}

	ifstream code(argv[1]);

	getline(code, s);

	//max number of test cases is 20
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
	while (amountOfTestCases--) {
		auto error = generateTestCase();

		if (error == Invalid_Datatype) {
			return Invalid_Datatype;
		}
	}
	
	return 0;
}
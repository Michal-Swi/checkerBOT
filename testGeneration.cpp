#include <fstream>
#include <iostream> //only for debugging delete later 
#include <climits>
#include <string>

using namespace std;

// class Variable {
// public:
// 	short detectDataStructure(string s) {
// 		string dataStruct = dataStructure(s);

// 		if (dataStructure == "ERROR") return 0; //syntax error


// 	}

// private:
// 	string dataStructure(string &s) {
// 		string sol;

// 		for (auto ch : s) {
// 			if (!isalpha(s)) return sol;
// 			sol += ch;
// 		}

// 		return "ERROR";
// 	}

// 	int n;
// 	char ch;
// 	float f;
// 	double d;
// 	string s;
// 	bool b;
// 	long long ll;
// 	unsigned long long ull;
// 	short sh;
// };

enum Error {
	No_File_Found = 1,
	Wrong_Amount_Of_Test_Cases = 2,
	Syntax_Error = 3,
};

unordered_map<string, string> mp;
vector<string> input;
string s;

void generateTestCase() {
	string sol;

	for (int i = 0; i < input.size(); i++) {
		string temp = input[i];

		
	}	
}

int main(int argc, char **argv) {
	if (argc < 2) {
		return No_File_Found; 
	}

	ifstream code(argv[1]);

	getline(code, s);

	//max number of test cases is 20
	if (s.length() > 2) {
		return Wrong_Amount_Of_Test_Cases;
	}

	int amountOfTestCases = stoi(s);
	if (amountOfTestCases > 20 or amountOfTestCases < 1) {
		return Wrong_Amount_Of_Test_Cases;
	}

	while(!code.eof()) {
		getline(input, s);

		input.push_back(s);
	}

	s = "";
	while (amountOfTestCases--) {
		generateTestCase();
	}
	
	return 0;
}
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

class VariableGeneration {
public:
	void setName(string name) {
		this->name = name;
	}

	void setDataType(string dataType) {
		this->dataType = dataType;
	}

	void setValue(string value) {
		this->value = value;
	}

	void printName() {
		cout << name;
	}

	~VariableGeneration() {
		cout << "AAAAAAAAAA";
	}

private:
	string name;
	string dataType;
	string value;
};

class VariableGenerationBuilder : VariableGeneration {
public:
	VariableGeneration &setName(string name) {
		variable.setName(name);
		return *this;
	}									

	VariableGeneration &setDataType(string dataType) {
		variable.setDataType(dataType);
		return *this;
	}

	VariableGeneration &setValue(string value) {
		variable.setValue(value);
		return *this;
	}

	VariableGeneration build() {
		return variable;
	}

private:
	VariableGeneration variable;
};

string trim(string &s) {
	string sol;

	for (auto ch : s) isalpha(ch) ? sol += ch : sol += "";

	return sol;
}

// vector<string> input;
// string s;

// ofstream tests("makefile");
// unordered_set<string> datatypes = {"INT", "STRING", "BOOL", "SHORT", "LL", "ULL", "CHAR"};
// unordered_set<char> specialSymbols = {'$', ':', '*', '-'};
// unordered_map<string, pair<string, string>> variables;

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

string s;

int main() {
	// if (argc < 2) {
	// 	return No_File_Found; 
	// }

	srand(time(NULL));

	// ifstream code(argv[1]);
	// getline(code, s);

	auto var = VariableGenerationBuilder().setName("siema").build();
	var.printName();

	return 0;
}
#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main(int argc, char **argv) {
    if (argc < 2) {
        cout << "No file. FATAL";
        return 0;
    } else {
        cout << argv[1] << endl;
    }

    ifstream file(argv[1]);

    string url;
    getline(file, url);

    string fileName;
    getline(file, fileName);

    string command = "curl -o " + fileName + ".pdf " + url;

    const char* cCommand = command.c_str();
    system(cCommand);

    return 0;
}

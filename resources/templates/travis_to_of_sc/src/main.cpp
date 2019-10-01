#include "ofMain.h"
#include "ofApp.h"

// functions to check for command line options
// from here: https://stackoverflow.com/questions/865668/how-to-parse-command-line-arguments-in-c
class InputParser{
    public:
        InputParser (int &argc, char **argv){
            for (int i=1; i < argc; ++i)
                this->tokens.push_back(std::string(argv[i]));
        }
        /// @author iain
        const std::string& getCmdOption(const std::string &option) const{
            std::vector<std::string>::const_iterator itr;
            itr =  std::find(this->tokens.begin(), this->tokens.end(), option);
            if (itr != this->tokens.end() && ++itr != this->tokens.end()){
                return *itr;
            }
            static const std::string empty_string("");
            return empty_string;
        }
        /// @author iain
        bool cmdOptionExists(const std::string &option) const{
            return std::find(this->tokens.begin(), this->tokens.end(), option)
                   != this->tokens.end();
        }
    private:
        std::vector <std::string> tokens;
};

//========================================================================
int main(int argc, char *argv[]){
	auto windowMode = OF_WINDOW;
	// handle cli arguments
	InputParser input(argc, argv);
	if(input.cmdOptionExists("-f") || input.cmdOptionExists("--fullscreen")){
        windowMode = OF_GAME_MODE;
  }
	
	ofGLWindowSettings settings;
	settings.setGLVersion(3,3); // required for OpenGL 3.3 shaders to work
	settings.setSize(1920, 1080);
	settings.windowMode = windowMode;
	ofCreateWindow(settings);
	//ofSetupOpenGL(1920,1080,OF_WINDOW);			// <-------- setup the GL context

	// this kicks off the running of my app
	// can be OF_WINDOW or OF_FULLSCREEN
	// pass in width and height too:
	ofRunApp(new ofApp());

}
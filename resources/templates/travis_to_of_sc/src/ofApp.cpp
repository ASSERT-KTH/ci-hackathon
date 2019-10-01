#include "ofApp.h"

//--------------------------------------------------------------
void ofApp::setup(){
  ofLog() << "listening for osc messages on port " << PORT;
  receiver.setup(PORT);

}

//--------------------------------------------------------------
void ofApp::update(){
  handleIncomingOsc();

}

//--------------------------------------------------------------
void ofApp::draw(){

}

// based on the OF osc receiver example
void ofApp::handleIncomingOsc() {
  // check for waiting messages
	while(receiver.hasWaitingMessages()){

		// get the next message
		ofxOscMessage m;
		receiver.getNextMessage(m);
    
    cout << "m.getAddress(): " << m.getAddress() << endl;

		// check for mouse moved message
		if(m.getAddress() == "/travis-via-osc"){
      messageString = m.getArgAsString(0);
      if(!json.parse(messageString)) {
        // parsing failed
        ofLog() << "JSON parsing failed" << endl;
      }
      // Interesting fields in the travis data:
      // data.state
      // event
      // data.repository_id
      // data.repository_slug
      // data.config.language
      // data.commit.committer_name
      // data.commit.author_name
      // data.commit.message
      const Json::Value& data = json;
      cout << data["data"]["state"].asString() << endl;
      cout << data["event"].asString() << endl;
      cout << data["data"]["state"].asString() << endl;
      cout << data["data"]["repository_slug"].asString() << endl;
      cout << data["data"]["config"]["language"].asString() << endl;
      cout << data["data"]["commit"]["committer_name"].asString() << endl;
      cout << data["data"]["commit"]["author_name"].asString() << endl;
      cout << data["data"]["commit"]["message"].asString() << endl;
		}
	}
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){

}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){

}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){

}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){

}

//--------------------------------------------------------------
void ofApp::mouseEntered(int x, int y){

}

//--------------------------------------------------------------
void ofApp::mouseExited(int x, int y){

}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){

}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){

}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){ 

}

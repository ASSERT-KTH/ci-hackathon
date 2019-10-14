const MAX_MESSAGES = 1000;
const ACCEPTED_TRAVIS_STATES = ["passed", "failed"];
const ws = new WebSocket("wss://travis.durieux.me");
const queuedMessages = [];

function travisIntegration() {
  console.log("Starting");
  ws.onopen = () => {
    console.log("Opened websocket connection");
    ws.onmessage = handleMessage;
  };
}
const handleMessage = eventMessage => {
  parsedBuild = JSON.parse(eventMessage.data).data;
  if (spaceInMessageQueue() && acceptedMessageState(parsedBuild)) {
    queuedMessages.push(parsedBuild);
  }
};

const areThereMessages = () => {
  return queuedMessages.length > 0;
};

const spaceInMessageQueue = () => {
  return queuedMessages.length < MAX_MESSAGES;
};

const acceptedMessageState = build => {
  return ACCEPTED_TRAVIS_STATES.includes(build.state);
};

const popFirstMessage = () => {
  if (areThereMessages()) {
    return queuedMessages.shift();
  }
};

document.addEventListener(
  "DOMContentLoaded",
  function() {
    travisIntegration();
  },
  false
);

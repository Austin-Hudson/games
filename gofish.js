
// initializing game variables
var SpeechRecognition = window.webkitSpeechRecognition ||   //prefixes for cross-browser compatability
                        window.mozSpeechRecognition    ||
                        window.msSpeechRecognition     ||
                        window.oSpeechRecognition      ||
                        window.SpeechRecognition,
    recognition       = new SpeechRecognition(),
    deck              = new Deck(),
    development       = true,
    inProgress        = false;

//get the start button and make an event listener for it
var startButton = document.querySelector('button');
startButton.addEventListener('click', function() {
  start();
});
/*
This function starts the game
*/
function start(){
  //create the deck of 52 cards
  deck.createDeck();
  //shuffle deck
  deck.shuffle();
  //the game has started
  inProgress = true;
  //hide the start button
  startButton.classList.add("hidden");
  //initalize the sound recognition
  initializeRecognition();
  //start the game
  playGame();
}

/*
 This function sets up parameters for the speech recognition and starts it listening
*/
function initializeRecognition() {
  recognition.continuous = true;                          // it's always listening
  if (development) {recognition.interimResults = true;}   // logs interim results to the console in dev mode
  recognition.onend = function() {                        // restarts the recognition engine if there's a pause in speech
    if (inProgress) {
      console.log("restarting recognition");
      recognition.start();
    }
  };
  recognition.start();                        // start listening
}

/*
 This function will listen to the user's speech result
*/
function speechResult() {
  recognition.onresult = function(event) {
   var transcript = event.results[event.resultIndex][0].transcript;

   var words = transcript.split(" ");
   var result = words[words.length - 1];

   if (development) {
     var dev = document.querySelector('#speech');
     dev.innerHTML = "";
     dev.innerHTML = "Last speech recognition result: <span class='italics'>" + result + "</span>";
   }
   };
 }
/*
 This function starts the game
*/
function playGame() {
  if (inProgress) {
    speechResult();
  } else {
    endGame();
  }
}

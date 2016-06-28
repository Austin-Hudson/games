
// initializing game variables
var SpeechRecognition = window.webkitSpeechRecognition ||   //prefixes for cross-browser compatability
                        window.mozSpeechRecognition    ||
                        window.msSpeechRecognition     ||
                        window.oSpeechRecognition      ||
                        window.SpeechRecognition,
    recongition       = new SpeechRecognition(),
    deck              = new Deck(),
    inProgress        = false;

//start game button
var startButton = document.querySelector('button');
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

}

console.log(deck);
start();

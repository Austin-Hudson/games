
// initializing game variables
// did go fish based on the rules from https://www.pagat.com/quartet/gofish.html
// as of now its' only a two player game, so each player gets 7 cards each
var SpeechRecognition = window.webkitSpeechRecognition ||   //prefixes for cross-browser compatability
                        window.mozSpeechRecognition    ||
                        window.msSpeechRecognition     ||
                        window.oSpeechRecognition      ||
                        window.SpeechRecognition,
    recognition       = new SpeechRecognition(),
    deck              = new Deck(),
    numOfPlayers      = 2,
    handSize          = 7,
    hands             = [],
    books             = [],
    commands          = [],
    turn              = true;
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
  //deal to the number of players
  hands = deck.dealToNPlayers(numOfPlayers, handSize)
  //create the books arrays for each number of players
  createBooksForNPlayers(numOfPlayers);
  //the game has started
  inProgress = true;
  //hide the start button
  startButton.classList.add("hidden");
  //initalize the sound recognition
  initializeRecognition();
  //render the cards
  renderCards(hands);
  //start the game
  playGame();

}

/*
  This function creates a books array for all the players
*/
function createBooksForNPlayers(numOfPlayers){
  for(var i = 0; i < numOfPlayers; i++)
  {
    books[i] = [];
  }
}

/*
  This function renders the cards
*/
function renderCards(hands){
  console.log(hands);
  if(turn){
    var playerDiv = document.getElementById("player-hand");
    //treat the first hand as the human player
    for(var i = 0; i < hands[0].length; i++){
        var card = document.createElement("img");
        var dir = "cards/" + hands[0][i].suit + " " + hands[0][i].value + ".png";
        card.setAttribute("src", dir);
        playerDiv.appendChild(card);
      }
  }
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

   var card = checkForMatch(result);
   if (card == "gameover") {
     recognition.stop();
     inProgress = false;
   } else if (card) {
     playTurn(card);
   }
   };
 }
 /*
  This function plays the card
 */
 function playTurn(card){

 }

/*
 This function looks to see if they want to ask the
 computer for a certain card
*/
 function checkForMatch(card) {
  var result = false;
  for (var i = 0; i < commands.length; i++) {
    if (commands[i] == card) {
      console.log("Match found with command: ", commands[i]);
      result = scene.results[i];
    }
  }
  return result;
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

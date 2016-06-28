
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
  //make short choices
  makeShortChoices();
  //start the game
  playGame();
  console.log(hands[1]);

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
    //empty exisiting contents
    var playerDiv = document.getElementById("player-hand");
    playerDiv.innerHTML = "";
    //treat the first hand as the human player and render them
    for(var i = 0; i < hands[0].length; i++){
        var card = document.createElement("img");
        var dir = "cards/" + hands[0][i].suit + " " + hands[0][i].value + ".png";
        card.setAttribute("src", dir);
        card.classList.add("card");
        playerDiv.appendChild(card);
      }

    //render pile
    if(deck.getSize() != 0){
      var stock = document.getElementById("deck");
      stock.innerHTML = "";
      var image = document.createElement("img");
      var dir = "cards/" + "_Back.png";
      image.setAttribute("src", dir);
      image.classList.add("card");
      stock.appendChild(image);
    }
    //render computer hand
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
      displayChoice(card);
      var guess;

      //turn true is player one
      if(turn){
        guess = searchForCard(card, hands[1]); //computer hand
        //if they guessed right take cards and render
        renderOutcome(guess);
        turn = false;
      }
      else { //turn false is computer
        var compGuess = computerGuess(hands[0]);
        console.log(hands[1][compGuess].value);
        displayChoice(hands[1][compGuess].value);
        guess = searchForCard(hands[1][compGuess].value,hands[0]); //player 1 hand
        renderOutcome(guess);
        turn = true;
      }

      renderCards(hands);

 }
 /*
  This function is for the computer and choose a random guess based on their cards
 */
 function computerGuess(hand){
   var size = hand.length-1;
   return randomIndex = Math.floor(Math.random() * size);
 }
/*
 This function takes what they said and get the value
*/
function convertTextToValue(card){
     if(card =="ace" || card == "aces"){return 1;}
     if(card =="two" || card == "twos" || card == 2) {return 2;}
     if(card =="three" || card == "threes" || card == 3) {return 3;}
     if(card =="four" || card == "fours" || card == 4) {return 4;}
     if(card =="fives" || card == "five" || card == 5) {return 5;}
     if(card =="six" || card == "sixes" || card == 6) {return 6;}
     if(card =="seven" || card == "sevens" || card == 7) {return 7;}
     if(card =="eight" || card == "eights" || card == 8) {return 8;}
     if(card =="nine" || card == "nines" || card == 9) {return 9;}
     if(card =="ten" || card == "tens" || card == 10) {return 10;}
     if(card == "jacks" || card == "jack") {return 11;}
     if(card == "queens"|| card == "queen") {return 12;}
     if(card == "kings" || card == "king") {return 13;}


}

/*
 This function searches for the card
*/
 function searchForCard(card,hand){
   //conver to string if its a number
   if (typeof card == "number")
          card = card.toString();
  else {
    var value = convertTextToValue(card);
  }
   for(var i = 0; i < hand.length; i++){
     if(value == hand[i].value){
       //add and remove to respected hands
       if(turn) {
         this.hands[0].push(hand[i]);
         this.hands[1].splice(i, 1);
       }
       else {
         this.hands[1].push(hand[1]);
         this.hands[0].splice(i,1);
       }
       return true;
     }
   }
   return false;
 }

 /*
 This function renders the outcome
 */
 function renderOutcome(guess){
   var player;
   var display = document.getElementById("outcome");
   var outcome = document.createElement("p");

   var para = document.querySelector("p");
   if(para != null) { outcome.innerText = "";}

   //get who the player is
   if(turn) { player = "Player 1";}
   else {player = "Computer";}

   if(guess){
     var content = player + " guessed correctly";
     outcome.innerHTML = "";
     outcome.innerText = content;
     display.appendChild(outcome);
   }
   else {
     if(turn) {
       player = "Computer";
       var card = deck.deal();
       var c = new Card(card[0].value, card[0].suit);
       hands[0].push(c);

     }
     else {
       player = "Player 1";
       var card = deck.deal();
       var c = new Card(card[0].value, card[0].suit);
       hands[1].push(c);
     }
     var content = player + " says GoFish!";
     outcome.innerText = ""
     outcome.innerText = content;
     display.appendChild(outcome);
   }

 }
 /*
  This function displays what the user said
 */
function displayChoice(card){
  var choice = document.getElementById("choice");
  choice.innerText = card;

}
/*
 This function looks to see if they want to ask the
 computer for a certain card that exists in their hand
*/
 function checkForMatch(card) {

  var result = false;
  for (var i = 0; i < commands.length; i++) {
    if (commands[i] == card.toLowerCase()) {
      return card;
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

/*
 This function is used to make short choices so its easier to process the voice commands
*/
function makeShortChoices() {
  var shortChoices = [];
  for (var i = 0; i < hands[0].length; i++) {
      var value = hands[0][i].value;
      if(value == 1) {shortChoices.push("aces");
                      shortChoices.push("ace");}
      if(value == 2) {shortChoices.push("twos");
                      shortChoices.push("2");
                      shortChoices.push("two");}
      if(value == 3) {shortChoices.push("threes");
                      shortChoices.push("3");
                      shortChoices.push("three");}
      if(value == 4) {shortChoices.push("fours");
                      shortChoices.push("four");
                      shortChoices.push("4");}
      if(value == 5) {shortChoices.push("fives");
                      shortChoices.push("five");
                      shortChoices.push("5");}
      if(value == 6) {shortChoices.push("sixes");
                      shortChoices.push("six");
                      shortChoices.push("6");}
      if(value == 7) {shortChoices.push("sevens");
                      shortChoices.push("seven");
                      shortChoices.push("7")}
      if(value == 8) {shortChoices.push("eights");
                      shortChoices.push("eight");
                      shortChoices.push("8");}
      if(value == 9) {shortChoices.push("nines");
                      shortChoices.push("nine");
                      shortChoices.push("9");}
      if(value == 10) {shortChoices.push("tens");
                      shortChoices.push("10");
                      shortChoices.push("ten");}
      if(value == 11) {shortChoices.push("jacks");
                      shortChoices.push("jack");}
      if(value == 12) {shortChoices.push("queens");
                      shortChoices.push("queen");}
      if(value == 13) {shortChoices.push("kings");
                      shortChoices.push("king");}
    }
    commands = shortChoices;
  }

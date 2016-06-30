
// initializing game variables
// did go fish based on the rules from https://www.pagat.com/quartet/gofish.html
// as of now its' only a two player game, so each player gets 7 cards each
var SpeechRecognition = window.webkitSpeechRecognition ||   //prefixes for cross-browser compatability
                        window.mozSpeechRecognition    ||
                        window.msSpeechRecognition     ||
                        window.oSpeechRecognition      ||
                        window.SpeechRecognition,
    recognition       = new SpeechRecognition(),
    deck              = new Deck(), //deck used
    numOfPlayers      = 2,  //number of players in the game
    handSize          = 7, //each hand size for the players
    hands             = [], //the games hands for all the players
    books             = [], //books to determine the winner
    commands          = [], //commands said by the user
    turn              = true, //used to figure out whose turn it is
    development       = true, //used for the developement process
    inProgress        = false; //used for the state of the game

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
  //take out the hidden choices
  var choices = document.querySelector("#choice");
  choices.style.display = "flex";
  //initalize the sound recognition
  initializeRecognition();
  //render the cards
  renderCards(hands);
  //make short choices
  makeShortChoices();
  //start the game
  playGame();

}

/*
  This function creates a books array for all the players
*/
function createBooksForNPlayers(numOfPlayers){
  //while looping through the number of places, create a book for them
  for(var i = 0; i < numOfPlayers; i++)
  {
    books[i] = [];
  }
}

/*
This function sorts the hands
 source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
*/
function sortHands(){
  hands[0].sort(function(obj1, obj2){
    return obj1.value - obj2.value;
  });
}

/*
  This function renders the cards
*/
function renderCards(hands){
    //get and empty existing elemnts
    var playerDiv = document.getElementById("player-hand");
    var computerDiv = document.getElementById("computer-hand");
    //var ul = document.getElementById("card-container");
    playerDiv.innerHTML = "";
    computerDiv.innerHTML = "";
    //call the funciton to sort hands
    sortHands();
    //treat the first hand as the human player and render them
    for(var i = 0; i < hands[0].length; i++){
        var div = document.createElement("div");
        div.classList.add("card-container");
        var card = document.createElement("img");
        var dir = "cards/" + hands[0][i].suit + " " + hands[0][i].value + ".png";
        card.setAttribute("src", dir);
        card.classList.add("card");
        div.appendChild(card);
        playerDiv.appendChild(div);
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
    for(var i =0; i < hands[1].length; i++){
      var image = document.createElement("img");
      var dir = "cards/" + "_Back.png";
      image.setAttribute("src", dir);
      image.classList.add("card");
      computerDiv.appendChild(image);
    }
}

/*
This function renders the outcome
*/
function renderOutcome(guess){
  var player;
  var display = document.getElementById("outcome");


  var para = document.querySelector("p");
  if(para != null) { para.innerText = "";}
  else {
   var outcome = document.createElement("p");
  }

  //get who the player is
  if(turn) { player = "Player 1";}
  else {player = "Computer";}
  // add the outcome by the outcome if they guessed right or wrong
  if(guess){
    var content = player + " guessed correctly";
    outcome.innerText = content;
    //display.appendChild(outcome);
  }
  else {
   //  if(turn) {
   //    player = "Computer";
   //  }
   //  else {
   //    player = "Player 1";
   //  }
    var content = player + " says GoFish!";

  }
  //set the outcome to the page
  outcome = document.getElementById("outcome");
  outcome.innerText = "";
  outcome.innerText = content;

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
   //print the result from speech, helps with debugging
   if (development) {
     var dev = document.querySelector('#speech');
     dev.innerHTML = "";
     dev.innerHTML = "Last speech recognition result: <span class='italics'>" + result + "</span>";
   }
   //check the match if its in the players hand
   var card = checkForMatch(result);
   if (deck.length == 0 || hands[0].length == 0 || hands[1].length == 0) {
     console.log("End Game");
     recognition.stop();
     inProgress = false;
     endGame();
   } else if (card) {
     playTurn(card);
   }
   };
 }
 /*
  This function looks to see if they want to ask the
  player for a certain card that exists in their hand
 */
  function checkForMatch(card) {

   var result = false;
   //loop through the hand and determine if the card they asked is in their hand
   for (var i = 0; i < commands.length; i++) {
     if (commands[i] == card.toLowerCase()) {
       return card;
     }
   }
   return result;
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
        while(guess){
          renderOutcome(guess);
          speechResult();
          guess = searchForCard(card, hands[1]); //computer hand
          addBook(hands[0]);
        } //if they guessed wrong deal a card and render it
        if(!guess){
          turn = false;
          addBook(hands[0]);
          var nCard = deck.deal();
          var c = new Card(nCard.value,nCard.suit);
          // if(!hands[0].includes(c)){
          //      hands[0].push(c);
          //    }
          hands[0].push(c);
          makeShortChoices();
          renderOutcome(guess);
          recognition.continuous = false;  //stop it's listening
        }
      }
      else { //turn false is computer
        var compGuess = computerGuess(hands[1]);
        displayChoice(hands[1][compGuess].value);
        guess = searchForCard(hands[1][compGuess].value,hands[0]); //player 1 hand
        //while the computer is guessing right render it
        while(guess){
          compGuess = computerGuess(hands[0]);
          displayChoice(hands[1][compGuess].value);
        //  console.log(hands[1][compGuess].value);
          guess = searchForCard(hands[1][compGuess].value,hands[0]); //player 1 hand
          renderOutcome(guess);
          addBook(hands[1]);

        }
        if(!guess){
        //  console.log("guess: " + hands[1][compGuess].value);
          turn = true;
          addBook(hands[1]);
          var nCard = deck.deal();
          var c = new Card(nCard.value,nCard.suit);
          // if(!hands[1].includes(c)){
          //      hands[1].push(c);
          //    }
          hands[1].push(c)
          renderOutcome(guess);
          recognition.continuous = true;  //continue it's listening
        }
      }
      // console.log(hands[1]);
      renderCards(hands);

 }


/*
 This function searches for the card
*/
 function searchForCard(card,hand){
   //conver to string if its a number
    if(card =="1"|| card == "2" || card == "3" || card == "4" || card == "5" || card == "6" ||
  card == "7" || card == "8" || card == "9" || card == "10" || card == "11" || card == "12"|| card == "13") {
      var value = card;
   }
   else {
    var value = convertTextToValue(card.toLowerCase());
  }
  // loop through the card and if the "right" guessed card to the respective hand
   for(var i = 0; i < hand.length; i++){
      // console.log("V:" + value);
      // console.log(hand[i].value);
     if(value == hand[i].value){
       //add and remove to respected hands
       if(turn) {
         this.hands[0].push(hand[i]);
         this.hands[1].splice(i, 1);
       }
       else {
         this.hands[1].push(hand[i]);
         this.hands[0].splice(i,1);
       }
       return true;
     }
   }
   return false;
 }


 /*
  This function displays what the user said
 */
function displayChoice(card){
  var c = card;

  //make it more readible if the computer picks the face cards
  if(card == "11") {c = "Jack";}
  else if(card == "12") {c = "Queen";}
  else if(card == "13") {c = "King";}
  else if(card == "1") {c = "Ace";}

  //output the choice
  var choice = document.getElementById("choice");
  choice.innerText = c;

}
/*
 This function is for the computer and choose a random guess based on their cards
*/
function computerGuess(hand){
  var size = hand.length-1;
  return randomIndex = Math.floor(Math.random() * size);
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
 This function adds to the books to keep track of winner
*/
function addBook(hand){
  var count = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //used to determine the amount of books for each card value

  //count each card by their value
  for(var i = 0; i < hand.length; i++){
      var value = hand[i].value;
      count[value]++;
  }
  //remove the card if it's a book
  for(var i = 0; i < count.length; i++){
    if(count[i] == 4) {
      if(turn)
        removeFourOfKind(this.hands[0], i);
      else{
        removeFourOfKind(this.hands[1], i);
      }
    }
  }
}

/*
This function removes the books in the hand
*/
function removeFourOfKind(hand, value){
  //loop through their hands and remove the books
  for(var i = 0; i < hand.length; i++){
     if(hand[i].value == value){
       if(turn)
         this.hands[0].splice(i, 1);
       else{
         this.hands[1].splice(i, 1);
       }
     }
  }

}

/*
 This function ends the game
*/
function endGame() {
  var winner;
  var playerOneBook = books[0].length;
  var playerTwoBook = books[1].length;
  //determine winner
  if(playerOneBook > playerTwoBook){
    winner = "Player 1 wins!";
  }
  else {
    winner = "Player 2 wins!";
  }

  var r = document.querySelector(".winner")

  if(r.length != 0 && r != null){
    var b = document.querySelector("body");
    var result = document.createElement("div");
    result.classList.add("winner");
    var w = document.createTextNode(winner);
    result.appendChild(w);
    b.appendChild(result);
 }

}
/*
 This function takes what they said and get the value
*/
function convertTextToValue(card){
      //convert the text to a value
     if(card =="ace" || card == "aces"){return 1;}
     if(card =="two" || card == "twos" || card == "2") {return 2;}
     if(card =="three" || card == "threes" || card == "3") {return 3;}
     if(card =="four" || card == "fours" || card == "4") {return 4;}
     if(card =="fives" || card == "five" || card == "5") {return 5;}
     if(card =="six" || card == "sixes" || card == "6") {return 6;}
     if(card =="seven" || card == "sevens" || card == "7") {return 7;}
     if(card =="eight" || card == "eights" || card == "8") {return 8;}
     if(card =="nine" || card == "nines" || card == "9") {return 9;}
     if(card =="ten" || card == "tens" || card == "10") {return 10;}
     if(card == "jacks" || card == "jack") {return 11;}
     if(card == "queens"|| card == "queen") {return 12;}
     if(card == "kings" || card == "king") {return 13;}


}

/*
 This function is used to make short choices so its easier to process the voice commands
*/
function makeShortChoices() {
  var shortChoices = [];
  //make easier choices for the speech recognition
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

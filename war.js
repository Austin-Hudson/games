var war             = new Deck(),
    hands           = [],
    numOfPlayers    = 2,
    handSize        = 26,
    playerOneScore  = 0,
    playerTwoScore  = 0,
    moves           = []
    turn            = true
    inProgress      = false;


//get the start button and make an event listener for it
var startButton = document.querySelector('button');
startButton.addEventListener('click', function() {
  start();
});


/*
This function starts the game
*/
function start(){
  //listener
  var page = document.querySelector("html");
  page.addEventListener("click", function(){
      makeMove();
  });
  //create the deck of 52 cards
  war.createDeck();
  //shuffle deck
  war.shuffle();
  //deal to the number of players
  hands = war.dealToNPlayers(numOfPlayers, handSize)
  //render scores
  renderScores();
  //render deck
  renderDecks();
  //hide button
  startButton.classList.add("hidden");
  //set the progress to be true
  inProgress = true;
  //start the game
  startGame();
}

/*
 This function renders the scores
*/
function renderScores(){
  //labels
  var labelOne = document.getElementById("player-1");
  var labelTwo = document.getElementById("player-2");

  labelOne.innerText = "Player 1";
  labelTwo.innerText = "Player 2";

  //get the scores
  var playerOne = document.getElementById("player-1-score");
  var playerTwo = document.getElementById("player-2-score");

  playerOne.innerText = playerOneScore;
  playerTwo.innerText = playerTwoScore;
}

/*
 This function renders the cards
*/
function renderDecks(){
  //render each decks
  if(hands[0].length != 0){
    var playerOneDeck = document.getElementById("deck-one");
    playerOneDeck.innerHTML = "";
    var image = document.createElement("img");
    var dir = "cards/" + "_Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerOneDeck.appendChild(image);
  }

  if(hands[1].length != 0){
    var playerTwoDeck = document.getElementById("deck-two");
    playerTwoDeck.innerHTML = "";
    var image = document.createElement("img");
    var dir = "cards/" + "_Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerTwoDeck.appendChild(image);
  }

}

/*
 This function renders the move
*/
function renderMove(card){
  if(hands[0].length != 0){
    if(turn){
      var c = document.createElement("img");
      var value = document.getElementById("deck-one-value");
      value.innerHTML = "";
      var dir = "cards/" + card.suit + " " + card.value + ".png";
      c.setAttribute("src", dir);
      c.classList.add("card");
      value.appendChild(c);
    }
}
    if(hands[1].length != 0){
      if(!turn){
        var c = document.createElement("img");
        var value = document.getElementById("deck-two-value");
        value.innerHTML = "";
        var dir = "cards/" + card.suit + " " + card.value + ".png";
        c.setAttribute("src", dir);
        c.classList.add("card");
        value.appendChild(c);
    }
  }
}
/*
  This funciton makes the move
*/
function makeMove(){
  //only make the move if the game is in progress
  if(inProgress){
    if (hands[0].length != 0 && hands[1].length !=0)
    {
    //player 1 turn
    if(turn){
      var card = hands[0].shift();
      moves[0] = card;
      renderMove(card);
      turn = false;
    }
    //player 2 turn
    else if(!turn){
      var card = hands[1].shift();
      moves[1] = card;
      renderMove(card);
      checkMoves();
      turn = true;
    }
   }
 }
 //else game over
 else {
   endGame();
 }
}

/*
 This function checks the moves and adjusts the scores
*/
function checkMoves(card) {
  var value = moves[0].value;
  var valueTwo = moves[1].value;

  //change the value of the ace value
  if(value == 1) {value = 14;}
  else if(valueTwo == 1) {valueTwo = 14;}
  //console.log(value + " " + valueTwo);

  if(value > valueTwo){
    playerOneScore++;
    hands[0].splice(hands[0].length,0,moves[0]);
    hands[0].splice(hands[0].length,0,moves[1]);
  }
  else if(value < valueTwo){
    playerTwoScore++;
    hands[1].splice(hands[1].length, 0, moves[0]);
    hands[1].splice(hands[1].length,0, moves[1]);


  }
  else if(value == valueTwo){
    declareWar();
  }

  console.log(hands);
  renderScores();
}

/*
 This function does war
*/
var declareWar = function() {

  console.log("war");
}

/*
 This function starts the game
*/
function startGame() {
  if (inProgress) {

  }
  else {

  }
}
/*
 THis function ends the game
*/
function endGame(){

}

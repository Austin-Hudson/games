var war             = new Deck(),
    hands           = [],
    numOfPlayers    = 2,
    handSize        = 26,
    playerOneScore  = 0,
    playerTwoScore  = 0
    turn            = true;

//get the start button and make an event listener for it
var startButton = document.querySelector('button');
startButton.addEventListener('click', function() {
  start();
});

var page = document.querySelector("html");
page.addEventListener("click", function(){
    makeMove();
});

/*
This function starts the game
*/
function start(){
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
  console.log(hands[0]);
  //render each decks
  // if(hands[0][0].getSize() != 0){
  //   var playerOneDeck = document.getElementById("deck");
  //   playerOneDeck.innerHTML = "";
  //   var image = document.createElement("img");
  //   var dir = "cards/" + "_Back.png";
  //   image.setAttribute("src", dir);
  //   image.classList.add("card");
  //   playerTwoDeck.appendChild(image);
  // }
  //
  // if(hands[1][0].getSize() != 0){
  //   var playerTwoDeck = document.getElementById("deck");
  //   playerTwoDeck.innerHTML = "";
  //   var image = document.createElement("img");
  //   var dir = "cards/" + "_Back.png";
  //   image.setAttribute("src", dir);
  //   image.classList.add("card");
  //   playerTwoDeck.appendChild(image);
  // }

}
/*
  This funciton makes the move
*/
function makeMove(){

}

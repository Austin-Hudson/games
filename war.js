var war             = new Deck(),
    hands           = [],
    numOfPlayers    = 2,
    handSize        = 26,
    playerOneScore  = 0,
    playerTwoScore  = 0;

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
  war.createDeck();
  //shuffle deck
  war.shuffle();
  //deal to the number of players
  hands = war.dealToNPlayers(numOfPlayers, handSize)
  //render scores
  renderScores();
  //hide button
  startButton.classList.add("hidden");
}

/*
 This function renders the score
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

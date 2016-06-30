//use these rules https://www.pagat.com/war/war.html
var war             = new Deck(), //deck to be used
    hands           = [], //the hands for each player
    numOfPlayers    = 2, //the number of players in the game
    handSize        = 26, //the hand size
    playerOneScore  = 0, //the score for player one
    playerTwoScore  = 0, //the score for player two
    moves           = [], //the current move that is in play
    turn            = true, //whose turn it is
    isWar           = false, //if there is war
    inProgress      = false; //the state of the game


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
  //render "table"
  var table = document.querySelector(".war-decks");
  table.style.display = "flex";
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
  //render the computer
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
  //render the image for the players hand
  if(hands[0].length != 0){
    if(turn && !isWar){
      var c = document.createElement("img");
      var value = document.getElementById("deck-one-value");
      value.innerHTML = "";
      var dir = "cards/" + card.suit + " " + card.value + ".png";
      c.setAttribute("src", dir);
      c.classList.add("card");
      value.appendChild(c);
    }
    //if its war have to render the new drawn cards
     else if(isWar){
      var c = document.createElement("img");
      var value = document.getElementById("deck-one-value");
      value.innerHTML = "";
      dir = "cards/" + moves[0].suit + " " + moves[0].value + ".png";
      c.setAttribute("src", dir);
      c.classList.add("card");
      value.appendChild(c);
    }

  }
    //if its the computer render their deck
    if(hands[1].length != 0){
      if(!turn && !isWar){
        var c = document.createElement("img");
        var value = document.getElementById("deck-two-value");
        value.innerHTML = "";
        var dir = "cards/" + card.suit + " " + card.value + ".png";
        c.setAttribute("src", dir);
        c.classList.add("card");
        value.appendChild(c);
    }
    //if its war render their card that they had to flip in war
      else if(isWar){
        var c = document.createElement("img");
        var value = document.getElementById("deck-two-value");
        value.innerHTML = "";
        dir = "cards/" + moves[1].suit + " " + moves[1].value + ".png";
        c.setAttribute("src", dir);
        c.classList.add("card");
        value.appendChild(c);
      }
  }
}

/*
 This function renders the war
*/
function renderWar(){
  var scores = document.querySelector(".players-scores");
  var isW = document.querySelector(".war");

  //if there is war, render some text onto the screen
  if(isW == null || isW.length == 0){
    var w = document.createElement("div");
    w.classList.add("war");
    var content = document.createTextNode("WAR!");
    w.appendChild(content);
    //JQuerty to insert after scores
    $(w).insertAfter(scores);
  }
  else {
    //
  }

}
/*
 This funciton removes the war element
*/
function removeWar(){
  var w = document.querySelector(".war");
  if(w != null && w.length != 0){
    w.innerHTML = "";
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
   else {
     inProgress = false;
   }
 }
 //else game over
 else {
   inProgress = false;
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
  console.log(value + " " + valueTwo);
  //if player one drew a higher value
  if(value > valueTwo){
    playerOneScore++;
    hands[0].splice(hands[0].length,0,moves[0]);
    hands[0].splice(hands[0].length,0,moves[1]);
    removeWar();
  }//if the computer drew a higher value
  else if(value < valueTwo){
    playerTwoScore++;
    hands[1].splice(hands[1].length, 0, moves[0]);
    hands[1].splice(hands[1].length,0, moves[1]);
    removeWar();
  } //if there is war
  else if(value == valueTwo){
    isWar = true;
    declareWar();
    renderWar();
    renderMove();
    isWar = false;
  }

  renderScores();
}

/*
 This function does war when there is war
*/
var declareWar = function() {
  console.log("WARRRR!");
  //flip first card for each player
  var flippedCard = hands[0][0];
  hands[0] = hands[0].slice(1);

  var flippCard2 = hands[1][0];
  hands[1] = hands[1].slice(1);

  //draw the next card
  var card = hands[0].shift();
  moves[0] = card;

  var card2 = hands[1].shift();
  moves[1] = card2;

}

/*
 This function starts the game
*/
function startGame() {
  if (inProgress) {

  }
  else {
      endGame();
  }
}
/*
 THis function ends the game
*/
function endGame(){
    var winner;
    //figure out the winner
    if(playerOneScore > playerTwoScore){
      winner = "Player 1 wins!";
    }
    else {
      winner = "Player 2 wins!";
    }

    var r = document.querySelector(".winner")
    //display the winner
    if(r.length != 0 && r != null){
      var b = document.querySelector("body");
      var result = document.createElement("div");
      result.classList.add("winner");
      var w = document.createTextNode(winner);
      result.appendChild(w);
      b.appendChild(result);
   }

}

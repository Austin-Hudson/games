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
    winnerPile      = [], //pile cards for the people that won the war
    inProgress      = false, //the state of the game
    winner          = "";  //for who won the war


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
    var dir = "cards/" + "Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerOneDeck.appendChild(image);
  }
  //render the computer
  if(hands[1].length != 0){
    var playerTwoDeck = document.getElementById("deck-two");
    playerTwoDeck.innerHTML = "";
    var image = document.createElement("img");
    var dir = "cards/" + "Back.png";
    image.setAttribute("src", dir);
    image.classList.add("card");
    playerTwoDeck.appendChild(image);
  }

}

/*
 This function renders the move
*/
function renderMove(card){
  console.log("h1:", hands[0].length);
  console.log("h2", hands[1].length);
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
    isW.innerText = "WAR!";
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
  console.log(hands[0].length + hands[1].length);
  //only make the move if the game is in progress
  if(inProgress){
    if (hands[0].length !== 0 && hands[1].length !== 0)
    {
    //player 1 turn
    if(turn){
      var card = hands[0].shift();
      moves[0] = card;
      renderMove(card);
      turn = !turn;
    }
    //player 2 turn
    else if(!turn){
      var card = hands[1].shift();
      moves[1] = card;
      renderMove(card);
      winner = checkMoves();
      turn = !turn;
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
  if(value === 1) {value = 14;}
  else if(valueTwo === 1) {valueTwo = 14;}
  //if player one drew a higher value
  if(value > valueTwo){
    playerOneScore++;
    hands[0].splice(hands[0].length, 0, moves[0]);
    hands[0].splice(hands[0].length, 0, moves[1]);
    removeWar();
    renderScores();
    return 'player1'
  }//if the computer drew a higher value
  else if(value < valueTwo){
    playerTwoScore++;
    hands[1].splice(hands[1].length, 0, moves[0]);
    hands[1].splice(hands[1].length, 0, moves[1]);
    removeWar();
    renderScores();
    return 'player2'
  } //if there is war
  else if(value === valueTwo){
    isWar = true;
    declareWar();
    giveToWinner();
    renderWar();
    renderMove();
    renderScores();
    isWar = false;
  }
}

/*
 This function does war when there is war
*/
var declareWar = function() {
  console.log("WARRRR!");
  //check if they have enough cards to do war
  if (hands[0].length > 2 && hands[1].length > 2){

    //Put current moves into winnerPile
    winnerPile.push(moves[0]);
    winnerPile.push(moves[1]);

    //Put down one more card from each player
    winnerPile.push(hands[0].shift());
    winnerPile.push(hands[1].shift());
    //make the moves to flip over
    makeMove();
    makeMove();

    //put those in the winner pile
    winnerPile.push(moves[0]);
    winnerPile.push(moves[1]);

    // //push the next card to flip over
    // winnerPile.push(hands[0].shift());
    // winnerPile.push(hands[1].shift());

    // console.log(winnerPile);

    //render it
    renderMove(winnerPile[winnerPile.length]);
    renderMove(winnerPile[winnerPile.length - 1]);

  }
  // // if one of them has one card left just use that card
  // else if (hands[0].length == 1){
  //   //draw the next card
  //   var card = hands[0].shift();
  //   moves[0] = card;
  // }
  // else if (hands[1].length == 1){
  //   var card2 = hands[1].shift();
  //   moves[1] = card2;
  // }
  // //there is war but the person has no more cards
  // else if(hands[0].length == 0){
  //   console.log("Player 2 Wins!");
  // }
  //
  // else if(hands[1].length == 0){
  //   console.log("Player 1 Wins!");
  // }

}

/*
 This function gives the card to win appropriate winner
*/
function giveToWinner() {
  if(winner === 'player1' && winnerPile.length){
    for(var i = 0; i < winnerPile.length; i++){
      hands[0].push(winnerPile.shift());
    }
    playerOneScore++;
  } else if (winner === 'player2' && winnerPile.length) {
    for(var i = 0; i < winnerPile.length; i++){
      hands[1].push(winnerPile.shift());
    }
    playerTwoScore++;
  }
}

/*
 This function starts the game
*/
function startGame() {
  if (!inProgress) {
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

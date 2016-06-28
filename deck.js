/*
Global Variables for a Deck
values - the values that a card can have
suits - the suits that a card can have
*/
var values = [1, 2, 3, 4, 5, 6, 7, 8 , 9 , 10, 11, 12, 13];
var suits = ["Clubs", "Hearts", "Diamonds", "Spades"];

/*
The card object. It takes two parameters. One for the value and another for the suit
*/
var Card = function(value, suit){
  this.value = value;
  this.suit = suit;
};

/*
The Deck object. It creates an empty deck array
*/
var Deck = function(){
  this.deck = [];
};

/*
From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype
*/
Deck.prototype = Object.create(Card.prototype);
Deck.prototype.constructor = Deck;

/*
This function creates the deck
*/
Deck.prototype.createDeck = function(){
  var index = 0;
  for(var i = 0; i < values.length; i++){
    for(var j = 0; j < suits.length; j++){
      var card = new Card(values[i], suits[j]);
      this.deck[index] = card;
      index++;
    }
  }
}

Deck.prototype.getSize = function(){
  return this.length;
}

/*
This function shuffles the deck
*/
Deck.prototype.shuffle = function(){

  var randomIndex;
  var temp;
  for(var i = 0; i < this.deck.length; i++){
    //pick a random index from 0 to deck.length - 1
    randomIndex = Math.floor(Math.random() * this.deck.length-1);

    //basic swap to switch positions
    temp = this.deck[i];
    this.deck[i] = this.deck[randomIndex];
    this.deck[randomIndex] = temp;

  }
  return this.deck;
}

/*
This function deals one card at a time from the deck
*/
Deck.prototype.deal = function(){
  //if deck is empty, you can't deal
  if(this.deck.length == 0) { return; }

  //return the first element of the deck that is removed
  else {
    return this.deck.splice(0, 1);
  }
}

/*
This function deals to n players of size n
*/
Deck.prototype.dealToNPlayers = function(numPlayers, handSize){
  //number of players that get cards
  var hands = [];
  //create n amount of hands depending on the number of players
  for(var i = 0; i < numPlayers; i++)
  {
    hands[i] = [];
  }
  //the total amount of cards that needs to be dealt to all players
  var totalCards = numPlayers * handSize;
  //determine if you have enough cards
  if(totalCards <= this.deck.length){
    //deal round-robin to all the players
    for(var i = 0; i < totalCards; i++){
      // player to deal to is calculated by taking the mod of the i-th card from the total cards
      //to deal by the the total amount of players
      var player = i % numPlayers;
      hands[player].push(this.deck[i]);
      this.deal();
    }
  }
  return hands;
}

// var deck = new Deck();
// deck.createDeck();
// //deck.shuffle();
// console.log(deck);
//
// console.log(deck.dealToNPlayers(3, 3));

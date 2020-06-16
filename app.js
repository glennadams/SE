const gameContainer = document.getElementById("game-board");
const scoreContainer = document.getElementById("score");
const newGameButton = document.querySelector("button");
let totalClicks = 0;
const cards = []
let score = 0;
const savedLowScore = JSON.parse(localStorage.getItem("lowScore")) || 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// Dynamically set game length based on number of colors
let pairsToMatch = Math.round(COLORS.length/2);

// Initiate game when the DOM loads
let shuffledColors = shuffle(COLORS);

createDivsForColors(shuffledColors);

// Initiate game when start game button clicked
newGameButton.addEventListener('click', function(e) {
    let gameBoard = document.querySelectorAll('#game-board div');
    for (let card of gameBoard) {
        card.remove();
    }
    shuffledColors = shuffle(COLORS);
    createDivsForColors(shuffledColors);
    pairsToMatch = Math.round(COLORS.length/2);
    totalClicks = 0;
    determineScore(totalClicks);
})

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let divId = 0;  
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.id = divId;
    newDiv.matched = false;
    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);
    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    divId++;
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
    if (!event.target.matched) {
        totalClicks++;
        console.log('score= ',score);
        let setColor = event.target.classList;
        event.target.style.backgroundColor = setColor;
        setTimeout(function() {
            event.target.style.backgroundColor = 'white';
            evaluateCards(event.target);
        }, 1200)
        score = determineScore(totalClicks);
    }
    else {
        alert('Card Already Matched');
        return;
    }
}

// Evalute Card Matches for each click
function evaluateCards(clickedCard) {
    // Add cards to array
    cards.push(clickedCard);
     
    // Test to see if at least two cards clicked
    // Then test for a match
    // Warn against clicking the same card or mor than 2 cards
    if (cards.length > 2) {
        alert('select only two cards at a time');
        clearCards(cards);
    }
    else if (cards.length === 2) {
        let firstCard = cards[0].classList.value;
        let secondCard = cards[1].classList.value;
        console.log('1st card:', firstCard, '2nd card: ', secondCard);
        if (cards[0].id === cards[1].id) {
            alert('Can not select the same card');
        }
        else if (firstCard === secondCard) {
            console.log('We have a match! ');
            cards[0].style.backgroundColor = firstCard;
            cards[0].matched = true;
            cards[1].style.backgroundColor = secondCard;
            cards[1].matched = true;
            pairsToMatch--;
        }
        // Rest cards array for next pair
        clearCards(cards);
    }
    else {
        return;
    }
    // Check to see if all pairs match
    if (pairsToMatch === 0) {
        gameOver();
    }
}

function clearCards (cards) {
    while(cards.length > 0) {
        cards.pop();
    }
}

function determineScore(totalClicks) {
    let score = Math.floor(totalClicks/2);
    let scoreText = `Score: ${score}`;
    scoreContainer.innerText = scoreText;
    return score;
}

function gameOver() {
    alert(`Congrats! you completed all matches`);
    let lowScore = 0;
    // Get low score
    // Check if lower than saved score
    // If yes, save new low score
    if (savedLowScore !== 0) {
        if (score < savedLowScore) {
            lowScore = score;
            alert(`Congrats! Your score of ${score} is the new low score`);
        }
        else {
            alert(`Did not beat low score of ${savedLowScore}`);
            lowScore = savedLowScore;
        }
    }
    else {
        lowScore = score;
        alert(`Congrats! Your score of ${score} is the new low score`);
    }
    localStorage.setItem("lowScore", JSON.stringify(lowScore));
}


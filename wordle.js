
window.alert('Please use the onscreen keyboard, as keyboard input does not work.')

const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const notifDisplay = document.querySelector('.notif-container')
const config = require('./config.js');
const apiKey = config.apiKey;
const apiLink = config.apiLink;


let wordle
let hint 
const ran = Math.floor(Math.random() * 21)

// Function to get the wordle.
async function getWordle() {
  const response = await fetch(apiLink, {
    headers: {
      "x-api-key": apiKey
    }
  });
  const data = await response.json()
  const {dictionary} = data

  wordle = dictionary[ran].word.toUpperCase()
  console.log(dictionary[ran].word)
}

getWordle()


// Function to get the hint of the corresponding wordle.
async function getHint() {
  const response = await fetch(apiLink, {
    headers: {
      "x-api-key": apiKey
    }
  });

  const data = await response.json();
  const { dictionary } = data;

  hint = dictionary[ran].hint;

  console.log(dictionary[ran].hint);

  
}

getHint();

// Function to display the hint to the user.
function showHint() {
  const hintText = document.getElementById("hintText");
  hintText.innerHTML = hint;
}


// Function for the user to enable DARK MODE
function toggleDark() {
    var element = document.body;
    element.classList.toggle("dark-mode")
}
toggleDark();


// Function to display the information tab.
function togglevis(){
  var element1 = document.getElementById("game")
  var element2 = document.getElementById("help")
  if (element1.style.display === "none") {
    element1.style.display = "block";
    element2.style.display = "none";
  } else {
    element1.style.display = "none";
    element2.style.display = "block";
  }
}

togglevis();

/* ------------------------------------------------------------------------------*/ 
//BUilding the keyboard

const keys = [
  'Q',
  'W',
  'E',
  'R',
  'T',
  'Y',
  'U',
  'I',
  'O',
  'P',
  'A',
  'S',
  'D',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'Z',
  'X',
  'C',
  'V',
  'B',
  'N',
  'M',
  'DEL',
  'ENTER',
]



// Giving each letter a button for the user to interact with.
keys.forEach( key => {
  const buttonElem = document.createElement('button')
  buttonElem.textContent = key
  buttonElem.setAttribute('id',key)
  buttonElem.addEventListener('click', () => handleClick(key))
  keyboard.append(buttonElem)
})



/*---------------------------------------------------------------------------- */
// Building the Tiles and Using the Tiles in the Game


//Empty arrays of rows to be filled with the letters inputted by the user.
const rowstobefilled = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  
]

let currRow = 0
let currTile = 0
let isGameOver = false


// To give each row and column of the empty array a name, to help for css styling and array filling.
rowstobefilled.forEach((rowtobefilled,rowtobefilledPos) =>{
  const rowElem = document.createElement('div')
  rowElem.setAttribute('id', 'rowtobefilled-' + rowtobefilledPos)
  rowtobefilled.forEach((block,blockPos) => {
    const tileElem = document.createElement('div')
    tileElem.setAttribute('id', 'rowtobefilled-' + rowtobefilledPos + '-tile-' + blockPos )
    tileElem.classList.add('tile')
    rowElem.append(tileElem)
  })
  tileDisplay.append(rowElem)
})



// Function to add letters clicked on the on screen keyboard to the tiles. 
const addLettertoTile = (key) => {
  if (currTile < 4 && currRow < 4 ){
    const tile = document.getElementById('rowtobefilled-' + currRow + '-tile-'+ currTile)
    tile.textContent = key
    rowstobefilled[currRow][currTile] = key
    tile.setAttribute('data',key)
    currTile++
  // console.log('rowstpbefilled' + rowstobefilled)
  }
}


// Function to adjust for certain user inputs.
const handleClick = (key) => {
  console.log('clicked' , key)
  if (!isGameOver) {
    if (key === 'DEL') {
        deleteLetterfromTile()
        return
    }
    if (key === 'ENTER') {
        checkRow()
        return
    }
    addLettertoTile(key)
  }}


// Function to remove letters from tiles.
const deleteLetterfromTile= () => { 
  if (currTile > 0){
    currTile-- 
    const tile = document.getElementById('rowtobefilled-' + currRow + '-tile-' + currTile)
    tile.textContent = ''
    rowstobefilled[currRow][currTile] = ''
    tile.setAttribute('data', '')
  } 
}


// Function to check the word inputted by the user against the wordle.
const checkRow = () => {
  const guess = rowstobefilled[currRow].join('')


  if (currTile <= 3){
    showNotif('First complete the word.')
  }
  if (currTile > 3) {
    console.log('guess is' + guess, 'wordle is ' + wordle)
    checkTile()
    if(wordle == guess){
      showNotif('Congratulations !')
      startover('Start Over')
      isGameOver = true
    }
    else{
      if (currRow >= 3){
        isGameOver = false 
        showNotifLoss('Game Over. You could not get the word.')
        startover('Start Over')
        return
      }
      if (currRow < 3){
        currRow++
        currTile = 0
      }
    }
  
  }
}


// Function to display message to the user.
const showNotif = (notif) => {
  const notifElem = document.createElement('p')
  notifElem.textContent = notif
  notifDisplay.append(notifElem)
  setTimeout(() => notifDisplay.removeChild(notifElem), 2000)
}

// Function to display Loss message to the user.
const showNotifLoss = (notif) => {
  const notifElemLoss = document.createElement('div')
  notifElemLoss.textContent = notif
  notifDisplay.append(notifElemLoss)
  
}

// Function to check each tile and give it the appropriate color code.
const checkTile = () => {
  const rowTiles = document.querySelector('#rowtobefilled-' + currRow).childNodes
  rowTiles.forEach((tile, Pos)=> {
    const datakey = tile.getAttribute('data')


    if (datakey == wordle[Pos]){
      tile.classList.add('green-overlay')
    }else if (wordle.includes(datakey)){
      tile.classList.add('yellow-overlay')
    }else{
      tile.classList.add('grey-overlay')
    }
  })
}


// Function to StartOver

const startover = (stovrmess) => {
  const buttonElemstrt = document.createElement('button')
  buttonElemstrt.textContent = stovrmess
  buttonElemstrt.addEventListener('click', () => handlestrtovr())
  notifDisplay.append(buttonElemstrt)
  
}

const handlestrtovr = () => {
  location.reload()
}
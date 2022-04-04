const startBtn = document.querySelector(".start-btn");
const container = document.getElementById("container");
const wolfsWonGameBoard = document.querySelector('.wolfsWonGameBoard');
const rabbitWinGameBoard = document.querySelector('.rabbitWinGameBoard');

let cellWith = 69;

let matrix;
let playfieldSize;
let playfield;
let characterStorage = new Array(0);
let character;
let storage = new Array(0);
let characterCoordinateStorage = new Array(0);
let posX;
let posY;
let rabbitNewPositionX;
let rabbitNewPositionY;
let distance;
let distanceByX;
let distanceByY;
let wolfNewPositionX;
let wolfNewPositionY;
let minDistance;

const characters = {
  freeCell: 0,
  rabbitCell: 1,
  wolfCell: 2,
  houseCell: 3,
  fenceCell: 4,
};

const characterItems = {
  0: "freeCell",
  1: "rabbitCell",
  2: "wolfCell",
  3: "houseCell",
  4: "fenceCell",
};

startBtn.addEventListener("click", function () {
  document.addEventListener("keydown", moveOnBoard);
  startGame();
});

const startGame = () => {
  gameStatusBoardHide('hide');
  createMatrix();
  makeCharacterStorage();
  setCharacters();
  drawPlayfield();
};

function determineCharacterCounts() {
  wolfCount = (playfieldSize * 40) / 100;
  fenceCount = (playfieldSize * 40) / 100;
}

function makeCharacterStorage() {
  determineCharacterCounts();
  characterStorage.push(characters.rabbitCell);
  characterStorage.push(characters.houseCell);
  for (let m = 0; m < wolfCount; m++) {
    characterStorage.push(characters.wolfCell);
  }
  for (let n = 0; n < fenceCount; n++) {
    characterStorage.push(characters.fenceCell);
  }
}

function setCharacters() {
  const characterStorageLength = characterStorage.length;
  let k = 0;
  do {
    setRandomPositionForCharacters();
    k++;
  } while (k < characterStorageLength);
}

function createMatrix() {
  playfieldSize = parseInt(document.getElementById("select-size").value);
  matrix = new Array(playfieldSize)
    .fill(0)
    .map(() => new Array(playfieldSize).fill(0));
  return matrix;
}

function random() {
  return Math.floor(Math.random() * playfieldSize);
}

function randomCharacter() {
  return characterStorage.shift();
}

function setRandomPositionForCharacters(){
  const i = random();
  const j = random();
  if (matrix[i][j] === characters.freeCell) {
    matrix[i][j] = randomCharacter();
  } else {
    return setRandomPositionForCharacters();
  }
}

function drawPlayfield() {
  isThereAPlayfield();
  playfield = document.createElement("div");
  playfield.setAttribute("id", "playfield");
  playfield.style.width = `${playfieldSize * cellWith}px`;
  container.appendChild(playfield);
  matrix.forEach((element) => {
    element.forEach((item) => {
      addCharacters(element, item);
    });
  });
}

function addCharacters(element, item, characterItem) {
  createCurrentElement(element, item, characterItem);
}

function createCurrentElement(element, item, characterItem) {
  characterItem = item;
  createElement(characterItems[characterItem], characterItems[characterItem]);
}

function isThereAPlayfield() {
  if (document.getElementById("playfield") !== null) {
    container.removeChild(playfield);
  }
}

function createElement(itemName, className) {
  itemName = document.createElement("div");
  itemName.classList.add(className);
  playfield.appendChild(itemName);
}

function characterCurrentCoordinate(character) {
  characterCoordinateStorage = new Array(0);
  for (let i = 0; i < matrix.length; i++) {
    if (matrix[i].includes(character)) {  
      for(let j = 0; j < matrix[i].length; j++){
        if(matrix[i][j] === character){
          posX = i;
          posY = j;
          characterCoordinateStorage.push([posX, posY]);
        }
      }
    }    
  }
}

function moveOnBoard(event){
  updateCharactersPositions(event);
}

function updateCharactersPositions(event) {
  characterCurrentCoordinate(characters.rabbitCell);
  rabbitNewPosition(event.code);
  if(rabbitCanMove(rabbitNewPositionX, rabbitNewPositionY)){
    moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
  }
  characterCurrentCoordinate(characters.wolfCell);
  while(characterCoordinateStorage.length !== 0){
    currentWolf();
    wolfNewPosition();
    if(wolfCanMove(wolfNewPositionX, wolfNewPositionY)){
    moveCharacter(characters.wolfCell, wolfNewPositionX, wolfNewPositionY);
    }  
  }
  drawPlayfield();
}

function rabbitNewPosition(event){
  if(event == "ArrowLeft"){
    if(posY === 0){
      rabbitNewPositionX = posX, rabbitNewPositionY = (playfieldSize - 1);
    }else{
      rabbitNewPositionX = posX, rabbitNewPositionY = (posY - 1);
    }
  }else if( event == "ArrowRight"){
    if(posY === (playfieldSize - 1)){
      rabbitNewPositionX = posX, rabbitNewPositionY = 0;
    }else{
      rabbitNewPositionX = posX, rabbitNewPositionY = (posY + 1);
    }
  }else if(event == "ArrowDown"){
    if(posX === (playfieldSize - 1)){
      rabbitNewPositionX = 0, rabbitNewPositionY = posY;
    }else{
      rabbitNewPositionX = (posX + 1), rabbitNewPositionY = posY;
    }  
  }else if(event == "ArrowUp"){
    if(posX === 0){
      rabbitNewPositionX = (playfieldSize - 1), rabbitNewPositionY = posY;
    }else{
      rabbitNewPositionX = (posX - 1), rabbitNewPositionY = posY;
    }    
  }
}

function moveCharacter(character, characterPositionX, characterPositionY){
  matrix[posX].splice(posY, 1, characters.freeCell);
  matrix[characterPositionX].splice(characterPositionY, 1, character);
}

function rabbitCanMove(characterPositionX, characterPositionY){
  let rabbitNextPosition = matrix[characterPositionX][characterPositionY];
  if(rabbitNextPosition == characters.fenceCell){
    return false;
  }
  if(rabbitNextPosition == characters.wolfCell){
    gameStatusBoard(characters.wolfCell, 'show');
    document.removeEventListener("keydown", moveOnBoard);
    
  }
  if(rabbitNextPosition == characters.houseCell){
    moveCharacter(characters.rabbitCell, rabbitNewPositionX, rabbitNewPositionY);
    gameStatusBoard(characters.rabbitCell, 'show');
    document.removeEventListener("keydown", moveOnBoard);
  }
  return true;
}

function currentWolf(){
  for(let m = 0; m < characterCoordinateStorage.length; m++){
    posX = characterCoordinateStorage[m][0];
    posY = characterCoordinateStorage[m][1];
    characterCoordinateStorage.shift();
    return posX, posY;
  }
}

function wolfNewPosition(){
  determineClosestDistance(posX, posY);
}

function determineClosestDistance(posX, posY){
let closestDistanceStorage = new Array(0);
if(wolfProbablePositionY = posY + 1){
  distanceByX = Math.abs(posX - rabbitNewPositionX);
  distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionX = posX + 1){
  distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
  distanceByY = Math.abs(posY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionY = posY - 1){
  distanceByX = Math.abs(posX - rabbitNewPositionX);
  distanceByY = Math.abs(wolfProbablePositionY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
if(wolfProbablePositionX = posX - 1){
  distanceByX = Math.abs(wolfProbablePositionX - rabbitNewPositionX);
  distanceByY = Math.abs(posY - rabbitNewPositionY);
  calculateDistance(closestDistanceStorage);
}
setWolfNewPositionCoordinates(closestDistanceStorage);
}

function calculateDistance(storage){
  distance = Math.floor(Math.sqrt(Math.pow(distanceByX, 2) + Math.pow(distanceByY, 2)));
  storage.push(distance);
}

function setWolfNewPositionCoordinates(storage){
  if(storage.length !== 0){
    minDistance = Math.min(...storage);
    if(minDistance === storage[0]){
      wolfNewPositionX = posX, wolfNewPositionY = posY + 1;
    }
    if(minDistance === storage[1]){
      wolfNewPositionX = posX + 1, wolfNewPositionY = posY;
    }
    if(minDistance === storage[2]){
      wolfNewPositionX = posX, wolfNewPositionY = posY - 1;
    }
    if(minDistance === storage[3]){
      wolfNewPositionX = posX - 1, wolfNewPositionY = posY;
    }
  }else{
    wolfNewPositionX = posX; wolfNewPositionY = posY;
  }
}

function wolfCanMove(characterPositionX, characterPositionY){
  let wolfNextPosition = matrix[characterPositionX][characterPositionY];
  if(wolfNextPosition == characters.fenceCell
    || wolfNextPosition == characters.wolfCell
    || wolfNextPosition == characters.houseCell
    || wolfNextPosition == undefined){
    return false;
  }
  if(wolfNextPosition == characters.rabbitCell){
    document.removeEventListener("keydown", moveOnBoard);
    gameStatusBoard(characters.wolfCell, 'show');
  }
  return true;
}

function gameStatusBoard(winnerCharacter){
  if(winnerCharacter == characters.wolfCell){
    wolfsWonGameBoard.style.zIndex = '1';
  }
  if(winnerCharacter == characters.rabbitCell){
    rabbitWinGameBoard.style.zIndex = '1';
  }
}

function gameStatusBoardHide(action){
  if(action == 'hide'){
    wolfsWonGameBoard.style.zIndex = '-1';
  }
  if(action == 'hide'){
    rabbitWinGameBoard.style.zIndex = '-1';
  }
}
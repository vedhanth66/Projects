let rock = document.querySelector(".rock");
let paper = document.querySelector(".paper");
let scissor = document.querySelector(".scissor");
let youScore = document.querySelector(".NUM1");
let compScore = document.querySelector(".NUM2");
let message = document.querySelector(".msg");
let new_game = document.querySelector(".new_game");
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
let input = 0, randomNum = 0,cY,cC;
rock.addEventListener("click", () => {
    randomNum = random(1,3);
    input = 1;
    check();
})
paper.addEventListener("click", () => {
    randomNum = random(1,3);
    input = 2;
    check();
})
scissor.addEventListener("click", () => {
    randomNum = random(1,3);
    input = 3;
    check();
})
function youCount(){
    cY = parseInt(youScore.innerText);
}
function compCount(){
    cC = parseInt(compScore.innerText);
}
function check(){
    if(input == randomNum && input != 0 && randomNum != 0){
        message.innerText = "It was a draw !";
        message.style.backgroundColor = "rgb(251, 255, 0)";
        message.style.color = "rgb(0, 0, 57)";
        input = 0;
    }
    if(input == 1 && randomNum == 2){
        message.innerText = "You put rock computer put paper... computer won";
        compCount();
        cC += 1;
        compScore.innerText = cC;
        message.style.backgroundColor = "red";
        message.style.color = "white";
        input = 0;
    }
    if(input == 1 && randomNum == 3){
        message.innerText = "You put rock computer put scissor... you won";
        youCount();
        cY += 1;
        youScore.innerText = cY;
        message.style.backgroundColor = "green";
        message.style.color = "white";
        input = 0;
    }
    if(input == 2 && randomNum == 1){
        message.innerText = "You put paper computer put rock... you won";
        youCount();
        cY += 1;
        youScore.innerText = cY;
        message.style.backgroundColor = "green";
        message.style.color = "white";
        input = 0;
    }
    if(input == 2 && randomNum == 3){
        message.innerText = "You put paper computer put scissor... computer won";
        compCount();
        cC += 1;
        compScore.innerText = cC;
        message.style.backgroundColor = "red";
        message.style.color = "white";
        input = 0;
    }
    if(input == 3 && randomNum == 1){
        message.innerText = "You put scissor computer put rock... computer won";
        compCount();
        cC += 1;
        compScore.innerText = cC;
        message.style.backgroundColor = "red";
        message.style.color = "white";
        input = 0;
    }
    if(input == 3 && randomNum == 2){
        message.innerText = "You put scissor computer put paper... you won";
        youCount();
        cY += 1;
        youScore.innerText = cY;
        message.style.backgroundColor = "green";
        message.style.color = "white";
        input = 0;
    }
}
new_game.addEventListener("click",() => {
    message.innerText = "Play your move!";
    youScore.innerText = 0;
    compScore.innerText = 0;
    message.style.backgroundColor = "rgb(0, 0, 57)";
})
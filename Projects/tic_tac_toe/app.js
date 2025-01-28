let boxs = document.querySelectorAll(".box");
let reset_button = document.querySelector(".reset");
let win = document.querySelector("h1");
let turnO = true;
const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
    ];

boxs.forEach((box) =>{
    box.addEventListener("click",() => {
        if(turnO)
            {
                box.innerText = "X";
                box.style.color = "#C1121F"
                turnO = false;
            }
        else
            {
                box.innerText = "O";
                box.style.color = "#003049"
                turnO = true;
            }
        box.disabled = true;

        check_winner();
    });
})
let win_found;
let filled;
function check_winner(){
    win_found = false;
    for(let pattern of winPatterns){
            let pos1 = boxs[pattern[0]].innerText;
            let pos2 = boxs[pattern[1]].innerText;
            let pos3 = boxs[pattern[2]].innerText;
            if(pos1 != "" && pos2 != "" && pos3 != ""){
                if(pos1 == pos2 && pos2 == pos3 && pos3 == 'O'){
                    win.innerText = `CONGRATULATIONS PLAYER 2 IS THE WINNER`;
                    disable();
                    win_found = true;
                    return;
                }
                else if(pos1 == pos2 && pos2 == pos3 && pos3 == 'X'){
                    win.innerText = `CONGRATULATIONS PLAYER 1 IS THE WINNER`;
                    disable();
                    win_found = true;
                    return;
                }
            }
    }
    if (!win_found) {
            filled = true;
        for (let b of boxs) {
            if (b.innerText === "") {
                filled = false; 
                break;
            }
        }
        if (filled) {
            win.innerText = "IT IS A DRAW, PLEASE TRY AGAIN";
            disable();
        }
    }
}
 function disable(){
    for(let b of boxs){
        b.disabled = true;
    }
 }

 reset_button.addEventListener("click",() => {
    for(let b of boxs){
        b.disabled = false;
        b.innerText = "";
    }
    win.innerText = "TIC TAC TOE";
    turnO = true;
 })
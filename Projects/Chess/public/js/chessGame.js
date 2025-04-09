const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const connect = document.querySelector(".connect");
const result = document.querySelector(".result");
const whitePlayerElement = document.getElementById("white-player");
const blackPlayerElement = document.getElementById("black-player");

const playerName = localStorage.getItem("playerName");
if (playerName) {
    document.getElementById("player-name").innerText = playerName;
    socket.emit("playerName", playerName);
}

let draggedPiece = null;
let sourceSquare = null;
let playerRole = null;

const renderBoard = () => {
    const board = chess.board();
    boardElement.innerHTML = "";

    boardElement.classList.toggle("flipped", playerRole === "b");

    board.forEach((row, rowIndex) => {
        row.forEach((square, squareIndex) => {
            const displayRow = playerRole === "b" ? 7 - rowIndex : rowIndex;
            const displayCol = playerRole === "b" ? 7 - squareIndex : squareIndex;

            const squareElement = document.createElement("div");
            squareElement.classList.add("square", (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark");
            squareElement.dataset.row = rowIndex;
            squareElement.dataset.col = squareIndex;

            if (square) {
                const pieceElement = document.createElement("div");
                pieceElement.classList.add("piece", square.color === 'w' ? "white" : "black");
                pieceElement.innerText = getPieceUnicode(square);
                pieceElement.draggable = playerRole === square.color;

                pieceElement.addEventListener("dragstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                        e.dataTransfer.setData("text/plain", "");
                    }
                });

                pieceElement.addEventListener("dragend", () => {
                    draggedPiece = null;
                    sourceSquare = null;
                });

                pieceElement.addEventListener("touchstart", (e) => {
                    if (pieceElement.draggable) {
                        draggedPiece = pieceElement;
                        sourceSquare = { row: rowIndex, col: squareIndex };
                    }
                }, { passive: true });

                pieceElement.addEventListener("touchend", (e) => {
                    if (draggedPiece && sourceSquare) {
                        const touch = e.changedTouches[0];
                        const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);

                        if (targetElement && targetElement.classList.contains("square")) {
                            const targetSource = {
                                row: parseInt(targetElement.dataset.row),
                                col: parseInt(targetElement.dataset.col)
                            };
                            handleMove(sourceSquare, targetSource);
                        }
                    }
                    draggedPiece = null;
                    sourceSquare = null;
                });

                squareElement.append(pieceElement);
            }

            squareElement.addEventListener("dragover", (e) => e.preventDefault());

            squareElement.addEventListener("drop", (e) => {
                e.preventDefault();
                if (draggedPiece) {
                    const targetSource = {
                        row: parseInt(squareElement.dataset.row),
                        col: parseInt(squareElement.dataset.col)
                    };
                    handleMove(sourceSquare, targetSource);
                }
            });

            boardElement.appendChild(squareElement);
        });
    });

    boardElement.style.flexDirection = playerRole === "b" ? "column-reverse" : "column";
};

const handleMove = (source, target) => {
    const move = {
        from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
        to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
        promotion: 'q'
    };

    socket.emit("move", move);
};

const getPieceUnicode = (piece) => {
    const unicodePieces = {
        w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
        b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♙" }
    };
    return unicodePieces[piece.color][piece.type] || "";
};

socket.on("playerRole", (role) => {
    playerRole = role;
    if (role === 'w') {
        connect.innerText = "You are playing as White";
    } else if (role === 'b') {
        connect.innerText = "You are playing as Black";
    }
    renderBoard();
});

socket.on("spectatorRole", () => {
    playerRole = null;
    connect.innerText = "You are a spectator";
    renderBoard();
});

socket.on("boardState", (fen) => {
    chess.load(fen);
    renderBoard();
});

socket.on("move", (move) => {
    chess.move(move);
    renderBoard();
});

socket.on("gameResult", (status) => {
    if (status) {
        result.innerText = status;
    } else {
        result.innerText = "Game in progress...";
    }
});

socket.on("playerInfo", (info) => {
    whitePlayerElement.innerText = info.white;
    blackPlayerElement.innerText = info.black;
});

renderBoard();
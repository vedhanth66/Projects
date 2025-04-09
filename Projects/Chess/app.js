const express = require('express');
const socket = require('socket.io');
const http = require('http');
const { Chess } = require('chess.js');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socket(server);
const chess = new Chess();

let players = {};  
let playerNames = {};  

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home", { title: "Chess" });
});

app.get("/game", (req, res) => {
    const playerName = req.query.name || "Unknown";
    res.render("index", { title: "Chess", playerName });  
});

const updatePlayerInfo = () => {
    const gameInfo = {
        white: playerNames[players.white] || "Waiting for player...",
        black: playerNames[players.black] || "Waiting for player..."
    };
    io.emit("playerInfo", gameInfo);
};

io.on("connection", function (socket) {
    console.log("New connection:", socket.id);

    socket.on("playerName", (name) => {
        if (!name || typeof name !== 'string' || name.trim() === "") {
            name = "Unknown";
        }
        playerNames[socket.id] = name.trim();

        if (!players.white) {
            players.white = socket.id;
            socket.emit("playerRole", "w");
        } else if (!players.black) {
            players.black = socket.id;
            socket.emit("playerRole", "b");
        } else {
            socket.emit("spectatorRole");
        }

        updatePlayerInfo();
    });

    socket.on("disconnect", () => {
        if (socket.id === players.white) {
            io.emit("gameResult", "White player has left the game... You win");
            delete players.white;
        } else if (socket.id === players.black) {
            io.emit("gameResult", "Black player has left the game... You win");
            delete players.black;
        }
        delete playerNames[socket.id];
        updatePlayerInfo();
    });

    socket.on("move", (move) => {
        try {
            if (chess.turn() === "w" && socket.id !== players.white) return;
            if (chess.turn() === "b" && socket.id !== players.black) return;

            const result = chess.move(move);

            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());

                if (chess.isCheckmate()) {
                    const winner = chess.turn() === "w" ? "Black" : "White"; 
                    io.emit("gameResult", `Checkmate — ${winner} wins`);
                } else if (chess.isStalemate()) {
                    io.emit("gameResult", "Stalemate — Draw");
                } else if (chess.isDraw()) {
                    io.emit("gameResult", "Draw");
                } else if (chess.isCheck()) {
                    io.emit("gameResult", "Check");
                } else {
                    io.emit("gameResult", "");
                }

            } else {
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            console.error("Move error:", err);
        }
    });

    updatePlayerInfo();
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});

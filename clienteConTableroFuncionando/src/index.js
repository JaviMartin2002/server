import { GameController } from "./GameController.js";
import { UIv1 } from "./UIv1.js";
import { ConnectionHandler } from "./services/ConnectionHandler.js";

const game = new GameController("http://localhost:3000", UIv1);

document.getElementById("rotate").addEventListener("click", () => {
    ConnectionHandler.rotatePlayer();
});

document.getElementById("move").addEventListener("click", () => {
    console.log("Mover jugador pulsado");
    ConnectionHandler.movePlayer();
});
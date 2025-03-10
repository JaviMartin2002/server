import { io } from "../../node_modules/socket.io-client/dist/socket.io.esm.min.js";
import { GameService } from "./GameService.js";

export const ConnectionHandler = {
    connected: false,
    socket: null,
    url: null,
    controller: null,
    init: (url, controller, onConnectedCallBack, onDisconnectedCallBack) => {
        ConnectionHandler.controller = controller;
        ConnectionHandler.socket = io(url);  

        const socket = ConnectionHandler.socket; 

        socket.onAny((message, payload) => {
            console.log("Esta llegando: ");
            console.log(payload);
            console.log(payload.type);
            console.log(payload.content);
        });

        socket.on("connect", () => { 
            socket.on("connectionStatus", (data) => {
                ConnectionHandler.connected = true;
                console.log("Conectado al servidor:", data);
                onConnectedCallBack();
            });

            socket.on("message", (payload) => {
                ConnectionHandler.controller.actionController(payload);
            });

            socket.on("disconnect", () => {
                ConnectionHandler.connected = false;
                console.log("Desconectado del servidor.");
                onDisconnectedCallBack();
            });
        });

        socket.on('CURRENT_PLAYERS', (players) => {
            GameService.getInstance().updatePlayers(players);
        });

        socket.on('NEW_PLAYER', (player) => {
            GameService.getInstance().do_newPlayer(player);
        });

        socket.on('PLAYER_ELIMINATED', (playerId) => {
            alert(`Player ${playerId} has been eliminated!`);
            GameService.getInstance().removePlayer(playerId);
        });
    },
    rotatePlayer: () => {
        if (ConnectionHandler.connected && ConnectionHandler.socket) {
            ConnectionHandler.socket.emit("rotatePlayer");
        }
    },
    movePlayer: () => {
        if (ConnectionHandler.connected && ConnectionHandler.socket) {
            console.log("moviendo jugador");
            ConnectionHandler.socket.emit("movePlayer");
        } else {
            console.log("No se ha podido mover el jugador");
            console.log("Estado de conexión:", ConnectionHandler.connected);
            console.log("Estado del socket:", ConnectionHandler.socket);
        }
    },
    shoot: () => {
        if (ConnectionHandler.connected && ConnectionHandler.socket) {
            console.log("disparando");
            ConnectionHandler.socket.emit("shoot");
        } else {
            console.log("No se ha podido disparar");
            console.log("Estado de conexión:", ConnectionHandler.connected);
            console.log("Estado del socket:", ConnectionHandler.socket);
        }
    }
}

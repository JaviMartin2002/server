import { ConnectionHandler } from "./services/ConnectionHandler.js";
import { GameService } from "./services/GameService.js";

export class GameController {
    #states = {
        RIGHT : 0,
        BAD : 1,
       
    };
    #state = null;
    #gameService = null;

    constructor(url, ui) {
        ui.initUI();
        this.#gameService = new GameService(ui);
        ConnectionHandler.init(url, this, () => {
            this.#state = this.#states.RIGHT;
            console.log("Conectado");
        }, () => {
            this.#state = this.#states.BAD;
            console.log("Desconectado");
        });
    }

    actionController(payload) {
        if (this.#state === this.#states.RIGHT) {
            if (payload.type === "NEW_PLAYER") {
                this.#gameService.do_newPlayer(payload.content);
            } else if (payload.type === "BOARD") {
                this.#gameService.do_newBoard(payload.content);
            }
        }
    }

    
}
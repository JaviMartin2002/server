import { Board } from "../entities/Board.js";
import { Queue } from "../Queue.js";
export class GameService {
    #states = {
        WAITING : 0,
        PLAYING : 1,
        ENDED : 2
    };
    #ui = null;
    #players = [];
    #board = null;
    #queue = null;
    #state = null;
    #parallel = null;

    #actionsList = {
        "NEW_PLAYER" : this.do_newPlayer.bind(this),
        "BOARD" : this.do_newBoard.bind(this)
    };

    constructor(ui){
        this.#state = this.#states.WAITING;
        this.#board = new Board();
        this.#queue = new Queue();
        this.#parallel = null;
        this.checkScheduler();
        this.#ui = ui;
    }

    checkScheduler() {
        if (!this.#queue.isEmpty()) {
            if (this.#parallel == null) {
                this.#parallel = setInterval(
                    async ()=>{
                        const action = this.#queue.getMessage();
                        if (action != undefined) {
                            await this.#actionsList[action.type] (action.content);
                        } else {
                            this.stopScheduler();
                        }
                    }
                );
            }
        }
    }

    stopScheduler() {
        clearInterval(this.#parallel);
        this.#parallel = null;
    }

    do (data) {
        this.#queue.addMessage(data);
        this.checkScheduler();
    };

    async do_newPlayer (payload) {
        console.log("ha llegado un jugador nuevo");
        const player = payload;
        this.#players.push(player);
        console.log(this.#players);
        this.#ui.drawPlayer(player);
    };

    async do_newBoard(payload) {
        this.#board.build(payload);
        this.#ui.drawBoard(this.#board.map);
    }

    movePlayer(player, direction) {
        const boardSize = this.#board.map.length;
        switch (direction) {
            case 'up':
                if (player.x > 0) player.x--;
                break;
            case 'down':
                if (player.x < boardSize - 1) player.x++;
                break;
            case 'left':
                if (player.y > 0) player.y--;
                break;
            case 'right':
                if (player.y < boardSize - 1) player.y++;
                break;
        }
        this.#ui.drawPlayer(player);
    }
    
}
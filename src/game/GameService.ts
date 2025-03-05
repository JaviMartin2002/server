import { Socket } from "socket.io";
import { Directions, Player, PlayerStates } from "../player/entities/Player";
import { Room } from "../room/entities/Room";
import { RoomService } from "../room/RoomService";
import { Game, GameStates, Messages } from "./entities/Game";
import { BoardBuilder } from "./BoardBuilder";
import { ServerService } from "../server/ServerService";
import { Board } from "./entities/Board";


export class GameService {
    private games: Game[];
    private initialPositions: { row: number, col: number }[];
    private board: Board;

    private static instance: GameService;
    private constructor() {
        this.games = [];
        this.board = new BoardBuilder().getBoard();
        this.initialPositions = [
            { row: 0, col: this.board.size - 1 },
            { row: this.board.size - 1, col: 0 },
            { row: 0, col: 0 },
            { row: this.board.size - 1, col: this.board.size - 1 }
        ];
    };

    static getInstance(): GameService {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new GameService();
        return this.instance;
    }

    public buildPlayer(socket: Socket): Player {
        return {
            id: socket,
            x: 0,
            y: 0,
            state: PlayerStates.Idle,
            direction: Directions.Up,
            visibility: true
        }
    }

    public assignInitialPosition(player: Player): void {
        if (this.initialPositions.length > 0) {
            const initialPositionIndex = Math.floor(Math.random() * this.initialPositions.length);
            const initialPosition = this.initialPositions.splice(initialPositionIndex, 1)[0];
            player.x = initialPosition.row;
            player.y = initialPosition.col;
            console.log(`Player assigned position: (${player.x}, ${player.y})`);
        } else {
            console.log("No initial positions available");
            this.initialPositions = [
                { row: 0, col: this.board.size - 1 },
                { row: this.board.size - 1, col: 0 },
                { row: 0, col: 0 },
                { row: this.board.size - 1, col: this.board.size - 1 }
            ];
        }
    }

    public addPlayer(player: Player): boolean {
        const room: Room = RoomService.getInstance().addPlayer(player);
        this.assignInitialPosition(player);
        // ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, player);
        // ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, { id: player.id.id, x: player.x, y: player.y, state: player.state, direction: player.direction, visibility: player.visibility });
        const genRanHex = (size: Number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        if (room.players.length == 1) {
            const game: Game = {
                id: "game" + genRanHex(128),
                state: GameStates.WAITING,
                room: room,
                board: this.board
            }
            room.game = game;
            
            this.games.push(game);

            
        }

        if (room.occupied) {
            if (room.game) {
                room.game.state = GameStates.PLAYING;
                if (ServerService.getInstance().isActive()) {
                    ServerService.getInstance().sendMessage(room.name, Messages.BOARD, room.game.board);
                    ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, {
                        initialPositions: [
                            { id: player.id.id, x: player.x, y: player.y, state: player.state, direction: player.direction, visibility: player.visibility },
                            { id: player.id.id, x: player.x, y: player.y, state: player.state, direction: player.direction, visibility: player.visibility },
                            { id: player.id.id, x: player.x, y: player.y, state: player.state, direction: player.direction, visibility: player.visibility },
                            { id: player.id.id, x: player.x, y: player.y, state: player.state, direction: player.direction, visibility: player.visibility }
                        ]
                    });
                }
            }
            const playersData = room.players.map(p => ({
                id: p.id.id,
                x: p.x,
                y: p.y,
                state: p.state,
                direction: p.direction,
                visibility: p.visibility
            }));
            ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, playersData);
            return true;
        } else {
            ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, {
                id: player.id.id,
                x: player.x,
                y: player.y,
                state: player.state,
                direction: player.direction,
                visibility: player.visibility
            });
        }

        return false;
    }

    
}

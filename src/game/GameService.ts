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
            direction: Directions.Right,
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

    public rotatePlayer(playerId: string): boolean {
        const room = this.games.find(game => game.room.players.some(p => p.id.id === playerId))?.room;
        if (!room) return false;
    
        const player = room.players.find(p => p.id.id === playerId);
        if (!player) return false;
    
        switch (player.direction) {
            case Directions.Up:
                player.direction = Directions.Right;
                break;
            case Directions.Right:
                player.direction = Directions.Down;
                break;
            case Directions.Down:
                player.direction = Directions.Left;
                break;
            case Directions.Left:
                player.direction = Directions.Up;
                break;
        }
    
        ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, room.players.map(p => ({
            id: p.id.id,
            x: p.x,
            y: p.y,
            state: p.state,
            direction: p.direction,
            visibility: p.visibility
        })));
    
        return true;
    }

    public movePlayer(playerId: string): boolean {
        const room = this.games.find(game => game.room.players.some(p => p.id.id === playerId))?.room;
        if (!room) return false;

        const player = room.players.find(p => p.id.id === playerId);
        if (!player) return false;

        let newX = player.x;
        let newY = player.y;

        switch (player.direction) {
            case Directions.Up:
                newX--;
                break;
            case Directions.Down:
                newX++;
                break;
            case Directions.Left:
                newY--;
                break;
            case Directions.Right:
                newY++;
                break;
        }

    
        if (newX >= 0 && newX < this.board.size && newY >= 0 && newY < this.board.size && !room.players.some(p => p.x === newX && p.y === newY)) {
            player.x = newX;
            player.y = newY;
            ServerService.getInstance().sendMessage(room.name, Messages.NEW_PLAYER, room.players.map(p => ({
                id: p.id.id,
                x: p.x,
                y: p.y,
                state: p.state,
                direction: p.direction,
                visibility: p.visibility
            })));
            return true;
        }

        return false;
    }

    public shoot(playerId: string): string | null {
        const room = this.games.find(game => game.room.players.some(p => p.id.id === playerId))?.room;
        if (!room) return null;
    
        const player = room.players.find(p => p.id.id === playerId);
        if (!player) return null;
    
        let targetX = player.x;
        let targetY = player.y;
    
        switch (player.direction) {
            case Directions.Up:
                targetX--;
                break;
            case Directions.Down:
                targetX++;
                break;
            case Directions.Left:
                targetY--;
                break;
            case Directions.Right:
                targetY++;
                break;
        }
    
        const targetPlayer = room.players.find(p => p.x === targetX && p.y === targetY);
        if (targetPlayer) {
            room.players = room.players.filter(p => p.id.id !== targetPlayer.id.id);
            ServerService.getInstance().sendMessage(room.name, Messages.PLAYER_ELIMINATED, targetPlayer.id.id);
            return targetPlayer.id.id;
        }
    
        return null;
    }
}
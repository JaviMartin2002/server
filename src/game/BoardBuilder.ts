import { Board } from "./entities/Board";

export class BoardBuilder {
    private board: Board;
    
    constructor() {
        this.board = {
            size: 8,
            elements: []
        }

        const initialPositions = [
            { row: 0, col: this.board.size - 1 },
            { row: this.board.size - 1, col: 0 },
            { row: 0, col: 0 },
            { row: this.board.size - 1, col: this.board.size - 1 }
        ];

        const map : Array<number[]> = [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0,0,0],
            [0,5,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,5,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,5,0],
            [0,0,5,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,5,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
        for(let i = 0; i < this.board.size; i++)
            for(let j = 0; j < this.board.size; j++)
                if(map[i][j] != 0) {
                    this.board.elements.push({x : i, y : j})
                }
        
    }

    public getBoard() : Board {
        return this.board;
    }

    public getRandomInicialPosition() : number {
        return Math.floor(Math.random() * this.board.size);
        //delete(initialPositions[2]);
    }
    
}

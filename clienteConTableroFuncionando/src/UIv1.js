import { ELEMENTS } from "./entities/Elements.js";
import { UI_BUILDER } from "./Ui.js";

export const UIv1 = UI_BUILDER.init();

UIv1.initUI = () => {
    const base = document.getElementById(UIv1.uiElements.board);
    base.classList.add("board");
}

UIv1.drawBoard = (board) => {
    console.log(board);
    if (board !== undefined) {
        const base = document.getElementById(UIv1.uiElements.board);
        base.innerHTML = '';
        base.style.gridTemplateColumns = `repeat(${board.length}, 100px)`;
        base.style.gridTemplateRows = `repeat(${board.length}, 100px)`;
        const playersPositions = [
            { row: 0, col: board.length - 1 },
            { row: board.length - 1, col: 0 },
            { row: 0, col: 0 },
            { row: board.length - 1, col: board.length - 1 }
        ];
        board.forEach((row, rowIndex) => row.forEach((element, colIndex) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            base.appendChild(tile);
            if (playersPositions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
                element === ELEMENTS.players;
                tile.classList.add("player");
            }else if (element === ELEMENTS.bush) {
                tile.classList.add("bush");
            }
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: (Math.random() * 8000) + 1000,
                easing: 'easeInOutQuad'
            });
        }));
    }
}

UIv1.drawBoard();


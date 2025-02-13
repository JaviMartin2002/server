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
        board.forEach((row, x) => row.forEach((element, y) => {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.dataset.x = x; // Add x property
            tile.dataset.y = y; // Add y property
            base.appendChild(tile);
            if (element === ELEMENTS.bush) {
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

UIv1.drawPlayer = (player) => {
    const base = document.getElementById(UIv1.uiElements.board);
    const tiles = base.getElementsByClassName("tile");
    for (let tile of tiles) {
        if (parseInt(tile.dataset.x) === player.x && parseInt(tile.dataset.y) === player.y) {
            tile.classList.add("player");
            break;
        }
    }
}

UIv1.drawBoard();


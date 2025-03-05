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
            tile.dataset.x = x; 
            tile.dataset.y = y; 
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

UIv1.drawPlayers = (players) => {
    const base = document.getElementById(UIv1.uiElements.board);
    
    //base.querySelectorAll('.player').forEach(tile => tile.classList.remove('player'));
    
    players.forEach(player => {
        const tile = base.querySelector(`[data-x="${player.x}"][data-y="${player.y}"]`);
        if (tile) {
            console.log(`Drawing player at: (${player.x}, ${player.y})`);
            tile.classList.add("player");
            anime({
                targets: tile,
                opacity: [0, 1],
                duration: 1000,
                easing: 'easeInOutQuad'
            });
        } else {
            console.error(`Tile not found at: (${player.x}, ${player.y})`);
        }
    });
}


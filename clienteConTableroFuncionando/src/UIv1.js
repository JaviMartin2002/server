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
                duration: 0,
                easing: 'easeInOutQuad'
            });
        }));
    }
}

const playerPositions = new Map(); 

UIv1.drawPlayers = (players) => {
    const base = document.getElementById(UIv1.uiElements.board);

    players.forEach(player => {
        
        if (playerPositions.has(player.id)) {
            const { x: oldX, y: oldY } = playerPositions.get(player.id);
            const oldTile = base.querySelector(`[data-x="${oldX}"][data-y="${oldY}"]`);
            if (oldTile) {
                oldTile.classList.remove("player", "up", "right", "down", "left");
            }
        }

        
        const newTile = base.querySelector(`[data-x="${player.x}"][data-y="${player.y}"]`);
        if (newTile) {
            console.log(`Drawing player ${player.id} at: (${player.x}, ${player.y})`);
            newTile.classList.add("player", player.direction.toLowerCase());

            
            playerPositions.set(player.id, { x: player.x, y: player.y });
        } else {
            console.error(`Tile not found at: (${player.x}, ${player.y})`);
        }
    });
};



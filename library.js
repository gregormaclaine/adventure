// Images
let imageList = {
  "none": "img/none.png",
  "grass": "img/grass.png",
  "brick": "img/brick.png",
  "man": "img/man2.png",
  "dog": "img/dog.png",
  "door": "img/door.png",
  "lock": "img/lock.png",
  "key": "img/key.png",
  "coin": "img/coin.png",
  "cross": "img/cross.png",
  "i-teleporter": "img/inter_teleport.png",
  "trophy": "img/trophy.png",
  "teleporter": "img/teleporter.png"
};

let images = {};

let imageNames = Object.keys(imageList);

let nonStandableBlocks = ["brick", "lock", "cross"];

function grid_loop(grid, func) {
  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[0].length; y++) {
      func(x, y);
    }
  }
  return grid;
}
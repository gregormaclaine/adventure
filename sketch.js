var man = {
  x: -1,
  y: -1,
};
var dog = {
  x: -1,
  y: -1
};

var levelInfo;
var levels;
var level_names;
var level_rects = [];
var currentLevel = "";
var currentMapIndex = 0;

var coins = 0;
let xtiles = 20;
let ytiles = 20;
var backgroundImage;
var mapInfo;
var grid;
var screen = "menu";

function drawTile(imageName, x, y) {
  if (imageName !== "cross") {
    image(images[imageName], 50 * x, 50 * y, 50, 50)
  };
};

function standableBlock(x, y) {
  if (x >= xtiles || y >= ytiles || x < 0 || y < 0) {
    return false;
  }
  var index = grid[x][y].length - 1;
  if (index < 0) {
    if (mapInfo.background === undefined) {
      return false;
    };
    return !nonStandableBlocks.includes(mapInfo.background);
  };
  topblock = grid[x][y][index];
  return !nonStandableBlocks.includes(topblock);
};

function delLayer(x, y, img) {
  if (img === undefined) {
    grid[x][y].pop();
  } else if (grid[x][y].includes(img)) {
    grid[x][y].splice(grid[x][y].indexOf(img), 1);
  };
};







function keyPressed() {
  if ([UP_ARROW, DOWN_ARROW, RIGHT_ARROW, LEFT_ARROW, 87, 83, 68, 65].includes(keyCode) && screen === "game") {
    if ((keyCode === UP_ARROW || keyCode === 87) && standableBlock(man.x, man.y - 1)) {
      dog.x = man.x;
      dog.y = man.y;
      man.y--;
    } else if ((keyCode === DOWN_ARROW || keyCode === 83) && standableBlock(man.x, man.y + 1)) {
      dog.x = man.x;
      dog.y = man.y;
      man.y++;
    } else if ((keyCode === LEFT_ARROW || keyCode === 65) && standableBlock(man.x - 1, man.y)) {
      dog.x = man.x;
      dog.y = man.y;
      man.x--;
    } else if ((keyCode === RIGHT_ARROW || keyCode === 68) && standableBlock(man.x + 1, man.y)) {
      dog.x = man.x;
      dog.y = man.y;
      man.x++;
    };

    if (grid[man.x][man.y].includes("coin")) {
      coins++;
      delLayer(man.x, man.y, "coin");
    };

    if (man.x === mapInfo.end[0] && man.y === mapInfo.end[1]) {
      currentMapIndex++;
      if (currentMapIndex >= levels[currentLevel].length) {
        screen = "menu";
        return;
      } else {
        noLoop();
        loadJSON("maps/" + levels[currentLevel][currentMapIndex], loadMap);
      };
    };

    if (mapInfo.keys[man.x.toString()] !== undefined) {
      if (mapInfo.keys[man.x.toString()][man.y.toString()] !== undefined) {
        if (grid[man.x][man.y].includes("key")) {
          var key_colour = mapInfo.keys[man.x.toString()][man.y.toString()];

          for (var x_string in mapInfo.keys) {
            for (var y_string in mapInfo.keys[x_string]) {
              var current_colour = mapInfo.keys[x_string][y_string]
              if (current_colour === key_colour) {
                var x = parseInt(x_string);
                var y = parseInt(y_string);
                delLayer(x, y, "key");
                delLayer(x, y, "lock");
                delete mapInfo.keys[x_string][y_string];
              };
            };
          };

        };
      };
    };
  };
};

function mousePressed() {
  if (screen === "menu") {
    for (let i = 0; i < level_rects.length; i++) {
      if (level_rects[i].contains(mouseX, mouseY)) {
        currentLevel = level_names[i];
        currentMapIndex = 0;
        noLoop();
        loadJSON("maps/" + levels[currentLevel][currentMapIndex], loadMap);
        screen = "game";
      };
    };
  };
};

function preload() {
  for (key in imageList) {
    images[key] = loadImage(imageList[key]);
  };
  loadJSON("levels.json", loadLevels);
};

function setup() {
  createCanvas(xtiles * 50, ytiles * 50);

  for (var i = 0; i < level_names.length; i++) {
    let x = width * 0.2;
    let y = (height * 0.35 + 120 * i) - 50;
    let b = new Button(level_names[i], x, y, width * 0.6, 100, 230);
    level_rects.push(b);
  };
};

function loadMap(json) {
  mapInfo = json;
  man.x = mapInfo.man[0];
  man.y = mapInfo.man[1];
  dog.x = mapInfo.dog[0];
  dog.y = mapInfo.dog[1];
  grid = mapInfo.grid;
  loop();
};

function loadLevels(json) {
  levelInfo = json;
  levels = json.levels;
  level_names = Object.keys(levels);
};

function draw() {
  switch (screen) {
    case "menu":
      background(200);
      textSize(70);
      textAlign(CENTER, CENTER);
      fill(0);
      text("Top Hat Adventures", width / 2, height * 0.2);

      for (var i = 0; i < level_names.length; i++) {
        level_rects[i].show();
      };
      break;

    case "search":
      break;

    case "game":
      if (mapInfo !== undefined) {
        if (mapInfo.background !== undefined) {
          grid_loop(grid, function(x, y) {
            drawTile(mapInfo.background, x, y);
          });
        };

        grid_loop(grid, function(x, y) {
          for (var i = 0; i < grid[x][y].length; i++) {
            drawTile(grid[x][y][i], x, y);
          };
        });

        drawTile("dog", dog.x, dog.y);
        drawTile("man", man.x, man.y);

        var endImage = ""
        if (currentMapIndex === levels[currentLevel].length - 1) {
          endImage = "trophy";
        } else {
          endImage = "teleporter";
        };
        drawTile(endImage, mapInfo.end[0], mapInfo.end[1]);
      };
  };
};
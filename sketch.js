let man = {
  x: -1,
  y: -1,
};
let dog = {
  x: -1,
  y: -1
};

let levels;
let people;
let level_names;

let people_rects = [];
let level_rects = [];
let person_rects = [];
let menu_button;
let people_button;

let currentLevel = "";
let currentMapIndex = 0;
let current_person = "";

let coins = 0;
const xtiles = 20;
const ytiles = 20;
let backgroundImage;
let mapInfo;
let grid;
let screen = "menu";

function drawTile(imageName, x, y) {
  if (imageName !== "cross") {
    image(images[imageName], 50 * x, 50 * y, 50, 50)
  };
};

function standableBlock(x, y) {
  if (x >= xtiles || y >= ytiles || x < 0 || y < 0) {
    return false;
  }
  let index = grid[x][y].length - 1;
  if (index < 0) {
    if (mapInfo.background === undefined) {
      return false;
    };
    return !nonStandableBlocks.includes(mapInfo.background);
  };
  let topblock = grid[x][y][index];
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
          let key_colour = mapInfo.keys[man.x.toString()][man.y.toString()];

          for (let x_string in mapInfo.keys) {
            for (let y_string in mapInfo.keys[x_string]) {
              let current_colour = mapInfo.keys[x_string][y_string]
              if (current_colour === key_colour) {
                let x = parseInt(x_string);
                let y = parseInt(y_string);
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
  } else if (screen === "people") {
    for (let i = 0; i < people_rects.length; i++) {
      if (people_rects[i].contains(mouseX, mouseY)) {
        current_person = people_rects[i].text;

        person_rects = [];
        for (let i = 0; i < people[current_person].maps.length; i++) {
          let x = width * 0.2;
          let y = (height * 0.35 + 120 * i) - 50;
          let name = people[current_person].maps[i].slice(0, -5);
          let b = new Button(name, x, y, width * 0.6, 100, 230);
          person_rects.push(b);
        };
        screen = "person";
      };
    };
  } else if (screen === "person") {
    for (let i = 0; i < person_rects.length; i++) {
      if (person_rects[i].contains(mouseX, mouseY)) {
        let map_name = person_rects[i].text + ".json";
        if (levels[map_name] === undefined) {
          levels[map_name] = [map_name];
        };

        currentLevel = map_name;
        currentMapIndex = 0;
        noLoop();
        loadJSON("maps/" + levels[currentLevel][currentMapIndex], loadMap);
        screen = "game";
      };
    };
  };

  if (menu_button.contains(mouseX, mouseY) && screen !== "game") {
    screen = "menu";
  } else if (people_button.contains(mouseX, mouseY) && screen !== "game") {
    screen = "people";
  };
};

function preload() {
  for (let key in imageList) {
    images[key] = loadImage(imageList[key]);
  };
  loadJSON("info.json", loadInfo);
};

function setup() {
  createCanvas(xtiles * 50, ytiles * 50);

  for (let i = 0; i < level_names.length; i++) {
    let x = width * 0.2;
    let y = (height * 0.35 + 120 * i) - 50;
    let b = new Button(level_names[i], x, y, width * 0.6, 100, 230);
    level_rects.push(b);
  };

  menu_button = new Button("MENU", width * 0.1, 5, width * 0.35, 50, 230);
  people_button = new Button("PEOPLE", width * 0.55, 5, width * 0.35, 50, 230);

  for (let i = 0; i < people_names.length; i++) {
    let name = people_names[i];

    let xi = i % 4;
    let yi = floor(i / 4);

    let x = width * (0.075 + xi * 0.225);
    let y = height * (0.225 + yi * 0.25);

    let b = new Image_Button(name, x, y, width * 0.2, height * 0.2, 230, people[name].image);;
    people_rects.push(b);
  }
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

function loadInfo(json) {
  levels = json.levels;
  level_names = Object.keys(levels);
  people = json.people;
  people_names = Object.keys(people);

  for (let i = 0; i < people_names.length; i++) {
    let name = people_names[i];
    people[name].image = loadImage(people[name].image_path);
  };
};

function draw() {
  switch (screen) {
    case "menu":
      background(200);
      textSize(70);
      textAlign(CENTER, CENTER);
      fill(0);
      text("Top Hat Adventures", width / 2, height * 0.2);

      textSize(20);
      menu_button.show();
      people_button.show();

      for (let i = 0; i < level_names.length; i++) {
        textSize(40);
        level_rects[i].show();
      };
      break;

    case "people":
      background(200);

      textSize(70);
      textAlign(CENTER, CENTER);
      fill(0);
      text("People", width / 2, height * 0.125);

      textSize(20);
      menu_button.show();
      people_button.show();

      for (let i = 0; i < people_rects.length; i++) {
        textSize(40);
        people_rects[i].show();
      };
      break;

    case "person":
      background(200);

      textSize(70);
      textAlign(CENTER, CENTER);
      fill(0);
      text(current_person, width / 2, height * 0.2);

      textSize(20);
      menu_button.show();
      people_button.show();

      for (let i = 0; i < level_names.length; i++) {
        textSize(40);
        if (person_rects[i] !== undefined) {
          person_rects[i].show();
        }
      };
      break;

    case "game":
      if (mapInfo !== undefined) {
        if (mapInfo.background !== undefined) {
          grid_loop(grid, function(x, y) {
            drawTile(mapInfo.background, x, y);
          });
        };

        grid_loop(grid, function(x, y) {
          for (let i = 0; i < grid[x][y].length; i++) {
            drawTile(grid[x][y][i], x, y);
          };
        });

        drawTile("dog", dog.x, dog.y);
        drawTile("man", man.x, man.y);

        let endImage = ""
        if (currentMapIndex === levels[currentLevel].length - 1) {
          endImage = "trophy";
        } else {
          endImage = "teleporter";
        };
        drawTile(endImage, mapInfo.end[0], mapInfo.end[1]);
      };
  };
};
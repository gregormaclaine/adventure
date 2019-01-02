var xtiles = 20;
var ytiles = 20;
let gridLineWidth = 4;
var currentBlock = "grass";
var currentKeyID = "none";

let man = [-1, -1];
let dog = [-1, -1];
let end = [-1, -1];

let tile_options = [];

let grid = new Array(xtiles);
for (var i = 0; i < xtiles; i++) {
  grid[i] = new Array(ytiles);
  for (var j = 0; j < ytiles; j++) {
    grid[i][j] = new Array();
  }
};

var settings = {
  "Background": "none",
  "Drag Mode": 0,
  "Key Mode": 0
};
let settingNames = Object.keys(settings);

var key_ids = [];
// { "1":{"1":"#ff0000","5":"#ff0000"}, ..... }
var key_positions = {};

function drawTile(imageName, x, y) {
  image(images[imageName], 50 * x, 50 * y, 50, 50);
};

function drawGridLines() {
  strokeWeight(2);
  stroke(0);
  for (var i = 0; i <= xtiles; i++) {
    line(i * 50, 0, i * 50, ytiles * 50);
  }
  for (var i = 0; i <= ytiles; i++) {
    line(0, i * 50, xtiles * 50, i * 50);
  }
}

function drawKeyIds() {
  strokeWeight(1);
  stroke(0);
  for (var x_string in key_positions) {
    for (var y_string in key_positions[x_string]) {
      x = parseInt(x_string) * 50 + 25;
      y = parseInt(y_string) * 50 + 25;
      fill(key_positions[x_string][y_string]);
      ellipse(x, y, 25);
    };
  };
};

function drawTileOptions() {
  fill(200);
  strokeWeight(1);
  rect(xtiles * 50 + 50, 0, 50, ytiles * 50);

  for (let i = 0; i < tile_options.length; i++) {
    tile_options[i].show();
  }


  index = imageNames.indexOf(currentBlock);
  noFill();
  stroke(255, 255, 0);
  strokeWeight(7);
  rect(xtiles * 50 + 50, index * 50, 50, 50);

}

function drawSettings() {
  push();
  translate(xtiles * 50 + 110, 0);

  strokeWeight(1);
  stroke(0);
  fill(135, 206, 250);
  rect(0, 0, 200, ytiles * 50);

  textSize(25);
  fill(0);
  for (var i = 0; i < settingNames.length; i++) {
    settingName = settingNames[i];
    fill(0);
    strokeWeight(1);
    stroke(0);
    text(settingName, 5, i * 50 + 30);
    if (["Background"].includes(settingName)) {
      image(images[settings[settingName]], 150, 50 * i, 50, 50);
    } else if (["Key Mode", "Drag Mode"].includes(settingName)) {
      if (settings[settingName] === 1) {
        fill(0, 255, 0);
      } else {
        fill(255, 0, 0);
      }
      rect(150, 50 * i, 50, 50);
    }
  }

  pop();
}

function drawKeyMode() {
  push();
  translate(0, ytiles * 50 + 50);

  strokeWeight(1);
  stroke(0);
  fill(255, 192, 203);
  rect(0, 0, xtiles * 50, 50);

  image(images["none"], 0, 0, 50, 50);

  for (var i = 0; i < key_ids.length; i++) {
    var colour = key_ids[i];
    noStroke();
    fill(colour);
    rect(i * 50 + 50, 0, 50, 50);
  }

  if (currentKeyID === "none") {
    var index = 0;
  } else {
    var index = key_ids.indexOf(currentKeyID) + 1;
  }
  noFill();
  stroke(255, 255, 0);
  strokeWeight(7);
  rect(index * 50, 0, 50, 50);

  pop();
}

function handleTileChosen() {
  for (let i = 0; i < tile_options.length; i++) {
    if (tile_options[i].contains(mouseX, mouseY)) {
      currentBlock = tile_options[i].name;
    }
  }
}

function handleGridPlaceChosen() {
  let xIndex = floor(mouseX / 50);
  let yIndex = floor(mouseY / 50);
  if (settings["Key Mode"] === 1) {
    if (currentKeyID === "none") {
      if (key_positions[xIndex.toString()][yIndex.toString()] === undefined) return;
      delete key_positions[xIndex.toString()][yIndex.toString()];
      return;
    }
    if (key_positions[xIndex.toString()] === undefined) {
      key_positions[xIndex.toString()] = {};
    };
    key_positions[xIndex.toString()][yIndex.toString()] = currentKeyID;
    return;
  };
  if (currentBlock === "none") {
    if (xIndex === man[0] && yIndex === man[1]) {
      man = [-1, -1];
    } else if (xIndex === dog[0] && yIndex === dog[1]) {
      dog = [-1, -1];
    } else if (xIndex === end[0] && yIndex === end[1]) {
      end = [-1, -1];
    } else {
      grid[xIndex][yIndex].pop();
    }
  } else if (currentBlock === "man") {
    if (man[0] === -1 && man[1] === -1) {
      man = [xIndex, yIndex];
    }
  } else if (currentBlock === "dog") {
    if (dog[0] === -1 && dog[1] === -1) {
      dog = [xIndex, yIndex];
    }
  } else if (currentBlock === "trophy") {
    if (end[0] === -1 && end[1] === -1) {
      end = [xIndex, yIndex];
    }
  } else {
    if (!grid[xIndex][yIndex].includes(currentBlock)) {
      grid[xIndex][yIndex].push(currentBlock);
    }
  }
}


function handleSettingChosen() {
  let index = floor(mouseY / 50);
  if (index >= settingNames.length) {
    return;
  };
  var setting = settingNames[index];
  if (["Background"].includes(setting)) {
    if (!["man", "dog", "trophy", "coin"].includes(currentBlock)) {
      settings[settingNames[index]] = currentBlock;
    }
  } else if (["Key Mode", "Drag Mode"].includes(setting)) {
    if (settings[setting] === 1) {
      settings[setting] = 0;
    } else {
      settings[setting] = 1;
    }
  }
}

function handleKeyIdChosen() {
  let index = floor(mouseX / 50);
  if (index >= key_ids.length + 1) {
    return;
  };
  if (index === 0) {
    currentKeyID = "none";
  } else {
    currentKeyID = key_ids[index - 1];
  }
};

function clearGrid() {
  for (var x = 0; x < grid.length; x++) {
    for (var y = 0; y < grid[0].length; y++) {
      grid[x][y] = new Array();
    }
  }
  grid = grid_loop(grid, function(x, y) {
    grid[x][y] = new Array();
  });
}

function exportMap() {
  settings["Drag Mode"] = 0;
  var json = {
    "background": settings.Background,
    "man": man,
    "dog": dog,
    "end": end,
    "grid": grid,
    "keys": key_positions
  };
  var input = prompt("Name of Map", "map1");
  var src = input + ".json";
  save(json, src);
  alert("Saved");
}

function loadMap() {
  var json_text = prompt("Please Paste the JSON in Here");
  var json = JSON.parse(json_text);
  settings.Background = json.background;
  man = json.man;
  dog = json.dog;
  end = json.end
  teleporter = json.teleporter;
  trophy = json.teleporter
  grid = json.grid;
  key_positions = json.keys;
  key_ids = [];

  for (var x in key_positions) {
    for (var y in key_positions[x]) {
      if (!key_ids.includes(key_positions[x][y])) {
        key_ids.push(key_positions[x][y]);
      }
    }
  }

  alert("JSON Loaded");
}

function newKeyId() {
  var user_input = prompt("Please Enter a 6 Character Long Hex Colour Code");
  var colour_is_ok = /^#[0-9A-F]{6}$/i.test(user_input);
  if (colour_is_ok) {
    key_ids.push(user_input);
  };
};

function handleMouse() {
  if (mouseX > xtiles * 50 + 50 && mouseX < xtiles * 50 + 100 && mouseY >= 0 && mouseY < ytiles * 50) {
    handleTileChosen();
  } else if (mouseX >= 0 && mouseX < xtiles * 50 && mouseY >= 0 && mouseY < ytiles * 50) {
    handleGridPlaceChosen();
  } else if (mouseX > xtiles * 50 + 250 && mouseX <= xtiles * 50 + 300 && mouseY >= 0 && mouseY < ytiles * 50) {
    handleSettingChosen();
  } else if (mouseX >= 0 && mouseX < xtiles * 50 && mouseY >= ytiles * 50 + 50 && mouseY < ytiles * 50 + 100) {
    handleKeyIdChosen();
  };
}





function mouseDragged() {
  if (settings["Drag Mode"] === 1) {
    handleMouse();
  }
}

function mouseClicked() {
  handleMouse();
}

function preload() {
  for (let key in imageList) {
    images[key] = loadImage("../" + imageList[key]);
  };
};

function setup() {
  createCanvas(xtiles * 50 + 102 + 225, ytiles * 50 + 102);
  clearButton = createButton("Clear");
  clearButton.mousePressed(clearGrid);
  exportButton = createButton("Export");
  exportButton.mousePressed(exportMap);
  loadButton = createButton("Load");
  loadButton.mousePressed(loadMap);
  newKeyButton = createButton("Create New Key ID");
  newKeyButton.mousePressed(newKeyId);


  for (let i = 0; i < imageNames.length - 1; i++) {
    let b = new Image_Button(images[imageNames[i]], xtiles * 50 + 50, 50 * i, 50, 50);
    b.name = imageNames[i];
    tile_options.push(b);
  }

  index = imageNames.indexOf(currentBlock);
  noFill();
  stroke(255, 255, 0);
  strokeWeight(7);
  rect(0, index * 50, 50, 50);
}

function draw() {
  background(255);

  if (!(settings.Background === "none")) {
    grid_loop(grid, function(x, y) {
      drawTile(settings.Background, x, y);
    });
  }

  drawGridLines();
  drawTileOptions();
  drawSettings();

  if (settings["Key Mode"] === 1) {
    drawKeyMode();
  }

  grid_loop(grid, function(x, y) {
    for (var i = 0; i < grid[x][y].length; i++) {
      drawTile(grid[x][y][i], x, y);
    };
  });

  drawTile("man", man[0], man[1]);
  drawTile("dog", dog[0], dog[1]);
  drawTile("trophy", end[0], end[1]);

  if (settings["Key Mode"] === 1) {
    drawKeyIds();
  }
}
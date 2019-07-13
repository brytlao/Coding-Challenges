// Coding Challenge #11: 3D Terrain Generation
const ARB_SCL = 500;
const cols = 10;
const rows = 25;

const terrain = [];
const terrain_m = cols / 2;
const terrain_s = (ARB_SCL * 1.07) / cols;
const terrain_alt = ARB_SCL * 0.8;
const wall_alt = ARB_SCL * 11;
const trench_alt = ARB_SCL * 0.3;

let perlin_t = 0;
const perlin_s = 0.6;

let flying = 0;
const flying_s = 5;

let isTurbo = false;

function setup() {
  createCanvas(ARB_SCL, ARB_SCL, WEBGL);

  // generate terrain
  for (let y = 0; y < rows; y++) {
    terrain[y] = [];
    for (let x = 0; x < cols; x++) {
      terrain[y][x] = genTerrainPoint(x, perlin_t);
    }
    perlin_t += perlin_s;
  }
}

function draw() {
  // colors
  background(0);
  stroke(255);

  // position terrain
  translate(ARB_SCL * 0.51, ARB_SCL * 0.18, ARB_SCL * 0.5);
  rotateX(PI * 0.4);
  translate(-ARB_SCL, -ARB_SCL * rows * 0.1);

  // render terrain
  noFill();
  strokeWeight(2);
  for (let y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x < cols; x++) {
      vertex(x * terrain_s, (y * terrain_s) + flying, terrain[y][x]);
      vertex(x * terrain_s, ((y + 1) * terrain_s) + flying, terrain[y + 1][x]);
    }
    endShape();
  }

  // move terrain
  if (isTurbo) {
    flying += 100;
  } else {
    flying += flying_s;
  }

  // replace disappearing terrain
  if (flying >= terrain_s) {
    // reset
    flying = 0;
    terrain.pop();
    // replace
    const new_row = [];
    for (let x = 0; x < cols; x++) {
      //new_row.push(genTerrainPoint(x, perlin_t));
      if (x >= terrain_m - 1 && x <= terrain_m + 2) {
        new_row.push(genTerrainPoint(x, perlin_t));
      } else {
        new_row.push(genTerrainPoint(x, perlin_t));
      }

    }
    terrain.unshift(new_row);
    perlin_t += perlin_s;
  }

  // render ship
  renderShip(mouseX);
}

function mousePressed() {
  isTurbo = true;
}

function mouseReleased() {
  isTurbo = false;
}

function renderShip(in_pos) {
  // determine limits
  const ship_center = ARB_SCL * 0.5;
  const left_margin = ship_center - ARB_SCL * 0.3;
  const right_margin = ship_center + ARB_SCL * 0.3;

  // determine position
  push();
  let ship_pos = map(in_pos, 0, width, left_margin, right_margin);
  ship_pos = constrain(ship_pos, left_margin + ARB_SCL* 0.18, right_margin - ARB_SCL* 0.18);
  translate(ship_pos, ARB_SCL*2.5, ARB_SCL * 0.1);
   yy = map(mouseX, 0, ARB_SCL, PI/2, -PI/2);
  rotateY(yy);

  // design ship
  if(isTurbo) {
    fill(100, 0, 0);
  } else {
    fill(0, 0, 100);
  }

  // right body
  beginShape();
  vertex(0, 0, 0);
  vertex(0, -80, 10);
  vertex(10, 0, 10);
  vertex(0, 0, 0);
  endShape();

  // right wing
  beginShape();
  vertex(20, 0, 10);
  vertex(0, -80, 10);
  vertex(10, 0, 10);
  vertex(20, 0, 10);
  endShape();

  // left body
  beginShape();
  vertex(0, 0, 0);
  vertex(0, -80, 10);
  vertex(-10, 0, 10);
  vertex(0, 0, 0);
  endShape();

  // left wing
  beginShape();
  vertex(-10, 0, 10);
  vertex(0, -80, 10);
  vertex(-20, 0, 10);
  vertex(-10, 0, 10);
  endShape();
  pop();
}

function genTerrainPoint(x, y) {
  let point;

  // trench
  if (x == floor(terrain_m - 2) ||
    x == floor(terrain_m - 1) ||
    x == floor(terrain_m) ||
    x == floor(terrain_m + 1)) {
    point = random(0.1) * trench_alt;
  }
  // wall
  else if (x == floor(terrain_m - 3) ||
    x == floor(terrain_m + 2)) {
    point = map(noise(x, y), 0, 1, 0, 0.05) * wall_alt;
  }
  // field
  else {
    point = noise(x, y) * terrain_alt;
  }
  return point;
}
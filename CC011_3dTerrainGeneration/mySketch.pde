// Coding Challenge #11: 3D Terrain Generation

float ARB_CENTER = 220;
int cols;
int rows;

ArrayList < float[] > terrain;
int trench_m;
float terrain_s;
float altitude;
float perlin_t;
float perlin_s;

float flying;
float flying_s;

void setup() {
  size(600, 600, P3D);
  cols = 13;
  rows = 60;

  // flying
  perlin_t = 0;
  perlin_s = 0.6;
  flying = 0;
  flying_s = 6;

  // terrain params
  trench_m = int(cols / 2) - 1;
  terrain_s = 40;
  altitude = 300;
  terrain = new ArrayList < float[] > ();

  // generate terrain
  for (int y = 0; y < rows; y++) {
    float[] new_row = new float[cols];
    for (int x = 0; x < cols; x++) {
      new_row[x] = genTerrainPoint(x, perlin_t);
    }
    terrain.add(new_row);
    perlin_t += perlin_s;
  }
}

void draw() {
  // colors
  background(0);
  stroke(255);

  // position terrain
  translate(width / 2, height / 2);
  //rotateX(PI * 0.47);
  rotateX(PI * 0.43);
  translate(-ARB_CENTER, -height / 2);

  // render terrain
  noFill();
  strokeWeight(2);
  for (int y = 0; y < rows - 1; y++) {
    beginShape(TRIANGLE_STRIP);
    for (int x = 0; x < cols; x++) {
      vertex(x * terrain_s, (y * terrain_s) + flying, terrain.get(y)[x]);
      vertex(x * terrain_s, ((y + 1) * terrain_s) + flying, terrain.get(y + 1)[x]);
    }
    endShape();
  }

  // move terrain
  flying += flying_s;

  // replace disappearing terrain
  if (flying >= terrain_s) {
    // reset
    flying = 0;
    terrain.remove(rows - 1);
    // replace
    float[] new_row = new float[cols];
    for (int x = 0; x < cols; x++) {
      new_row[x] = genTerrainPoint(x, perlin_t);
    }
    terrain.add(0, new_row);
    perlin_t += perlin_s;
  }

  // render ship
  renderShip(mouseX);
}

float genTerrainPoint(float x, float y) {
  float point;

  if (x == trench_m || x == (trench_m + 1)) { // trench
    point = random(0, 0.2) * terrain_s;
  } else if (x == (trench_m - 1) || x == (trench_m + 2)) { // wall
    point = map(noise(x, y), 0, 1, 0, 0.2) * altitude;
  } else { // field
    point = noise(x, y) * altitude;
  }
  return point;
}

void renderShip(float in_pos) {
  // determine limits
  float margin = width * 0.25;
  float left_margin = ARB_CENTER - margin;
  float right_margin = ARB_CENTER + margin;
  
  // determine position
  float ship_pos = map(in_pos, 0, width, left_margin, right_margin);
  float padding = 0.25*(right_margin-left_margin);
  ship_pos = constrain(ship_pos, left_margin+padding, right_margin-padding);
  translate(ship_pos, height * 1.05, 40);

  // design ship
  fill(0, 0, 100);
  
  // right body
  beginShape();
  vertex(0, 0, 0);
  vertex(0, -40, 10);
  vertex(10, 0, 10);
  vertex(0, 0, 0);
  endShape();

  // right wing
  beginShape();
  vertex(20, 0, 10);
  vertex(0, -40, 10);
  vertex(10, 0, 10);
  vertex(20, 0, 10);
  endShape();
  
  // left body
  beginShape();
  vertex(0, 0, 0);
  vertex(0, -40, 10);
  vertex(-10, 0, 10);
  vertex(0, 0, 0);
  endShape();
  
  // left wing
  beginShape();
  vertex(-10, 0, 10);
  vertex(0, -40, 10);
  vertex(-20, 0, 10);
  vertex(-10, 0, 10);
  endShape();
}
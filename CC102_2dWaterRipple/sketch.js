// Coding Challenge #102: 2D Water Ripple

let numCol;
let numRow;
let curr = [];
let prev = [];
const damping = 0.9;

function setup() {
  pixelDensity(1);
  createCanvas(200, 200);
  numCol = width;
  numRow = height;
  for (let i = 0; i < numCol; i++) {
    curr[i] = [];
    prev[i] = [];
    for (let j = 0; j < numRow; j++) {
      curr[i][j] = 0;
      prev[i][j] = 0;
    }
  }
  prev[100][100] = 255;
}

function mouseDragged() {
  curr[mouseX][mouseY] = 255;
}

function draw() {
  background(0);
  loadPixels();

  for (let i = 1; i < numCol - 1; i++) {
    for (let j = 1; j < numRow - 1; j++) {
      curr[i][j] = (prev[i - 1][j] + prev[i + 1][j] +
        prev[i][j - 1] + prev[i][j + 1]) / 2 - curr[i][j];

      // dampening
      curr[i][j] = curr[i][j] * damping;

      // access pixels
      let index = (i + j * numCol) * 4;
      pixels[index + 0] = curr[i][j] * 255;
      pixels[index + 1] = curr[i][j] * 255;
      pixels[index + 2] = curr[i][j] * 255;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();

  // swap buffers
  const temp = prev;
  prev = curr;
  curr = temp;
}
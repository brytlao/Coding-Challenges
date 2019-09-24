// Personal Projects #4: Waterfall Graphics

// particle settings
let particles = [];
let gravity;

// display limits
let wfMinX;
let wfMaxX;
let wfMinY;
let wfMaxY;

// obstacle settings
let obstacle = [];

// nozzle settings
let nozzleFeed = [];
const nozzleSize = 6;
const nozzleVar = 0.2;
const nozzleWCount = 40;
const nozzleInterval = 1; // fastest is 1, 60fps
let resetTime = 0;

// shapes
let shapeMaker = [];

function preload() {

}

function setup() {
  createCanvas(600, 600);
  gravity = createVector(0, 0.4);

  // set limits
  wfMinX = width * 0.3;
  wfMaxX = width * 0.7;
  wfMinY = -height * 0.01;
  wfMaxY = -height * 0.2;

  // obstacle
  const pos = createVector(width / 2, 0.99 * height);
  const len = width;
  const hei = 20;
  obstacle = new Obstacle(pos, len, hei);

  // shapes
  shapeMaker = new Shape(nozzleWCount);
}

function draw() {
  background(0);

  // make shapes if queue is empty
  if (nozzleFeed.length == 0) {
    makeShapes();
  }

  // release queue
  if (frameCount % nozzleInterval == 0) {
    releaseFeed();
  }

  // run routines
  runParticleRoutine();
  runObstacleRoutine();
}

function makeShapes() {
  // make plain sheet
  pushMat2Feed(shapeMaker.genShape('sheet', 2));

  // make checkered pattern
  for (let i = 0; i < 8; i++) {
    pushMat2Feed(shapeMaker.genShape('checkered', 5));
    pushMat2Feed(shapeMaker.genShape('checkered', -5));
  }

  // make plain sheet
  pushMat2Feed(shapeMaker.genShape('sheet', 2));

  // make sine wave
  for (let i = 0; i < 8; i++) {
    pushMat2Feed(shapeMaker.genShape('sine', 5));
    pushMat2Feed(shapeMaker.genShape('sine', -5));
  }

  // make plain sheet
  pushMat2Feed(shapeMaker.genShape('sheet', 2));

  // make zigzag
  for (let i = 0; i < 8; i++) {
    pushMat2Feed(shapeMaker.genShape('zigzag', 5));
    pushMat2Feed(shapeMaker.genShape('zigzag', -5));
  }
}

function pushMat2Feed(inMat) {
  for (let currRow of inMat) {
    nozzleFeed.push(currRow);
  }
}

function genParticles(inPos) {
  const pos = createVector(inPos.x, inPos.y);
  const vel = createVector(0, 0);
  const mass = random(nozzleSize - nozzleVar, nozzleSize + nozzleVar);
  const c = color(random(150, 255), 255, 255);
  const p = new Particle(pos, vel, mass, c);
  particles.push(p);
}

function releaseFeed() {
  // if feed has items
  if (nozzleFeed.length > 0) {
    // get top of feed
    let currRelease = nozzleFeed[0];

    // scale to screen dimension
    currRelease = scaleDisc2Cont(currRelease);

    // generate the particles
    let currVector = [];
    for (let currPoint of currRelease) {
      currVector = createVector(currPoint.x, currPoint.y + wfMinY);
      genParticles(currVector);
    }

    // delete released entry
    nozzleFeed.splice(0, 1);
  }
}

function scaleDisc2Cont(inDisc) {
  let screenCoor = [];
  const nozzleInc = width / nozzleWCount;
  let xOff = nozzleInc * 0.5;
  for (let i = 0; i < inDisc.length; i++) {
    if (inDisc[i] == 1) {
      const posX = xOff;
      const posY = wfMinY;
      currVector = createVector(posX, posY);
      screenCoor.push(currVector);
    }
    xOff += nozzleInc;
  }
  return screenCoor;
}

function runParticleRoutine() {
  // run particle physics
  for (let particle of particles) {
    particle.run(gravity);
    particle.resolveCollision(obstacle);
  }

  // remove excess
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function runObstacleRoutine() {
  obstacle.render();
}
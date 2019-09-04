// Personal Projects #3: Waterfall Bloom
// LOOP FLOWER GIF by DAVESTRICK: https://giphy.com/gifs/loop-dahlia-26u43GwxpIiUgrHI4

let particles = [];
let streaks = [];
let obstacles = [];
let gravity;
let streakField;

// display limits
let wfMinX;
let wfMaxX;
let wfMinY;
let wfMaxY;
let obstacleCtr;
let obstacleLimit;

// generation rate
let particleGenRate;
let streakGenRate;

// animation sprite
let spritesheet;
const spriteSize = 320;
const spriteNumFrames = 47;
const spriteGridSize = 7;
let animation = [];
let sprites = [];

function preload() {
  spritesheet = loadImage('dahlia.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.05);

  // set limits
  wfMinX = width * 0.3;
  wfMaxX = width * 0.7;
  wfMinY = -height * 0.01;
  wfMaxY = -height * 0.2;
  sMinY = -height * 0.01;
  sMaxY = -height * 0.2;
  particleGenRate = 0.15;
  streakGenRate = 0.25;
  obstacleCtr = 0;
  obstacleLimit = 3;
  
  // flowField
  streakField = new FlowField(20);
  streakField.update();
  streakField.updatePScale(10);
  streakField.updatePRate(0.1);
  streakField.updatePStrength(2);
  
  // split frames into array
  for (let i = 0; i < spriteNumFrames; i++) {
    let x = i % spriteGridSize;
    let y = floor(i / spriteGridSize);
    let img = spritesheet.get(x * spriteSize, y * spriteSize, spriteSize, spriteSize);
    animation.push(img);
  }
}

function draw() {
  background(0);

  // particle routine
  runParticleRoutine();

  // obstacle routine
  runObstacleRoutine();

  // streak routine
  runStreakRoutine();
  streakField.update();
  //streakField.render();
}

function mouseClicked() {
  obstacleCtr++;
  if (obstacleCtr > obstacleLimit) {
    obstacles.splice(0, 1);
  }
    
  const pos = createVector(mouseX, mouseY);
  //const radius = random(30, 80);
  const radius = 20;
  const c = color(random(220, 250), random(60, 180), 50);
  obstacles.push(new Obstacle(animation, pos, radius, c));
}

function doAabbCollision(ax, ay, Ax, Ay, bx, by, Bx, By) {
  return !((Ax < bx) || (Bx < ax) || (Ay < by) || (By < ay));
}

function runObstacleRoutine() {
  for (let obstacle of obstacles) {
    // change streakField ??
    //let vectors = streakField.getVectors();

    // render
    obstacle.update();
    obstacle.render();
  }
}

function runStreakRoutine() {
  // generate particles
  if (random(1) < streakGenRate) {
    genStreaks(1);
  }

  // run streak physics
  for (let s of streaks) {
    const netForce = [];
    for (let i = 0; i < s.getStreakLength(); i++) {
      netForce.push(createVector(0, 0));
    }

    // forces
    const gravMag = 0.4;
    for (let i = 0; i < s.getStreakLength(); i++) {
      // gravity
      let lesserGravity = gravity.copy();
      lesserGravity.normalize();
      lesserGravity.mult(gravMag);
      netForce[i].add(lesserGravity);
    }

    // flow field
    const currPositions = s.getPositions();
    let fieldForces = [];
    for (let i = 0; i < currPositions.length; i++) {
      if (currPositions[i].y < height) {
        // determine effect of field at point
        const x = abs(floor(currPositions[i].x / streakField.getScl()));
        const y = abs(floor(currPositions[i].y / streakField.getScl()));
        
        // collate forces
        const index = x + y * streakField.cols;
        const currVector = streakField.getVectorAtIndex(index);
        if(currVector) { // doesn't always exist for some reason
          fieldForces.push(createVector(currVector.x, currVector.y));
        }
      }
      for (let i = 0; i < fieldForces.length; i++) {
        fieldForces[i].normalize();
        fieldForces[i].mult(gravMag * 0.005);
        netForce[i].add(fieldForces[i]);
      }
    }
    s.run(netForce);
    
    // redirecting streaks
    for (let o of obstacles) {
      s.resolveCollision(o);
    }
    
    // aging
    s.doAge();
  }

  // remove excess
  for (let i = streaks.length - 1; i >= 0; i--) {
    if (streaks[i].isFinished()) {
      streaks.splice(i, 1);
    }
  }
}

function genStreaks(inNum) {
  const num = inNum || 10;
  for (let i = 0; i < num; i++) {
    const len = random(40, 60);
    const pos = createVector(random(wfMinX, wfMaxX - 35), random(sMinY, sMaxY));
    const vel = createVector(0, 0);
    const mass = random(1, 3);
    const c = color(random(0, 100), random(100, 200), 255, 100);
    const s = new Streak(len, pos, vel, mass, c);
    streaks.push(s);
  }
}

function runParticleRoutine() {
  // generate particles
  if (random(1) < particleGenRate) {
    genParticles(1);
  }


  // run particle physics
  for (let p of particles) {
    p.run(gravity);
    for (let o of obstacles) {
      p.resolveCollision(o);
    }
  }

  // remove excess
  for (let i = particles.length - 1; i >= 0; i--) {
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }
}

function genParticles(inNum) {
  const num = inNum || 10;
  for (let i = 0; i < num; i++) {
    const pos = createVector(random(wfMinX, wfMaxX), random(wfMinY, wfMaxY));
    const vel = createVector(0, 0);
    const mass = random(2, 6);
    const c = color(random(150, 255), 255, 255);
    const p = new Particle(pos, vel, mass, c);
    particles.push(p);
  }
}
// Coding Challenge #138: Angry Birds

const {
  World,
  Engine,
  Bodies,
  Mouse,
  MouseConstraint,
  Constraint,
  Vector,
  Body
} = Matter;

// bird states
const ATTACHED = 1;
const PULLED = 2;
const RELEASED = 3;
const MATURED = 4;
const INDEPENDENT = 5;
const DYING = 6;
const RESURRECT = 7;
const RESURRECTING = 8;
let bird_state = ATTACHED;

// world objects
let ground;
const ground_sh = 0.05;
const ground_sw = 3;

let crates = [];
const crate_sx = 0.75;
const crate_sy = 0.2;
const crate_sw = 0.1;
const crate_sh = 0.2;
const crate_num = 4;

let bird;
const bird_sx = 0.4;
const bird_sy = 0.5;
const bird_sr = 0.05;

// constraints
let mouse_constraint;

let slingshot;
const slingshot_sx = 0.3;
const slingshot_sy = 0.6;
const slingshot_sl = 0.05;

// physics engine
let world;
let engine;

// timer
let timer_start;
let timer_end;
let timer_death = 3000; // in ms
let timer_resu = 1000; // in ms
let slowmo = false;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  // init matter.js
  engine = Engine.create();
  world = engine.world;

  // init objects
  ground = new Ground(width / 2, height * (1 - ground_sh / 2), width * ground_sw, height * ground_sh);
  bird = new Bird(width * bird_sx, height * bird_sy, width * bird_sr);
  for (let i = 0; i < crate_num; i++) {
    crates[i] = new Crate(width * crate_sx, height * crate_sy * (i + 1), width * crate_sw, height * crate_sh);
  }
  slingshot = new SlingShot(width * slingshot_sx, height * slingshot_sy, width * slingshot_sl, bird.body);

  // mouse interaction
  const mouse = Mouse.create(canvas.elt);
  const options = {
    mouse: mouse,
  }
  mouse.pixelRatio = pixelDensity();
  mouse_constraint = MouseConstraint.create(engine, options);
  World.add(world, mouse_constraint);
}

function draw() {
  background(0);

  // update engine
  Engine.update(engine);

  // render objects
  stroke(0);
  ground.render();
  bird.render();
  for (let crate of crates) {
    crate.render();
  }
  slingshot.render();

  // update object states
  updateBirdFsm();
}

function updateBirdFsm(in_state) {
  if (in_state) {
    bird_state = in_state;
  }

  switch (bird_state) {
    case ATTACHED:
      if (mouseIsPressed) {
        fill(255);
        console.log("clicked");
        bird_state = PULLED;
      }
      break;
    case PULLED:
      if (!mouseIsPressed) {
        console.log("released");
        bird_state = RELEASED;
      }
      break;
    case RELEASED:
      const tolerance = width * slingshot_sl;
      if (slingshot.getDistCenter() < tolerance) {
        console.log("matured");
        bird_state = MATURED;
      }
      break;
    case MATURED:
      slingshot.detach();
      console.log("independent");
      bird_state = INDEPENDENT;
      break;
    case INDEPENDENT:
      if (bird.isGrounded(ground.h)) {
        console.log("dead in " + timer_death / 1000 + " secs");
        setTimer(timer_death);
        bird_state = DYING;
      }
      break;
    case DYING:
      fill(255, map(remaningTime(), timer_death, 0, 255, 0));
      if (isTimesUp()) {
        console.log("times up!");
        bird_state = RESURRECT;
      }
      break;
    case RESURRECT:
      console.log("live!");
      setTimer(timer_resu);
      bird_state = RESURRECTING;
      break;
    case RESURRECTING:
      fill(255, map(remaningTime(), timer_death, 0, 0, 255));
      for (let i = 0; i < crate_num; i++) {
        crates[i].setVelocity(0);
        crates[i].setPosition(width * crate_sx, height * crate_sy * (i + 1));
        crates[i].setAngle(0);
      }
      slingshot.attach(bird.body);
      if (isTimesUp()) {
        console.log("time to be alive!");
        bird_state = ATTACHED;
      }
      break;
    default:
  }
}

function setTimer(in_duration) {
  timer_start = millis();
  timer_end = timer_start + in_duration;
}

function isTimesUp() {
  return (timer_end - millis() <= 0);
}

function remaningTime() {
  return (timer_end - millis());
}
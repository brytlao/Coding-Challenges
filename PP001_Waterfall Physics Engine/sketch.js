// Personal Projects #1: Waterfall Physics Engine

const {
  World,
  Engine,
  Bodies,
  Body
} = Matter;

// physics engine
let world;
let engine;

// particles
let particles = [];
const numParticles = 400;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // init matter.js
  engine = Engine.create();
  world = engine.world;

  // add particles
  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle();
  }

}

function draw() {
  background(0);

  // update engine
  Engine.update(engine)

  // render objects
  for (let p of particles) {
    p.render();
    p.offScreen();
  }
}
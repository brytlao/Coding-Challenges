// Coding Challenge #064a: Forward Kinematics

let tentacle = [];

function setup() {
  createCanvas(400, 400);
  let t = 0;
  let len = 50;
  tentacle = new Segment(width/2, height, len, radians(-45), t);
  
  let current = tentacle;
  for(let i = 0; i < 20; i++) {
    t += 0.1;
    len = len * 0.75;
    const next = new Segment(current, len, 0, t);
    current.child = next;
    current = next;
  }
}

function draw() {
  background(0);
  
  let next = tentacle;
  while (next != null) {
    next.wiggle();
    next.update();
    next.show();
    next = next.child;
  }
}
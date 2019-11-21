// Coding Challenge #064b: Inverse Kinematics

let tentacle;

function setup() {
  createCanvas(400, 400);
  
  let current = new Segment(200, 200, 10, 0);
  for (let i = 0; i < 20; i++) {
    const next = new Segment(current, 10, i);
    current.child = next;
    current = next;
  }
  tentacle = current;
}

function draw() {
  background(0);
  
  tentacle.follow(mouseX, mouseY);
  tentacle.update();
  tentacle.show();
  let next = tentacle.parent;
  while (next != null) {
    next.follow();
    next.update();
    next.show();
    next = next.parent;
  }
}
// Coding Challenge #064c: Inverse Kinematics - Fixed Point

let tentacle = [];
const numSeg = 30;
const tenWidth = 5;
const tenLength = 10;

let base = [];

function setup() {
  createCanvas(400, 400);
  append(tentacle, new Segment(200, 200, tenLength, tenWidth));
  for (let i = 1; i < numSeg; i++) {
    append(tentacle, new Segment(tentacle[i - 1], tenLength, tenWidth));
  }
  
  base = createVector(width/2, height);
}

function draw() {
  background(0);
  const total = tentacle.length;
  
  // tip
  const end = tentacle[total - 1];
  end.follow(mouseX, mouseY);
  end.update();

  // linkage behavior
  for (let i = total - 2; i >= 0; i--) {
    tentacle[i].follow(tentacle[i + 1]);
    tentacle[i].update();
  }
  
  // attachment behavior
  tentacle[0].setA(base);
  for (let i = 1; i < total; i++) {
    tentacle[i].setA(tentacle[i - 1].getB());
  }
  
  // show all
  for (let i = 0; i < total; i++) {
    tentacle[i].show();
  }
}
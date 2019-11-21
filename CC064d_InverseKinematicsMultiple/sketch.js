// Coding Challenge #064d: Inverse Kinematics - Multiple

let tentacles = [];
let len;
let apple = [];
let appleSz = 30;

function setup() {
  createCanvas(400, 400);

  // tentacles
  const di = TWO_PI / 5;
  for (let i = 0; i < TWO_PI; i += di) {
    const x = width / 2 + cos(i) * 100;
    const y = height / 2 + sin(i) * 100;
    tentacles.push(new Tentacle(x, y));
  }
  len = tentacles.length;
  
  // apple
  apple = new Particle(appleSz);
}

function draw() {
  background(0);

  // tentacles
  for (let i = 0; i < len; i++) {
    tentacles[i].update(apple.getPos().x, apple.getPos().y);
    tentacles[i].show();
  }
  
  // apple
  apple.update();
  apple.show();
}
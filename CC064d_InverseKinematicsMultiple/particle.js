class Particle {
  constructor(arg1) {
    this.rad = arg1;
    this.pos = createVector(0, 0);
    this.vel = createVector(3, 4); // arbitrary
  }

  getPos() {
    return this.pos.copy();
  }
  
  update() {
    this.pos.add(this.vel);

    // bounce back from edges
    if (this.pos.x > width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
  }

  show() {
    fill(100, 0, 0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
  }
}
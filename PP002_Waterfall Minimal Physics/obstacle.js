class Obstacle {
  constructor(pos, r, c, resistance) {
    this.pos = pos;
    this.r = r;
    this.c = c;
    this.resistance = resistance
  }

  getBoundingBox() {
    const ax = this.pos.x - this.r;
    const ay = this.pos.y - this.r;
    const bx = this.pos.x + this.r;
    const by = this.pos.y + this.r;

    return [ax, ay, bx, by];
  }

  getPos() {
    return createVector(this.pos.x, this.pos.y);
  }
  
  getRadius() {
    return this.r;
  }

  render() {
    noStroke();
    fill(this.c);
    rectMode(CENTER);
    circle(this.pos.x, this.pos.y, 2 * this.r);
  }
}
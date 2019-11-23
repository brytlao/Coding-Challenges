class Feed {
  constructor(arg1, arg2, arg3) {
    this.pos = createVector(arg1, arg2);
    this.rad = arg3 || 10;
    this.isEaten = 0;
  }

  getIsEaten() {
    return this.isEaten;
  }
  
  getPos() {
    return this.pos;
  }

  show() {
    fill(color(208, 207, 187));
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.rad, this.rad);
  }

  update(arg1) {
    let distance;
    for (let i = 0; i < arg1.length; i++) {
      distance = p5.Vector.dist(arg1[i].getPos(), this.pos);
      if (distance <= 10) {
        this.isEaten = 1;
        break;
      }
    }
  }
}
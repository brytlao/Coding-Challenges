class Segment {
  constructor(arg1, arg2, arg3, arg4) {
    if (arguments.length == 4) {
      this.a = createVector(arg1, arg2);
      this.len = arg3;
      this.b = createVector(0, 0);
      this.sw = arg4;
    } else {
      this.a = arg1.b.copy();
      this.len = arg2;
      this.b = createVector(0, 0);
      this.sw = arg3;
    }
    this.calcB();
    this.angle = 0;
  }
  
  follow(arg1, arg2) {
    if (arguments.length == 2) {
      const target = createVector(arg1, arg2);
      let dir = p5.Vector.sub(target, this.a);
      this.angle = dir.heading();
      dir.setMag(this.len);
      dir.mult(-1);
      this.a = p5.Vector.add(target, dir);
    } else {
      const targetX = arg1.a.x;
      const targetY = arg1.a.y;
      this.follow(targetX, targetY);
    }
  }
  
  getB() {
    return this.b;
  }
  
  update() {
    this.calcB();
  }
  
  setA(pos) {
    this.a = pos.copy();
    this.calcB();
  }
  
  calcB() {
    const dx = this.len * cos(this.angle);
    const dy = this.len * sin(this.angle);
    this.b.set(this.a.x + dx, this.a.y + dy);
  }
  
  show() {
    stroke(255);
    strokeWeight(this.sw);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
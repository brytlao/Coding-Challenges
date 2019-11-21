class Segment {
  constructor(arg1, arg2, arg3, arg4) {
    if (arguments.length == 4) {
      this.a = createVector(arg1, arg2);
      this.len = arg3;
      this.b = createVector(0, 0);
      this.parent = null;
      this.sw = map(arg4, 0, 20, 1, 20);
    } else {
      this.parent = arg1;
      this.a = this.parent.b.copy();
      this.len = arg2;
      this.b = createVector(0, 0);
      this.sw = map(arg3, 0, 20, 1, 20);
    }
    this.calcB();
    this.child = null;
    this.angle = 0;
  }
  
  follow(tx, ty) {
    if (arguments.length == 2) {
      const target = createVector(tx, ty);
      let dir = p5.Vector.sub(target, this.a);
      this.angle = dir.heading();
      dir.setMag(this.len);
      dir.mult(-1);
      this.a = p5.Vector.add(target, dir);
    } else {
      const targetX = this.child.a.x;
      const targetY = this.child.a.y;
      this.follow(targetX, targetY);
    }
  }
  
  update() {
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
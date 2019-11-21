class Segment {
  constructor(arg1, arg2, arg3, arg4, arg5) {
    if (arguments.length == 5) {
      this.a = createVector(arg1, arg2);
      this.len = arg3;
      this.angle = arg4;
      this.selfAngle = this.angle;
      this.parent = null;
      this.t = arg5;
    } else {
      this.parent = arg1;
      this.a = this.parent.b.copy();
      this.len = arg2;
      this.angle = arg3;
      this.selfAngle = this.angle;
      this.t = arg4;
    }
    this.calcB(); // this.b
    this.child = null;
  }
  
  wiggle() {
    const maxAngle = 0.3;
    const minAngle = -0.3;
    this.selfAngle = map(noise(this.t), 0, 1, minAngle, maxAngle);
    this.t += 0.03;
  }
  
  update() {
    this.angle = this.selfAngle;
    if (this.parent != null) {
      this.a = this.parent.b.copy();
      this.angle += this.parent.angle; //??
    } else {
      this.angle += -PI/2;
    }
    this.calcB();
  }
  
  calcB() {
    const dx = this.len * cos(this.angle);
    const dy = this.len * sin(this.angle);
    this.b = createVector(this.a.x + dx, this.a.y + dy);
  }
  
  show() {
    stroke(255);
    strokeWeight(4);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
class Bird {
  constructor(x, y, r) {
    this.body = Bodies.circle(x, y, r);
    World.add(world, this.body);
    this.r = r;
  }
  
  isGrounded(fh) {
    return (this.body.position.y >= (height - this.r * 2 - fh - 3)); // 3 is an arbitrary buffer
  }

  render() {
    // get pos from engine
    const pos = this.body.position;
    const angle = this.body.angle;

    // render
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    //fill(255);
    rectMode(CENTER);
    circle(0, 0, this.r * 2);
    pop();
  }
}
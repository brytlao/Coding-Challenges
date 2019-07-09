class Crate {
  constructor(x, y, w, h) {
    this.body = Bodies.rectangle(x, y, w, h);
    World.add(world, this.body);
    this.w = w;
    this.h = h;
  }

  getBody() {
    return this.body;
  }
  
  setPosition(in_x, in_y) {
    const new_pos = Vector.create(in_x, in_y);
    Body.setPosition(this.body, new_pos);
  }
  
  setVelocity(in_vx, in_vy) {
    const new_vel = Vector.create(in_vx, in_vy);
    Body.setVelocity(this.body, new_vel);
  }
  
  setAngle(in_angle) {
    Body.setAngle(this.body, in_angle);
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
    rect(0, 0, this.w, this.h);
    pop();
  }

}
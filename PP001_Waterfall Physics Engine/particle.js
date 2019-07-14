class Particle {
  constructor(x, y, r, c) {
    x = x || random(0.25 * width, 0.75 * width);
    y = y || random(-200, 0);
    r = r || random(1, 5);
    c = c || color(random(100, 255), 255, 255);
    this.setVisual(r, c);
    this.body = Bodies.circle(x, y, r);
    const vx = 0;
    const vy = random(0, 15);
    this.setVel(vx, vy);
    World.add(world, this.body);    
  }
  
  resetParticle() {
    const x = random(0.25 * width, 0.75 * width);
    const y = random(-200, 0);
    this.setPos(x, y);
    
    const vx = 0;
    const vy = random(0, 15);
    this.setVel(vx, vy);
    
    const r = random(1, 5);
    const c = color(random(100, 255), 255, 255);
    this.setVisual(r, c);
  }

  setVisual(r, c) {
    this.r = r;
    this.c = c;
  }
  
  setPos(x, y) {
    const options = {
      x: x,
      y: y
    }
    Body.setPosition(this.body, options);
  }
  
  setVel(vx, vy) {
    const options = {
      x: vx,
      y: vy
    }
    Body.setVelocity(this.body, options);
  }

  offScreen() {
    // reset position if off screen
    if (this.body.position.y > height) {
      console.log("off screen");
      this.resetParticle();
    }
  }

  render() {
    // get pos from engine
    const pos = this.body.position;
    const angle = this.body.angle;

    // render
    push();
    translate(pos.x, pos.y);
    rotate(angle);
    fill(this.c);
    rectMode(CENTER);
    circle(0, 0, this.r * 2);
    pop();
  }

}
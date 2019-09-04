class Particle {
  constructor(pos, vel, mass, c) {
    this.pos = pos || createVector(random(width), -10);
    this.vel = vel || createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 5;

    // visuals
    this.mass = mass || random(2, 10);
    this.c = c || color(random(150, 255), 255, 255);

    // status
    this.finished = false;
  }

  resolveCollision(inBBox) {
    const partBBox = this.getBoundingBox();
    const obstBBox = inBBox.getBoundingBox();
    const isClose = doAabbCollision(partBBox[0], partBBox[1], partBBox[2], partBBox[3],
      obstBBox[0], obstBBox[1], obstBBox[2], obstBBox[3]);
    if (isClose) {
      const distance = dist(this.pos.x, this.pos.y, inBBox.pos.x, inBBox.pos.y);
      if (distance < inBBox.getRadius()) {
        //this.c = color(255, 0, 0); // ??

        // new position
        let offset = this.pos.copy();
        offset.sub(inBBox.getPos());
        offset.normalize();
        offset.mult(inBBox.getRadius() - distance);
        this.pos.add(offset);

        // new velocity
        let bounce = this.pos.copy();
        bounce.sub(inBBox.getPos());
        bounce.normalize();
        bounce.mult(inBBox.getRadius() * this.mass * 0.02); // ??
        this.vel = bounce;

        // reduce size
        if (this.mass > 2) {
          this.mass = max(1, this.mass - 2);

          // generate new particles 
          const birthRate = 3;
          for (let s = 0; s < birthRate; s++) {
            let newPos = this.pos.copy();
            let newMass = max(1, this.mass - 1);
            let newColor = color(255); // ??
            let newVel = this.vel.copy();
            newVel.rotate(radians(random(-30, 30)));
            newVel.mult(random(0.6, 0.9));
            let newPart = new Particle(newPos, newVel, newMass, newColor);
            particles.push(newPart);
          }
        }
      }
    }
  }

  getBoundingBox() {
    const ax = this.pos.x - this.r;
    const ay = this.pos.y - this.r;
    const bx = this.pos.x + this.r;
    const by = this.pos.y + this.r;

    return [ax, ay, bx, by];
  }

  run(inForce) {
    this.applyForce(inForce);
    this.update();
    this.offScreen();
    this.render();
  }

  isFinished() {
    return this.finished;
  }

  offScreen() {
    if (this.pos.x > width + this.mass ||
      this.pos.x < -this.mass ||
      this.pos.y > height + this.mass) {
      this.finished = true;
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.acc.mult(this.mass);
    this.vel.add(this.acc);
    if (this.vel.mag() > this.maxSpeed) {
      this.vel.setMag(this.maxSpeed);
    }
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  render() {
    stroke(this.c);
    strokeWeight(this.mass);
    point(this.pos.x, this.pos.y)
  }
}
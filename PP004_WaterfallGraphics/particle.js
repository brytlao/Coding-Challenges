class Particle {
  constructor(pos, vel, mass, c, sf) {
    this.pos = pos || createVector(random(width), -10);
    this.vel = vel || createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 21;
    //this.dragFactor = 0.06;
    this.dragFactor = 0.1;
    
    // visuals
    this.mass = mass || random(2, 10);
    this.c = c || color(random(150, 255), 255, 255);

    // status
    this.bounceCount = 0;
    this.finished = false;
    this.velRes = false;
  }

  resolveCollision(inBBox) {
    const partBBox = this.getBoundingBox();
    const obstBBox = inBBox.getBoundingBox();
    const isClose = doAabbCollision(partBBox[0], partBBox[1], partBBox[2], partBBox[3],
      obstBBox[0], obstBBox[1], obstBBox[2], obstBBox[3]);
    if (isClose) {
      const distance = dist(0, this.pos.y, 0, inBBox.pos.y);
      if (distance < 0.5 * inBBox.getHeight()) {
        //this.c = color(255, 0, 0); // ??

        // new position
        let offset = createVector(0, -1);
        offset.mult(inBBox.getHeight() - distance);
        this.pos.add(offset);
        
        // new velocity
        let bounce = createVector(0, -this.vel.y);
        bounce.rotate(radians(random(-30, 30)));
        bounce.mult(random(0.3, 0.5)); // ??

        this.vel = bounce;

        // increase bounce counter
        this.bounceCount += 1;

        // reduce size
        if (this.mass > 2) {
          this.mass = max(1, this.mass - 3);

          // generate new particles 
          const birthRate = 1;
          for (let s = 0; s < birthRate; s++) {
            let newPos = this.pos.copy();
            let newMass = max(1, this.mass - 1);
            let newColor = color(255); // ??
            let newVel = this.vel.copy();
            let newSf = this.splashFactor;
            newVel.rotate(radians(random(-30, 30)));
            //newVel.mult(random(0.4, 0.6));
            let newPart = new Particle(newPos, newVel, newMass, newColor, newSf);
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
    //this.resetAtNozzle();
    this.applyForce(inForce);
    this.update();
    this.offScreen();
    this.bounceDeath();
    this.render();
  }

  resetAtNozzle() {   
    if (this.pos.y >= 0 &&
       this.velRes == false) {
      this.velRes = true;
      this.vel.y = 0;
    }
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
    // gravity
    this.acc.mult(this.mass);
    
    // drag
    let drag = this.vel.copy();
    drag.mult(this.dragFactor);
    this.acc.sub(drag);
    
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

  bounceDeath() {
    if (this.bounceCount > 1) {
      this.finished = true;
    }
  }
}

function doAabbCollision(ax, ay, Ax, Ay, bx, by, Bx, By) {
  return !((Ax < bx) || (Bx < ax) || (Ay < by) || (By < ay));
}
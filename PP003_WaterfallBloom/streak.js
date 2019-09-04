class Streak {
  constructor(len, pos, vel, mass, c) {
    // visuals
    this.len = len;
    this.mass = mass || random(2, 10);
    this.c = c || color(random(150, 255), 255, 255);
    this.gap = 30;

    // set positions
    this.pos = [];
    pos = pos.copy() || createVector(random(width), -10);
    for (let i = 0; i < this.len; i++) {
      this.pos.push(createVector(pos.x, pos.y - this.gap * i));
    }

    // set physics
    this.vel = [];
    this.acc = [];
    for (let i = 0; i < this.len; i++) {
      this.vel.push(vel || createVector(0, 0));
      this.acc.push(createVector(0, 0));
    }
    this.maxSpeed = 10;
    
    // status
    this.finished = false;
    
    // lifespan
    this.lifespan = 1000;
    this.aging = 5;
  }

  doAge() {
    this.lifespan -= this.aging;
    if (this.lifespan < 0) {
      this.finished = true;
    }
  }
  
  resolveCollision(inBBox) {
    const obstBBox = inBBox.getBoundingBox();
    let tendency = 0; // 1 is right, -1 is left
    const scale = 0.05;
        
    // inefficient, but should work.
    for (let i = 0; i < this.len; i++) {
      const currentPart = this.pos[i];
      const partBBox = this.getBoundingBox(currentPart);
      const isClose = doAabbCollision(partBBox[0], partBBox[1], partBBox[2], partBBox[3],
        obstBBox[0], obstBBox[1], obstBBox[2], obstBBox[3]);
      if (isClose) {
        const distance = dist(currentPart.x, currentPart.y, inBBox.pos.x, inBBox.pos.y);
        if (distance < inBBox.getRadius()) {
          // new position
          let offset = currentPart.copy();
          offset.sub(inBBox.getPos());
          offset.normalize();
          offset.mult(distance);
          // set tendency
          if (tendency == 0) {
            tendency = this.getDirection(offset.x);
          }
          //offset.set(tendency * abs(offset.x), offset.y);
          offset.set(tendency * abs(offset.x) * 0.3, 0);
          currentPart.add(offset);

          // new velocity
          let currentPartVel = this.vel[i];
          let bounce = currentPartVel.copy();
          bounce.sub(inBBox.getPos());
          bounce.normalize();
          bounce.mult(inBBox.getRadius() * this.mass * scale);
          bounce.set(tendency * abs(bounce.x), 0);
          currentPartVel = bounce;
        }
      }
    }
  }

  getDirection(inNum) {
    if (inNum >= 0) {
      return 1;
    } else {
      return -1;
    }
  }

  getBoundingBox(inPos) {
    const ax = inPos.x - this.mass;
    const ay = inPos.y - this.mass;
    const bx = inPos.x + this.mass;
    const by = inPos.y + this.mass;

    return [ax, ay, bx, by];
  }

  getPositions() {
    return this.pos;
  }

  getStreakLength() {
    return this.len;
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
    let sum = 0;
    for (let p of this.pos) {
      if (p.x > width + this.mass ||
        p.x < -this.mass ||
        p.y > height + this.mass) {
        sum++;
      }
    }
    if (sum == this.pos.length) {
      this.finished = true;
    }
  }

  applyForce(force) {
    for (let i = 0; i < this.pos.length; i++) {
      this.acc[i].add(force[i]);
    }
  }

  update() {
    for (let i = 0; i < this.len; i++) {
      this.acc[i].mult(this.mass);
      this.vel[i].add(this.acc[i]);
      if (this.vel[i].mag() > this.maxSpeed) {
        this.vel[i].setMag(this.maxSpeed);
      }
      this.pos[i].add(this.vel[i]);
      this.acc[i].mult(0);
    }
  }

  render() {
    // thickness
    strokeWeight(this.mass);

    for (let i = 0; i < this.pos.length - 1; i++) {
      // color
      stroke(this.c);

      // positions
      const currPoint = this.pos[i];
      const nextPoint = this.pos[i + 1];
      line(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y);
    }

  }
}
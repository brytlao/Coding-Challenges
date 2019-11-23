class Guide {
  constructor(arg1, arg2) {
    this.spe = 1;
    this.pos = createVector(arg1, arg2);
    this.dir = createVector(random(-1, 1), random(-1, 1));
    this.vel = createVector(0, 0);

    // sine motion
    this.sineTime = 0;
    this.sineInc = TWO_PI / 200;
    this.sineMag = 1;

    // randomness
    this.perlTime = 0;
    this.perlInc = 1;
    this.perlMag = 1;

    // delay timer
    this.delayTime = 0;

    // edge gap
    const fishTotalLength = 10 * fishLength;
    this.topMargin = -fishTotalLength;
    this.botMargin = fishTotalLength + height;
    this.lefMargin = -fishTotalLength;
    this.rigMargin = fishTotalLength + width;
    
    // this.edgeMargin = 0.3;
    // this.topMargin = height * -this.edgeMargin;
    // this.botMargin = height * (1 + this.edgeMargin);
    // this.lefMargin = width * -this.edgeMargin;
    // this.rigMargin = width * (1 + this.edgeMargin);

    // this.edgeMargin = 0.1;
    // this.topMargin = height * this.edgeMargin;
    // this.botMargin = height * (1 - this.edgeMargin);
    // this.lefMargin = width * this.edgeMargin;
    // this.rigMargin = width * (1 - this.edgeMargin);
  }

  setSpe(inSpe) {
    this.spe = inSpe;
  }

  setSineMag(inMag) {
    this.sineMag = inMag;
  }

  setPerlInc(inInc) {
    this.perlMag = inInc;
  }

  setPerlMag(inMag) {
    this.perlMag = inMag;
  }

  getPos() {
    return this.pos.copy();
  }

  getDir() {
    return this.dir.copy();
  }

  tickSine() {
    this.sineTime += this.sineInc;
    return this.sineMag * sin(this.sineTime);
  }

  tickPerlin() {
    this.perlTime += this.perlInc;
    return this.perlMag * noise(this.perlTime);
  }

  update(arg1) {
    // sinusoidal movement pattern
    const primAxis = createVector(this.spe, 0); // primary axis
    const perpAxis = createVector(0, this.tickSine()); // perpendicular sinusoid
    const perlin = createVector(0, this.tickPerlin()); // noise term

    this.vel.setMag(0);
    // if food exists
    if (arguments.length == 1 && arg1) {
      const toFeed = arg1.copy();
      toFeed.sub(this.pos);
      toFeed.setMag(4);
      this.vel.add(toFeed);
      this.dir.add(toFeed);
    }
    this.vel.add(primAxis);
    this.vel.add(perpAxis);
    this.vel.add(perlin);

    // direction flip delay
    if (this.delayTime > 0) {
      this.delayTime -= 1;
    }

    // bounce back from edges
    if (this.pos.x > this.rigMargin || this.pos.x < this.lefMargin ||
      this.pos.y < this.topMargin || this.pos.y > this.botMargin) {
      let canvasCenter = createVector(width / 2, height / 2);
      if (this.delayTime <= 0) {
        canvasCenter.sub(this.pos);
        canvasCenter.normalize();
        this.dir.set(canvasCenter);
        this.dir.rotate(this.flipAngle());

        this.delayTime = 50;
      }
    }

    this.vel.rotate(this.dir.heading()); // rotate to primary direction
    this.vel.setMag(this.spe);
    this.pos.add(this.vel);
  }

  show() {
    fill(100, 0, 0);
    noStroke();
    const myRad = 10;
    ellipse(this.pos.x, this.pos.y, myRad, myRad);
  }

  flipAngle() {

    if (random() < 0.5) {
      return radians(random(-20, -70));
    } else {
      return radians(random(20, 70));
    }
  }
}
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
    this.isAwkward = 0; // kinematic kink

    // body segments as trapezoids
    this.segColor = koiColor();
    this.segMargin = 5;
    this.segFrontW = 20;
    this.segBackW = 10;

    // fin movement
    this.finWidth = 0; }

  getAnchor() {
    return this.a;
  }
  
  getSegColor() {
    return this.segColor;
  }
  
  setFinWidth(arg1) {
    this.finWidth = arg1;
    this.finTaper = arg1 / 8;
    this.finMargin = arg1 / 20;
    this.finClock = 0;
    this.finInc = TWO_PI / 300;
    this.finMovMag = 0.3;
    this.finAngOffset = -0.3;
  }

  setSegMargin(arg1) {
    this.segMargin = arg1;
  }

  setSegFrontW(arg1) {
    this.segFrontW = arg1;
  }

  setSegBackW(arg1) {
    this.segBackW = arg1;
  }

  getIsAwkward() {
    return this.isAwkward;
  }

  follow(arg1, arg2) {
    if (arguments.length == 2) {
      // arg1: xCoor, arg2: yCoor
      const target = createVector(arg1, arg2);
      let dir = p5.Vector.sub(target, this.a);
      this.angle = dir.heading();
      dir.setMag(this.len);
      dir.mult(-1);
      this.a = p5.Vector.add(target, dir);
    } else if (arguments.length == 1) {
      // arg1: segment      
      const target = createVector(arg1.a.x, arg1.a.y);
      let dir = p5.Vector.sub(target, this.a);
      this.angle = dir.heading();
      dir.setMag(this.len);
      dir.mult(-1);
      this.a = p5.Vector.add(target, dir);

      // --- testbed for kinematic constraints --- //      
      // param setup
      let root = arg1.a.copy();
      let mover = arg1.b.copy();
      let ref = this.a.copy();
      let v1 = mover.sub(root);
      let v2 = ref.sub(root);

      // find angle
      let angleBet = degrees(v1.angleBetween(v2));
      let angleMove = 0;
      // limit angle
      const angleLimit = 90;
      if (angleBet > -angleLimit && angleBet < 0) {
        angleMove = -angleLimit - angleBet;
      }
      if (angleBet < angleLimit && angleBet > 0) {
        angleMove = angleLimit - angleBet;
      }
      //this.a.rotate(angleMove); //???

      // --- testbed for kinematic constraints --- //

      // avoid eating body is contorted
      this.isAwkward = 0;
      if (angleBet > -angleLimit && angleBet < angleLimit) {
        this.isAwkward = 1;
      }

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
    // lines
    // stroke(255);
    // strokeWeight(this.sw);
    // line(this.a.x, this.a.y, this.b.x, this.b.y);
    
    // trapezoid
    noStroke();
    fill(this.segColor);
    this.plotSeg(this.a, this.b);
  }

  showFins() {
    // fins
    if (this.finWidth > 0) {
      this.plotFin(this.a, this.b);
    }
  }
  
  finCoor(arg1, arg2, arg3) {
    // arg1: front point
    // arg2: back point
    // arg3: to flip
    const toFlip = arg3;

    let orig = createVector(0, 0);
    let other = createVector(0, -dist(arg1.x, arg1.y, arg2.x, arg2.y));

    // set up
    let p1, p2, p3;
    p1 = orig.copy();
    p2 = other.copy();
    p3 = other.copy();

    // top point as origin
    p1.add(0, this.finMargin);
    p2.add(0, -this.finMargin);
    if (toFlip == 1) {
      p3.add(-this.finWidth / 2, -this.finTaper);
    } else {
      p3.add(this.finWidth / 2, -this.finTaper);
    }

    // transformations
    return [p1, p2, p3];
  }

  plotFin(arg1, arg2) {
    // arg1: front point
    // arg2: back point

    this.finClock += this.finInc;
    const rotOffset = this.finMovMag * sin(this.finClock) + this.finAngOffset;

    // left fin
    const leftFin = this.finCoor(arg1, arg2, 0);

    // translate to front point
    for (let i = 0; i < leftFin.length; i++) {
      let h = arg1.copy();
      h.sub(arg2);
      leftFin[i].rotate(h.heading());
      leftFin[i].rotate(radians(90));
      leftFin[i].rotate(rotOffset);
      leftFin[i].add(arg1);
    }

    // plot
    fill(this.segColor);
    noStroke();
    triangle(leftFin[0].x, leftFin[0].y,
      leftFin[1].x, leftFin[1].y,
      leftFin[2].x, leftFin[2].y);

    // right fin
    const rightFin = this.finCoor(arg1, arg2, 1);

    // translate to front point
    for (let i = 0; i < rightFin.length; i++) {
      let h = arg1.copy();
      h.sub(arg2);
      rightFin[i].rotate(h.heading());
      rightFin[i].rotate(radians(90));
      rightFin[i].rotate(-rotOffset);
      rightFin[i].add(arg1);
    }

    // plot
    fill(this.segColor);
    noStroke();
    triangle(rightFin[0].x, rightFin[0].y,
      rightFin[1].x, rightFin[1].y,
      rightFin[2].x, rightFin[2].y);
  }

  plotSeg(arg1, arg2) {
    // arg1: front point
    // arg2: back point

    let margin = this.segMargin;
    let widthFront = this.segFrontW;
    let widthBack = this.segBackW;

    // compute for coordinates
    let orig = createVector(0, 0);
    let other = createVector(0, -dist(arg1.x, arg1.y, arg2.x, arg2.y));

    // set up
    let p1, p2, p3, p4;
    p1 = orig.copy();
    p2 = orig.copy();
    p3 = other.copy();
    p4 = other.copy();

    // top point as origin
    p1.add(-widthFront / 2, margin);
    p2.add(widthFront / 2, margin);
    p3.add(widthBack / 2, -margin);
    p4.add(-widthBack / 2, -margin);
    const trapPoints = [p1, p2, p3, p4];

    // translate to front point
    for (let i = 0; i < trapPoints.length; i++) {
      let h = arg1.copy();
      h.sub(arg2);
      trapPoints[i].rotate(h.heading());
      trapPoints[i].rotate(radians(90));
      trapPoints[i].add(arg1);
    }

    // plot
    quad(trapPoints[0].x, trapPoints[0].y,
      trapPoints[1].x, trapPoints[1].y,
      trapPoints[2].x, trapPoints[2].y,
      trapPoints[3].x, trapPoints[3].y);
  }

}

function koiColor() {
  const koiColors = [color(249, 78, 50), // dark orange
    color(232, 115, 30), // orange
    color(106, 89, 92), // dark gray
    color(171, 185, 168)
  ]; // light green

  const diceRoll = random();
  if (diceRoll > 0.4) {
    return koiColors[random(koiColors.length) | 0];
  } else if (diceRoll > 0.15) {
    return color(255, 255, 255); // white
  } else {
    return color(30, 30, 30); // black
  }
}
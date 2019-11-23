let segSizes = [10, 30, 27, 26, 26, 25, 24, 23, 22, 19, 15, 10, 8, 6, 4, 3];
let marginSizes = [2, 2, 2, 2, 2, 2, 2, 2];
let fishWidth = 15;
let fishLength = 20;
let fishSpeed = 3;
const pecFinSize = 100;
const analFinSize = 50;

class Fish {
  constructor(arg1, arg2) {
    this.segments = [];
    this.numSeg = 8;
    this.fishWidth = fishWidth;
    this.fishLength = fishLength;
    this.fishSpeed = fishSpeed;
    this.base = createVector(arg1, arg2);
    this.guide = new Guide(arg1, arg2);
    this.initGuide();
    this.isHungry = 1;

    // init fish
    const fishShape = this.fishWidth / this.fishLength;
    this.segments.push(new Segment(arg1, arg2, this.fishLength, this.fishWidth));
    for (let i = 1; i < this.numSeg; i++) {
      this.segments.push(new Segment(this.segments[i - 1], this.fishLength, this.fishWidth + i * i * fishShape));
    }

    // set sizes for segments
    let trapCounter = 0;
    for (let i = this.numSeg - 1; i >= 0; i--) {
      this.segments[i].setSegMargin(marginSizes[i]);

      this.segments[i].setSegFrontW(segSizes[trapCounter++]);
      this.segments[i].setSegBackW(segSizes[trapCounter++]);
    }

    // set sizes for fins
    this.segments[6].setFinWidth(pecFinSize);
    this.segments[3].setFinWidth(analFinSize);

    // set initial position
    this.segments[0].setA(this.base);
  }

  getPos() {
    return this.guide.getPos();
  }

  initGuide() {
    this.guide.setSpe(this.fishSpeed);
    this.guide.setSineMag(1);
    this.guide.setPerlInc(1);
    this.guide.setPerlMag(1);
  }

  update(arg1, arg2) {
    const total = this.segments.length;
    // guide
    this.isHungry = 1; // default is hungry
    if (arguments.length == 1 && arg1.length > 0) {
      // check if fish's body is contorted
      let isAwkward = 0;
      for (let i = 0; i < this.numSeg; i++) {
        if (this.segments[i].getIsAwkward() == 1) {
          isAwkward = 1;
        }
      }
      this.isHungry = (1 - isAwkward);

      // check if food is close
      for (let i = 0; i < arg1.length; i++) {
        const currDist = this.getPos().dist(arg1[i].getPos());
        if (currDist < 100) {
          this.isHungry = 1;
          break;
        }
      }

      // find location of closest food
      if (this.isHungry == 1) {
        let shortestDist = this.getPos().dist(arg1[0].getPos());
        let closestFood = 0;
        for (let i = 0; i < arg1.length; i++) {
          const currDist = this.getPos().dist(arg1[i].getPos());
          if (currDist < shortestDist) {
            closestFood = i;
            shortestDist = currDist;
          }
        }
        this.guide.update(arg1[closestFood].getPos());
      } else {
        this.guide.update();
      }
    } else {
      this.guide.update();
    }

    // tip
    const end = this.segments[total - 1];
    if (arguments.length == 2) {
      end.follow(arg1, arg2);
    } else {
      end.follow(this.guide.getPos().x, this.guide.getPos().y);
    }
    end.update();

    // linkage behavior
    for (let i = total - 2; i >= 0; i--) {
      this.segments[i].follow(this.segments[i + 1]);
      this.segments[i].update();
    }

    // attachment behavior
    //this.segments[0].setA(this.base);
    for (let i = 1; i < total; i++) {
      this.segments[i].setA(this.segments[i - 1].getB());
    }
  }

  show() {
    // show fins
    for (let i = 0; i < this.numSeg; i++) {
      this.segments[i].showFins();
    }

    // show segments
    for (let i = 0; i < this.numSeg; i++) {
      this.segments[i].show();
    }

    // show dorsal fin
    const headColor = this.segments[2].getSegColor();
    for (let i = 2; i < this.numSeg - 3; i++) {
      const currPoint = this.segments[i].getAnchor();
      const nextPoint = this.segments[i - 1].getAnchor();
      stroke(headColor);
      strokeWeight(5);
      line(currPoint.x, currPoint.y, nextPoint.x, nextPoint.y);
    }

    //this.guide.show();
  }
}

function scaleFishSizes(inScl) {
  // segment size
  for (let i = 0; i < segSizes.length; i++) {
    segSizes[i] *= inScl;
  }
  fishWidth *= inScl;
  fishLength *= inScl;

  // margin size
  for (let i = 0; i < marginSizes.length; i++) {
    marginSizes[i] *= inScl;
  }
}
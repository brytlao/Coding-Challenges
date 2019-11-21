class Tentacle {
  constructor(arg1, arg2) {
    this.segments = [];
    this.numSeg = 5;
    this.tenWidth = 5;
    this.tenLength = 20;
    this.base = createVector(arg1, arg2);

    // init tentacle
    this.segments.push(new Segment(200, 200, this.tenLength, this.tenWidth));
    for (let i = 1; i < this.numSeg; i++) {
      this.segments.push(new Segment(this.segments[i - 1], this.tenLength, this.tenWidth));
    }
    this.base = createVector(arg1, arg2);
  }

  update(arg1, arg2) {
    const total = this.segments.length;

    // tip
    const end = this.segments[total - 1];
    if (arguments.length == 2) {
      end.follow(arg1, arg2);
    } else {
      end.follow(mouseX, mouseY);
    }
    end.update();

    // linkage behavior
    for (let i = total - 2; i >= 0; i--) {
      this.segments[i].follow(this.segments[i + 1]);
      this.segments[i].update();
    }

    // attachment behavior
    this.segments[0].setA(this.base);
    for (let i = 1; i < total; i++) {
      this.segments[i].setA(this.segments[i - 1].getB());
    }
  }

  show() {
    for (let i = 0; i < this.numSeg; i++) {
      this.segments[i].show();
    }
  }

}
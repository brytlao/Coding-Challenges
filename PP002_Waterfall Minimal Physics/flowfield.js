class FlowField {
  constructor(res) {
    this.scl = res;
    this.cols = floor(width / res) + 1;
    this.rows = floor(3 * height / res) + 1;

    this.vectors = [];
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        let index = x + y * this.cols;
        this.vectors[index] = createVector(1, 1);
      }
    }

    this.p_scale = 10;
    this.p_strength = 2;
    this.p_timer = 0;
    this.p_rate = 0.3;
  }

  getVectors() {
    return this.vectors;
  }

  getVectorAtIndex(inIndex) {
    return this.vectors[inIndex];
  }

  getScl() {
    return this.scl;
  }

  update() {
    let yoff = 0;
    for (let y = 0; y < this.rows; y++) {
      let xoff = 0;
      for (let x = 0; x < this.cols; x++) {
        // set angle
        let angle = noise(xoff / this.p_scale, yoff / this.p_scale, this.p_timer / this.p_scale) * TWO_PI * this.p_strength;
        //let angle = random(-PI/4, PI/4);
        let v = p5.Vector.fromAngle(angle);

        // save to vector container
        let index = x + y * this.cols;
        this.vectors[index] = v;

        // move through perlin x
        xoff++;
      }
      // move through perlin y
      yoff++;
    }
    // move through perlin y
    this.p_timer += this.p_rate;
  }

  render() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        // get current vector
        let index = x + y * this.cols;
        let v = this.vectors[index];

        // set design
        //stroke(0, 0, 0, 150);
        stroke(255, 150);
        strokeWeight(0.1);

        // apply transformation
        push();
        translate(x * this.scl, y * this.scl);
        rotate(v.heading());
        line(0, 0, this.scl, 0);
        pop();
      }
    }
  }

  updatePScale(inScale) {
    this.p_scale = inScale;
  }

  updatePRate(inRate) {
    this.p_rate = inRate;
  }

  updatePStrength(inStrength) {
    this.p_strength = inStrength;
  }
}
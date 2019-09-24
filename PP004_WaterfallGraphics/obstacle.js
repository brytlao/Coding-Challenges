class Obstacle {
  constructor(inPos, inLength, inHeight) {
    this.pos = inPos;
    this.len = inLength;
    this.hei = inHeight;
  }

  getBoundingBox() {
    const ax = this.pos.x - 0.5 * this.len;
    const ay = this.pos.y - 0.5 * this.hei;
    const bx = this.pos.x + 0.5 * this.len;
    const by = this.pos.y + 0.5 * this.hei;

    return [ax, ay, bx, by];
  }

  getPos() {
    return createVector(this.pos.x, this.pos.y);
  }

  getLength() {
    return this.len;
  }

  getHeight() {
    return this.hei;
  }
  
  render() {
    // ledge
    noStroke();
    fill(color(255));
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.len, this.hei);
  }
}
class Obstacle{
  constructor(animation, pos, r, c) {
    this.animation = animation;
    this.len = animation.length;
    this.index = 0;
    this.animSpeed = 0.2;
    this.pos = pos;
    this.r = r;
    this.c = c;
    this.maxR = random(40, 70);
  }

  getBoundingBox() {
    const ax = this.pos.x - this.r;
    const ay = this.pos.y - this.r;
    const bx = this.pos.x + this.r;
    const by = this.pos.y + this.r;

    return [ax, ay, bx, by];
  }

  getPos() {
    return createVector(this.pos.x, this.pos.y);
  }
  
  getRadius() {
    return this.r;
  }

  update() { 
    let speed = this.animSpeed;
    
    // grow slowly if not yet max radius
    if (this.r < this.maxR) {
      this.r *= 1.01;
      speed /= 2;
    }
    
    this.index += speed;
  }
  
  render() {
    // circle
    //noStroke();
    //fill(this.c);
    //rectMode(CENTER);
    //circle(this.pos.x, this.pos.y, 2 * this.r);
    
    // sprite
    let index = floor(this.index) % this.len;
    imageMode(CENTER);
    image(this.animation[index], this.pos.x, this.pos.y, 2 * this.r, 2 * this.r);
  }
}
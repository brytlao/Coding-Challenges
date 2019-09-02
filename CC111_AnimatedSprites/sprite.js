class Sprite {
  constructor(animation, x, animSize) {
    this.animation = animation;
    this.x = x;
    this.animSize = animSize;
    this.speed = 1 - animSize;
    this.y = height + this.normAnimSize();
    this.len = this.animation.length;
    this.index = 0;
  }

  show() {
    let index = floor(this.index) % this.len;
    let as = this.normAnimSize();
    image(this.animation[index], this.x, this.y, as, as);
  }

  animate() {
    this.index += this.normAnimSpeed();
    this.y -= this.normRiseSpeed();
  }

  isOverEdge() {
    return (this.y < -this.normAnimSize());
  }

  resetParams(x, a) {
    this.x = x;
    this.y = height + this.normAnimSize();
    this.animSize = a;
    this.speed = 1 - a;
  }

  normAnimSpeed() {
    return map(this.speed, 0, 1, 0.2, 0.7);
  }

  normRiseSpeed() {
    return map(this.speed, 0, 1, 1, 10);
  }

  normAnimSize() {
    return map(this.animSize, 0, 1, 20, 300);
  }
}
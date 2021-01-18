class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.bulletWidth = 3;
    this.bulletHeight = 10;
    this.bulletHeight2 = 20;
    this.bulletSpd = 2;
    this.bulletSpdPlayer = 6;
  }

  draw() {
    fill(255);
    rect(this.x, this.y, this.bulletWidth, this.bulletHeight);
  }

  hasHit(playerX, playerY) {
    return dist(this.x, this.y, playerX + this.bulletWidth, playerY + this.bulletHeight) < this.bulletHeight2;
  }
}

class PlayerBullet extends Bullet {
  constructor(x, y) {
    super(x, y);
  }

  update() {
    this.y += this.bulletSpdPlayer;
  }
  
  isOffScreen() {
    return this.y >= height;
  }
}

class ShooterBullet extends Bullet {
  constructor(x, y) {
    super(x, y);
  }

  update() {
    this.y -= this.bulletSpd;
  }
  
  isOffScreen() {
    return this.y <= 0;
  }
}
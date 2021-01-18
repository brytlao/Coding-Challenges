class Shooters {
  constructor(shooterImage, rowsCount) {
    this.shooterImage = shooterImage;
    this.rowsCount = rowsCount;
    this.direction = 0;
    this.shooters = this.initializeShooters();
    this.bullets = [];

    // ui
    this.collisionSz = 10;
    this.imgSzY = 8;
    this.imgSzX = 11.5;
    this.margin = 20;
    this.leftMargin = 20;
    this.spacing = 30;
    this.stepSz = 10;

    // timing
    this.speed = 0.8;
    this.timeSinceLastBullet = 0;
    this.bulletDelay = 20;

    // bullets
    this.bulletWidth = 3;
    this.bulletHeight = 10;
    this.bulletSpd = 2;

    this.shooters = this.initializeShooters();
  }

  checkCollision(x, y) {
    for (let i = this.shooters.length - 1; i >= 0; i--) {
      let currentShooter = this.shooters[i];

      if (dist(x, y, currentShooter.x + this.imgSzX, currentShooter.y + this.imgSzY) < this.collisionSz) {
        this.shooters.splice(i, 1);
        return true;
      }
    }
    return false;
  }

  update() {
    for (let shooter of this.shooters) {
      if (this.direction == 0) {
        shooter.x += this.speed;
      } else if (this.direction == 1) {
        shooter.x -= this.speed;
      }
    }

    if (this.hasChangedDirection()) {
      this.moveShootersUp();
    }

    if (this.timeSinceLastBullet >= this.bulletDelay) {
      let topShooters = this.getTopShooters();

      if (topShooters.length) {
        this.makeTopShootersShoot(topShooters);
      }
    }
    this.timeSinceLastBullet++;

    // to move the bullets
    this.updateBullets();
  }

  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].update();

      // hitting player
      if (this.hasHitPlayer(this.bullets[i])) {
        this.bullets.splice(i, 1);
        player.decreaseLife();
        break;
      } else if (this.bullets[i].isOffScreen()) {
        this.bullets.splice(i, 1);
        break;
      }
    }
  }

  hasHitPlayer(bullet) {
    return player.checkCollision(bullet.x, bullet.y);
  }

  makeTopShootersShoot(topShooters) {
    let shootingShooter = random(topShooters);
    let bullet = new ShooterBullet(shootingShooter.x + this.collisionSz, shootingShooter.y + this.collisionSz);

    this.bullets.push(bullet);
    this.timeSinceLastBullet = 0;
  }

  getTopShooters() {
    let allXPositions = this.getAllXPositions();

    let shootersAtTop = [];
    for (let shooterAtX of allXPositions) {
      let bestYPosition = height * 2;
      let highestShooter;

      for (let shooter of this.shooters) {
        if (shooter.x == shooterAtX) {
          if (shooter.y < bestYPosition) {
            bestYPosition = shooter.y;
            highestShooter = shooter;
          }
        }
      }
      shootersAtTop.push(highestShooter);
    }

    return shootersAtTop;
  }

  getAllXPositions() {
    let allXPositions = new Set();
    for (let shooter of this.shooters) {
      allXPositions.add(shooter.x);
    }
    return allXPositions
  }

  hasChangedDirection() {
    for (let shooter of this.shooters) {
      if (shooter.x >= width - this.margin) {
        this.direction = 1;
        return true;
      } else if (shooter.x <= this.leftMargin) {
        this.direction = 0;
        return true;
      }
    }
    return false;
  }

  moveShootersUp() {
    for (let shooter of this.shooters) {
      shooter.y -= this.stepSz;
    }
  }

  initializeShooters() {
    let shooters = [];
    let y = height - this.margin;
    for (let i = 0; i < this.rowsCount; i++) {
      for (let x = this.margin; x < width - this.margin; x += this.spacing) {
        shooters.push(new Shooter(x, y, this.shooterImage));
      }
      y += this.margin;
    }
    return shooters;
  }

  draw() {
    for (let bullet of this.bullets) {
      rect(bullet.x, bullet.y, this.bulletWidth, this.bulletHeight);
    }

    for (let shooter of this.shooters) {
      shooter.draw();
    }
  }

}
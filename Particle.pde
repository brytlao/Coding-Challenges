class Particle {
  PVector pos;
  PVector vel;
  PVector acc;
  int p_hue;
  boolean is_seed;
  int lifespan;
  int aging;
  PVector rot;

  Particle(PVector in_pos, PVector in_vel, int in_hue, boolean in_seed) {
    // color
    is_seed = in_seed;
    p_hue = in_hue;

    // removal
    lifespan = 255;
    aging = 2;

    // set physics
    pos = in_pos.copy();
    vel = in_vel.copy();
    acc = new PVector(0, 0, 0);

    // rotation
    rot = new PVector(0, 0, 0);
  }

  void setRot(PVector in_rot) {
    rot = in_rot.copy();
  }

  void update() {
    // modify exploded particles
    if (!is_seed) {
      vel.mult(0.85); // slow down
      lifespan -= aging;
    }

    vel.add(acc);
    pos.add(vel);
    acc.mult(0);
  }

  void render() {
    // set appearance
    if (is_seed) {
      stroke(p_hue, 255, 255);
      strokeWeight(10);
    } else {
      stroke(p_hue, 255, 255, lifespan);
      strokeWeight(7);
    }

    // display points
    pushMatrix();
    rotateX(rot.x);
    rotateY(rot.y);
    rotateZ(rot.z);
    translate(pos.x, pos.y, pos.z);
    point(0, 0, 0);
    popMatrix();
  }

  void applyForce(PVector in_force) {
    acc.add(in_force);
  }

  boolean finished() {
    return (lifespan < 0);
  }
}

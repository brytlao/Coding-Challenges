class Firework {
  Particle firework;
  ArrayList < Particle > particles;
  boolean exploded;
  int num_explode_parts;
  int p_hue;
  int rocket_type;
  float scl;

  Firework() {
    // scale to screen
    scl = height/1000;

    // initial object
    p_hue = int(random(255));
    PVector init_pos = centerStart3d(width/2);
    PVector init_vel = new PVector(0, scl*random(-40, -30), 0);
    firework = new Particle(init_pos, init_vel, p_hue, true);
    rocket_type = EXPL_RAND;

    // explosion
    exploded = false;
    num_explode_parts = 200;
    particles = new ArrayList < Particle >();
  }

  void setRocketType(int in_type) {
    rocket_type = in_type;
  }

  void update() {
    updateSeed();
    updateExplosion();
  }

  void updateSeed() {
    if (!exploded) {
      // gravity
      firework.applyForce(gravity.copy().mult(0.8));
      firework.update();

      // check explode
      if (firework.vel.y >= 0) {
        exploded = true;
        explode(rocket_type);
      }
    }
  }

  void updateExplosion() {
    for (int i = particles.size()-1; i >= 0; i--) {
      particles.get(i).applyForce(gravity);
      particles.get(i).update();

      // remove dead particles
      if (particles.get(i).finished()) {
        particles.remove(i);
      }
    }
  }

  void render() {
    if (!exploded) {
      firework.render();
    }

    for (Particle p : particles) {
      p.render();
    }
  }

  void explode() {
    explode(EXPL_RAND);
  }

  void explode(int in_type) {
    // create temp var
    float x, y, z;

    // set rotations
    float rot_x = random(-PI/4, PI/4);
    float rot_y = random(-PI/4, PI/4);
    float rot_z = random(-PI/4, PI/4);

    // set respective velocities
    switch (in_type) {
    case EXPL_RAND: // rocket explosion
      for (int i = 0; i < num_explode_parts; i++) {
        // create shape
        PVector vel = PVector.random3D();

        // scale
        vel.mult(scl * random(20, 50));

        // add to list
        particles.add(new Particle(firework.pos, vel, p_hue, false));
      }
      break;
    case EXPL_HART: // heart
      float inc = TWO_PI/num_explode_parts;
      for (float i = 0; i < TWO_PI; i+=inc) {
        // create shape
        x = 16 * pow(sin(i), 3);
        y = 13 * cos(i)
          - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i);
        z = 1;

        // scale
        x *= scl * random(1, 1.3);
        y *= scl * -random(1, 1.3);
        z *= scl * random(-2, 2);

        // add to list
        PVector vel = new PVector(x, y, z);
        PVector rot = new PVector(rot_x, rot_y, rot_z);
        Particle p = new Particle(firework.pos, vel, p_hue, false);
        p.setRot(rot);
        particles.add(p);
      }
      break;
    case EXPL_DEER:
      // create shape
      float[][] dp = loadDeerPoints();
      for (int i = 0; i < dp.length; i++) {
        x = dp[i][0];
        y = dp[i][1];
        z = 1;

        // scale
        x *= scl * random(0.1, 0.101);
        y *= scl * random(0.1, 0.101);
        z *= scl * random(-2, 2);

        // add to list
        PVector vel = new PVector(x, y, z);
        PVector rot = new PVector(rot_x, rot_y, rot_z);
        Particle p = new Particle(firework.pos, vel, p_hue, false);
        p.setRot(rot);
        particles.add(p);
      }
      break;
    default: 
      explode(EXPL_RAND);
    }
  }

  boolean finished() {
    return (exploded && particles.size() == 0);
  }

  PVector centerStart3d(float in_radius) {
    PVector init_pos = new PVector();
    float x = random(in_radius) * sin(random(-PI/2, PI/2));
    float y = height / 2;
    float z = random(in_radius) * sin(random(-PI/2, PI/2));
    return init_pos.set(x, y, z);
  }

  PVector centerStart2d(float in_width) {
    PVector init_pos = new PVector();
    float x = random(in_width);
    float y = height;
    return init_pos.set(x, y);
  }
}

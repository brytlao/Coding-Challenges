// Coding Challenge 27: Fireworks

static final int EXPL_RAND = 1;
static final int EXPL_HART = 2;
static final int EXPL_DEER = 3;

ArrayList <Firework> fireworks;
PVector gravity;

void setup() {
  size(1500, 1500, P3D);
  colorMode(HSB);
  background(0);

  // gravity
  gravity = new PVector(0, 0.5, 0);

  // fireworks
  fireworks = new ArrayList <Firework>();
}

void draw() {
  background(0);

  // rotate view
  translate(width/2, height/2, map(sin(frameCount*0.005), -1, 1, 0, -height*1.2));
  rotateX(-PI/4);
  rotateY(frameCount*0.01);

  // floor
  pushMatrix();
  rotateX(PI/2);
  translate(0, 0, -height/2);
  fill(200);
  noStroke();
  ellipseMode(CENTER);
  ellipse(0, 0, width, width);
  popMatrix();

  // generate new fireworks
  if (random(1) < map(mouseX, 0, width, 0.01, 0.07)) {
    Firework fw = new Firework();

    //choose type of firework
    float chance = random(1);
    if (chance < 0.2) {
      fw.setRocketType(EXPL_HART);
    } else if (chance < 0.4) {
      fw.setRocketType(EXPL_DEER);
    } else {
      fw.setRocketType(EXPL_RAND);
    }
    fireworks.add(fw);
  }

  // maintain fireworks
  for (int i = fireworks.size()-1; i >= 0; i--) {
    fireworks.get(i).update();
    fireworks.get(i).render();
    if (fireworks.get(i).finished()) {
      fireworks.remove(i);
    }
  }
}

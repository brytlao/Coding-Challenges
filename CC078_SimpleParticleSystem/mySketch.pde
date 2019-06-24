// Coding Challenge #78: Simple Particle System
ArrayList < Particle > particles;

int DISAPPEAR_RATE = 5;
float particle_size;
PVector gravity;

void setup() {
	fullScreen();
	particles = new ArrayList < Particle > ();
	gravity = new PVector(0, 0.05);
	particle_size = height * 0.02;
}

void draw() {
	background(0);
	float flow_rate = map(mouseX, 0, width, 0, height*0.02);
	for (int i = 0; i < flow_rate; i++) {
		Particle p = new Particle(particle_size, DISAPPEAR_RATE, flow_rate);
		particles.add(p);
	}

	for (int i = particles.size() - 1; i >= 0; i--) {
		Particle p = particles.get(i);
		p.applyForce(gravity);
		p.update();
		p.render();
		if (p.finished()) {
			particles.remove(i);
		}
	}
}
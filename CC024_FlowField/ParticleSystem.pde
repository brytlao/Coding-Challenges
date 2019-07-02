class ParticleSystem {
	Particle[] particles;
	PVector start_pos;
	int num_particles = 500;
	float vel_limits = width / 150;

	ParticleSystem() {
		// start position
		start_pos = new PVector();
		start_pos.x = random(width);
		start_pos.y = random(height);

		// init particles
		particles = new Particle[num_particles];
		for (int i = 0; i < num_particles; i++) {
			float start_vel = random(1, vel_limits);
			particles[i] = new Particle(start_pos, start_vel);
		}
	}

	void update(FlowField in_field) {
		// update particles
		for (Particle p: particles) {
			p.follow(in_field);
			p.run();
		}
	}

	void setColor(color in_color) {
		for (int i = 0; i < num_particles; i++) {
			particles[i].setColor(in_color);
		}
	}
}
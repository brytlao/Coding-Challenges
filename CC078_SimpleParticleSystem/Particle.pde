class Particle {
	PVector pos; // position
	PVector vel; // velocity
	PVector acc; // acceleration
	float r; // radius of particle
	float rate; // rate of disappearance
	float alpha; // alpha to simulate disappearance
	color col; // color of particle

	Particle(float in_r, float in_rate, float in_flow) {
		pos = new PVector();
		pos.x = width / 2;
		pos.y = height - 3 * r;
		vel = new PVector();
		vel.x = 0;
		vel.y = 0;
		acc = new PVector();
		acc.x = random(-1, 1) * in_flow;
		acc.y = random(-2, -1) * in_flow;
		r = in_r || 16;
		rate = in_rate || 5;
		alpha = 255;
		col = color(115, 194, 211);
	}

	void update() {
		vel.add(acc);
		pos.add(vel);
		acc.mult(0); // reset acceleration
		alpha -= rate;

		checkOffScreen();
	}

	void render() {
		noStroke();
		fill(col, alpha);
		ellipse(pos.x, pos.y, r, r);
	}

	boolean finished() {
		return (alpha < 0);
	}

	void applyForce(PVector in_force) {
		acc.add(in_force);
	}

	void checkOffScreen() {
		// top
		if (pos.y < r) {
			vel.y *= -0.95;
		}

		// bottom
		if (pos.y > height - r) {
			vel.y *= -0.95;
		}

		// left
		if (pos.x < r) {
			vel.x *= -0.95;
		}

		// right
		if (pos.x > width - r) {
			vel.x *= -0.95;
		}

	}
}
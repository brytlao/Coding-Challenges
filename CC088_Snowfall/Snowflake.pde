float SCALE = 30;

class Snowflake {
	PVector pos; // position
	PVector vel; // velocity
	PVector acc; // acceleration
	PVector angle; // angle of rotation
	boolean dir; // direction of spin
	float x_off; // sway offset
	float r; // radius
	PImage texture; // snowflake texture

	Snowflake(float in_x, float in_y, PImage in_texture) {
		float x = in_x || random(width);
		float y = in_y || random(-400, -10);
		texture = in_texture;
		pos = new PVector(x, y);
		vel = new PVector(0, 0);
		acc = new PVector(0, 0);
		angle = random(TWO_PI);
		dir = (random(1) > 0.5) ? 1 : -1;
		x_off = 0;
		r = getRandomSize();
	}

	void applyForce(PVector force) {
		// simulate depth
		PVector f = force.get(); // copy() isn't working
		f.mult(r);
		acc.add(f);
	}

	void update() {
		// offset for swaying motion
		x_off = sin(angle) * r;

		// calculate force
		vel.add(acc);
		vel.limit(r * 0.2); // upper limit
		if (vel.mag() < 1) {
			vel.normalize(); // lower limit
		}
		pos.add(vel);
		acc.mult(0); // reset acceleration

		// run off-screen routine
		checkOffScreen();

		// vary rotation speed
		angle = angle + dir * vel.mag() / 200;
	}

	void render() {
		pushMatrix();
		// rotation
		translate(pos.x + x_off, pos.y);
		rotate(angle);
		// display
		imageMode(CENTER);
		image(texture, 0, 0, r, r);
		popMatrix();
	}

	void randomize() {
		float x = random(width);
		float y = random(-100, -10);
		pos = new PVector(x, y);
		vel = new PVector(0, 0);
		acc = new PVector(0, 0);
		r = getRandomSize();
	}

	void checkOffScreen() {
		// bottom
		if (pos.y > height + r) {
			randomize();
		}

		// left
		if (pos.x < -r) {
			pos.x = width + r;
		}

		// right
		if (pos.x > width + r) {
			pos.x = -r;
		}

	}
}

// naive rng to prefer smaller numbers
float getRandomSize() {
	float pr = pow(random(0, 1), 3);
	return constrain(pr * SCALE, 2, SCALE);
}
class Particle {
	PVector pos;
	PVector vel;
	PVector acc;
	float max_speed;
	PVector prev_pos;
	color p_color;

	Particle(PVector in_start, float in_speed) {
		pos = in_start;
		vel = new PVector(0, 0);
		acc = new PVector(0, 0);
		max_speed = in_speed;
		prev_pos = pos;
		p_color = color(0);
	}

	void update() {
		vel.add(acc);
		vel.limit(max_speed);
		pos.add(vel);
		acc.mult(0);
	}

	void applyForce(PVector in_force) {
		acc.add(in_force);
	}

	void follow(FlowField in_field) {
		// determine effect of field at point
		int x = abs(floor(pos.x / in_field.scl));
		int y = abs(floor(pos.y / in_field.scl));

		// apply force
		int index = x + y * in_field.cols;
		PVector force = in_field.vectors[index];
		force.setMag(width * 0.01);
		applyForce(force);
	}

	void edges() {
		if (pos.x > width) {
			pos.x = 0;
			updatePrevPos();
		}
		if (pos.x < 0) {
			pos.x = width;
			updatePrevPos();
		}
		if (pos.y > height) {
			pos.y = 0;
			updatePrevPos();
		}
		if (pos.y < 0) {
			pos.y = height;
			updatePrevPos();
		}
	}

	void render() {
		stroke(p_color, 15);
		strokeWeight(2);
		line(pos.x, pos.y, prev_pos.x, prev_pos.y);
		updatePrevPos();
	}

	void run() {
		update();
		edges();
		render();
	}

	void updatePrevPos() {
		prev_pos = pos;
	}

	void setColor(color in_color) {
		p_color = in_color;
	}
}
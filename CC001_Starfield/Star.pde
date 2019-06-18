class Star {
	float x; // x position
	float y; // y position
	float sx; // scaled x
	float sy; // scaled y
	float z; // inverse scale
	float r; // radius
	float lw; // line width
	float s; // speed
	float pz; // previous z

	Star() {
		x = random(-width / 2, width / 2);
		y = random(-height / 2, height / 2);
		z = random(width);
		pz = z;
		r = 5;
		lw = 2;
	}

	void showCircle() {
		fill(255);
		
		// scaled radius
		float sr = map(z, 0, width, 10, 0);

		// draw circles
		noStroke();
		ellipse(sx, sy, sr, sr);
	}

	void showLine() {
		fill(255);

		// previous position
		float px = map(x / pz, 0, 1, 0, width);
		float py = map(y / pz, 0, 1, 0, height);
		pz = z;

		// draw lines
		stroke(255);
		strokeWeight(lw);
		line(sx, sy, px, py);
	}

	void changeSpeed(float speed) {
		s = speed;
	}

	void update() {
		// update scale z
		z = z - s;
		if (z < 1) {
			x = random(-width / 2, width / 2);
			y = random(-height / 2, height / 2);
			z = random(width);
			pz = z;
		}
		
		// update scaled position
		sx = map(x / z, 0, 1, 0, width);
		sy = map(y / z, 0, 1, 0, height);
	}
}
class FlowField {
	PVector[] vectors;
	int cols, rows;
	int scl;
	float p_scale = 10;
	float p_strength = 2;
	float p_timer = 0;
	float p_rate = 0.3;

	FlowField(int res) {
		scl = res;
		cols = floor(width / res) + 1;
		rows = floor(height / res) + 1;
		vectors = new PVector[cols * rows];
	}

	void update() {
		float yoff = 0;
		for (int y = 0; y < rows; y++) {
			float xoff = 0;
			for (int x = 0; x < cols; x++) {
				// set angle
				float angle = noise(xoff / p_scale, yoff / p_scale, p_timer / p_scale) * TWO_PI * p_strength;
				PVector v = PVector.fromAngle(angle);

				// save to vector container
				int index = x + y * cols;
				vectors[index] = v;

				// move through perlin x
				xoff++;
			}
			// move through perlin y
			yoff++;
		}
		// move through perlin y
		p_timer += p_rate;
	}

	void render() {
		for (int y = 0; y < rows; y++) {
			for (int x = 0; x < cols; x++) {
				// get current vector
				int index = x + y * cols;
				PVector v = vectors[index];

				// set design
				stroke(0, 0, 0, 150);
				strokeWeight(0.1);

				// apply transformation
				pushMatrix();
				translate(x * scl, y * scl);
				rotate(v.heading());
				line(0, 0, scl, 0);
				popMatrix();
			}
		}
	}

	void updatePScale(float in_scale) {
		p_scale = in_scale;
	}

	void updatePRate(float in_rate) {
		p_rate = in_rate;
	}

	void updatePStrength(float in_strength) {
		p_strength = in_strength;
	}
}
class Drop {
	float x; // x position
	float y; // y position
	float z; // depth
	float dy; // speed
	float ddy; // acceleration
	float len; // length
	float thick; // thickness
	float intense; // intensity of rain
	color color_rain; // mild rain color

	Drop() {
		intense = 1;
		x = random(width);
		y = random(-500, -100);
		z = random(0, 20);
		dy = map(z, 0, 20, 4, 20);
		ddy = map(z, 0, 20, 0, 0.3);
		len = map(z, 0, 20, 10, 20);
		thick = map(z, 0, 20, 1, 3);
		color_rain = PURPLE;
	}

	void changeIntense(float in_intense, float lower, float upper) {
		intense = map(in_intense, 0, width, lower, upper);
		if (intense > upper) {
			intense = upper;
		}
		if (intense < lower) {
			intense = lower;
		}
	}

	void setColor(color in_rain) {
		color_rain = in_rain;
	}

	void update() {
		// update y position
		y = y + dy; // speed
		dy = dy + ddy * (intense * intense); // acceleration

		// reset when bottom is reached
		if (y >= height) {
			x = random(width);
			y = random(-200, -100);
			dy = map(z, 0, 20, 4, 20);
		}
	}

	void show() {
		// describe line
		stroke(color_rain);
		strokeWeight(thick);
		// display line
		line(x, y, x, y + len * intense);
	}
}
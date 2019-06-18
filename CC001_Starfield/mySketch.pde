// Coding Challenge #1: Starfield

Star[] stars = new Star[200];
float speed = 10;

void setup() {
	size(600, 600);

	// init stars
	for (int i = 0; i < stars.length; i++) {
		stars[i] = new Star();
	}
}

void draw() {
	// reset background
	background(0);

	// translate for center origin
	translate(width / 2, height / 2);

	// update speed
	speed = map(mouseX, 0, width, 1, 40);

	// go through all stars
	for (int i = 0; i < stars.length; i++) {
		// update speed
		stars[i].changeSpeed(speed);

		// update star position
		stars[i].update();

		if (mouseX < width / 2) {
			// show star as circle
			stars[i].showCircle();
		} else {
			// show star as line
			stars[i].showLine();
		}
	}
}
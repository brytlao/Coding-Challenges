// Coding Challenge 4: Purple Rain
color PURPLE = color(138, 42, 226);
color L_PURPLE = color(230, 230, 250);
color RED = color(252, 13, 13);
color L_RED = color(252, 164, 164);

Drop[] drops = new Drop[400];
float lerp_amt;
color box_color;
color rain_color;

void setup() {
	size(500, 500);
	for (int i = 0; i < drops.length; i++) {
		drops[i] = new Drop();
	}
}

void draw() {
	background(0);
	// set colors
	lerp_amt = map(mouseX, 0, width, 0, 1);
	box_color = lerpColor(L_PURPLE, L_RED, lerp_amt);
	rain_color = lerpColor(PURPLE, RED, lerp_amt);
	
	// set box
	noStroke();
	fill(box_color);
	rect(0, 0, width, height);

	// set rain
	for (int i = 0; i < drops.length; i++) {
		// set intensity
		drops[i].changeIntense(mouseX, 1, 4);

		// set color
		drops[i].setColor(rain_color);

		// display
		drops[i].update();
		drops[i].show();
	}
}
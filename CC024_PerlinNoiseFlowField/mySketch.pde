// Coding Challenge #78: Perlin Noise Flow Field

FlowField field;
ArrayList < ParticleSystem > drops;
int init_drop_num = 1;

color[] colorOptions = {
	color(41, 52, 98),
	color(247, 98, 98),
	color(255, 241, 193),
	color(76, 108, 118)
};

int color_index = 0;
int drop_counter = 0;

void setup() {
	//size(800, 800);
	fullScreen();

	// init field
	field = new FlowField(20);
	field.update();
	field.updatePScale(10);
	field.updatePRate(0.1);
	field.updatePStrength(2);

	// start with 1 drop
	drops = new ArrayList < ParticleSystem > ();
	drops.add(new ParticleSystem());
	drops.get(drop_counter).setColor(color(0));
	drop_counter++;

	// start with blank canvas
	background(255);
}

void draw() {
	// compute field
	field.update();

	// run each drop
	for (ParticleSystem d: drops) {
		d.update(field);
	}
}

color nextColor() {
	color_index++;
	if (color_index >= colorOptions.length) {
		color_index = 0;
	}
	return colorOptions[color_index];
}

void mouseReleased() {
	drops.add(new ParticleSystem());
	drops.get(drop_counter).setColor(nextColor());
	drop_counter++;
}

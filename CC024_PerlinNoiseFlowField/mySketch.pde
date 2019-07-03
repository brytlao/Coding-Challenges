// Coding Challenge #78: Perlin Noise Flow Field

FlowField field;
ArrayList < ParticleSystem > drops;
int init_drop_num = 1;

color[] color_options = {
	color(0, 0, 0),
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

	// color bar
	drawBar(color_options);
}

void drawBar(color[] in_colors) {
	int num_colors = in_colors.length;
	float seg_width = width / num_colors;
	float seg_height = height * 0.05;
	
	// set color
	int color_index = floor(map(mouseX, 0, width, 0, num_colors));
	color color_show = in_colors[color_index];
	drops.get(0).setColor(color_show);
	
	// render bar
	for (int i = 0; i < num_colors; i++) {
		fill(in_colors[i]);
		noStroke();
		rect(i * seg_width, height - seg_height,
			seg_width, seg_height);
	}
}
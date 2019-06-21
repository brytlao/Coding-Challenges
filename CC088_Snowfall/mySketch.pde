// Snow
/* @pjs preload="flakes32.png"; */
int sz_sprite = 32;
ArrayList < Snowflake > snow;
PVector gravity;
PImage sprite_sheet;
ArrayList < PImage > sprites;
float perlin_timer;
int num_snow = 200;

// Rain
Drop[] rain;
float lerp_amt;
color box_color;
color rain_color;
int num_rain = 200;

// Colors
color GRAY = color(30);
color BLACK = color(10);
color WHITE = color(255);

void preload() {
	// preload images
	sprite_sheet = loadImage("flakes32.png");
}

void setup() {
	size(500, 500);

	// load images
	sprites = new ArrayList < PImage > ();
	preload();
	initTextures();

	// set colors
	rain_color = GRAY;

	// initialize physics
	gravity = new PVector(0, 0.03);
	perlin_timer = 0;

	// init precipitation
	initSnow();
	initRain();
}

void draw() {
	background(0);

	// set bg
	box_color = lerpColor(GRAY, BLACK, lerp_amt);
	lerp_amt = map(mouseX, 0, width, 0, 1);
	noStroke();
	fill(box_color);
	rect(0, 0, width, height);

	// set amount of precipitation
	int show_rain = setPrecipitation(mouseX, 0.1, num_rain);
	int show_snow = num_snow - setPrecipitation(mouseX, 0.1, num_snow);
	
	// update perlin timer
	perlin_timer = perlin_timer + 0.01;
	
	// render precipitation
	renderSnow(show_snow);
	renderRain(show_rain);
}

void initTextures() {
	// get slices of the image as texture
	for (int y = 0; y < sprite_sheet.height; y += sz_sprite) {
		for (int x = 0; x < sprite_sheet.width; x += sz_sprite) {
			PImage tmp_img = sprite_sheet.get(x, y, sz_sprite, sz_sprite);
			sprites.add(tmp_img);
		}
	}
}

void initSnow() {
	snow = new ArrayList < Snowflake > ();

	// add flakes
	for (int i = 0; i < num_snow; i++) {
		// assign random initial positions
		float x = random(width);
		float y = random(height);

		// assign random texture to each snowflake
		int ind_texture = floor(random(sprites.size()));
		PImage s = sprites.get(ind_texture);
		snow.add(new Snowflake(x, y, s));
	}
}

void initRain() {
	rain = new Drop[num_rain];

	// add rain
	for (int i = 0; i < num_rain; i++) {
		rain[i] = new Drop();
		rain[i].setColor(rain_color);
	}
}

int setPrecipitation(float deg, float margins, float max) {
	int amt = floor(map(deg, 0, width, 0, max));
	// minimum
	if (amt < margins * max) {
		amt = 0;
	}
	// maximum
	if (amt > (1 - margins) * num_rain) {
		amt = max;
	}
	return amt;
}

void renderSnow(float num) {
	for (int i = 0; i < num; i++) {
		// introduce wind force
		float x_off = snow.get(i).pos.x / width;
		float y_off = snow.get(i).pos.y / height;
		float w_angle = noise(x_off, y_off, perlin_timer) * TWO_PI;
		PVector wind = PVector.fromAngle(w_angle);
		wind.mult(0.01);

		// apply forces
		snow.get(i).applyForce(wind);
		snow.get(i).applyForce(gravity);

		// render
		snow.get(i).update();
		snow.get(i).render();
	}
}

void renderRain(float num) {
	int intensity = map(num,0,num_rain,0,width);
	for (int i = 0; i < num; i++) {
		// set intensity
		rain[i].changeIntense(intensity, 1, 4);
				
		// display
		rain[i].update();
		rain[i].show();
	}
}
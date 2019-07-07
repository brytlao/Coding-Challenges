// Collect the points of your trace
// 1: set parameters
// 2: drag mouse of screen
// 3: press any key to exit
// 4: copy console output to supplementary DrawPoints code

PImage pi;
int col_ctr = 1;

// set parameters
String fn = "deer.jpg"; // place image in data folder
float scl = 3;          // resize your photo
float cap_int = 7;      // 60 is about 1Hz
int num_col = 5;        // no of columns to print

void setup() {
  size(1000, 1000);
  pi = loadImage(fn);
  imageMode(CENTER);
  image(pi, width/2, height/2, pi.width * scl, pi.height * scl);

  // start of print
  println("float[][] drawing = {");
}

void draw() {
}

void mouseDragged() {
  if (frameCount%cap_int == 0) {
    // print coordinates
    print("{" + (mouseX-width/2) + ", "
      + (mouseY-height/2) + "},\t");
    col_ctr++;
    
    // new line
    if (col_ctr > num_col) {
      println();
      col_ctr = 1;
    }
  }
}

void keyPressed() {
  // end of print
  println("};");
  exit();
}

// Render the points of your trace
// 1: use CollectPoints code
// 2: paste console output to Drawing file

void setup() {
  size(1000, 1000);
  background(0);
  
  // outline
  for(float[] data: drawing) {
    stroke(255);
    strokeWeight(10);
    point(data[0]+width/2, data[1]+height/2);
  }
}

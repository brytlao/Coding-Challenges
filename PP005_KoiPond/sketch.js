// Personal Projects #5: Koi Pond

let kois = [];
let len;
let feeds = [];
const numKois = 20;

function setup() {
  //createCanvas(600, 600);
  createCanvas(windowWidth, windowHeight);

  // kois
  scaleFishSizes(0.6);
  const di = TWO_PI / numKois;
  for (let i = 0; i < TWO_PI; i += di) {
    const x = width / 2 + cos(i) * 100;
    const y = height / 2 + sin(i) * 100;
    //kois.push(new Fish(x, y, random(5, 30)));
    kois.push(new Fish(x, y));
  }
  len = kois.length;
}

function draw() {
  background(0);

  // kois
  for (let i = 0; i < len; i++) {
    kois[i].update(feeds); // find closest food
    //kois[i].update(feeds[0]); // find latest food
    kois[i].show();
  }

  // feed
  for (let i = 0; i < feeds.length; i++) {
    feeds[i].update(kois);
    feeds[i].show();
  }
  
  // clearing feed
  for (let i = feeds.length - 1; i >= 0; i--) {
    if (feeds[i].getIsEaten()) {
      feeds.splice(i, 1);
    }
  }
}

function mousePressed() {
  feeds.push(new Feed(mouseX, mouseY, 10));
}
// Image/pixel discretization tool

let circlePoints = [];
let discretePoints = [];
let circleScale = [];
let beforeOffset = [];
let afterOffset = [];
const circleRad = 6;

function setup() {
  createCanvas(800, 800);
  circleScale = 150;
  beforeOffset = createVector(width / 2, height / 4);
  circlePoints = genCircle(circleScale, beforeOffset);
  discretePoints = discretize(circlePoints);

  // bg
  fill(10);
  rect(0, 0, width, height / 2);
  fill(30);
  rect(0, height / 2, width, height);

  // plot original circles
  plotShape(circlePoints);

  // plot discretized form
  plotShape(discretePoints);
}

function draw() {

}

function plotShape(inPoints) {
  for (let i = 0; i < inPoints.length; i++) {
    const currPoint = inPoints[i];
    const posX = currPoint.x;
    const posY = currPoint.y;
    fill(250);
    circle(posX, posY, circleRad);
  }
}

function genCircle(inScale, inOffset) {
  let points = [];
  let bins = 100;
  const stages = 20;
  const inc = TWO_PI / bins;
  const stageInc = 1 / stages;
  let ctr = 0;
  let stageCtr = 1;
  for (let i = 0; i < stages; i++) {
    for (let j = 0; j < bins; j++) {
      const posX = inScale * stageCtr * cos(ctr) + inOffset.x;
      const posY = inScale * stageCtr * sin(ctr) + inOffset.y;
      const pos = createVector(posX, posY);
      points.push(pos);
      ctr += inc;
    }
    stageCtr -= stageInc;
    ctr = 0;
  }
  return points;
}

function discretize(inPoints) {
  let discPoints = [];
  let realPoints = [];
  const w = width;
  const h = height / 2;
  const wCount = 100;
  const hCount = wCount / 2;

  // initialize array
  for (let i = 0; i < hCount; i++) {
    discPoints[i] = []; // create nested array
    for (let j = 0; j < wCount; j++) {
      discPoints[i][j] = 0;
    }
  }
  
  // activate relevant points
  for (let point of inPoints) {
    const posX = point.x;
    const posY = point.y;
    const posI = floor(hCount * posY / h);
    const posJ = floor(wCount * posX / w);
    discPoints[posI][posJ] = 1;
  }

  // solve equivalent points
  for (let i = 0; i < hCount; i++) {
    for (let j = 0; j < wCount; j++) {
      if (discPoints[i][j] == 1) {
        let posX = w * j / wCount;
        let posY = h * i / hCount;
        posY += height/2;
        const currPoint = createVector(posX, posY);
        realPoints.push(currPoint);
      }
    }
  }

  return realPoints;
}
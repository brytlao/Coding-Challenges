// Coding Challenge #111: Animated Sprites
// LOOP FLOWER GIF by DAVESTRICK: https://giphy.com/gifs/loop-dahlia-26u43GwxpIiUgrHI4

let spritesheet;
let spritedata;
let bgColor;
const spriteSize = 320;
const spriteNumFrames = 47;
const spriteGridSize = 7;
let speedFactor = 2;

let animation = [];
let flowers = [];

function preload() {
  spritesheet = loadImage('dahlia.png');
  bgColor = color(24, 1, 89);
}

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);

  // split frames into array
  for (let i = 0; i < spriteNumFrames; i++) {
    let x = i % spriteGridSize;
    let y = floor(i / spriteGridSize);
    let img = spritesheet.get(x * spriteSize, y * spriteSize, spriteSize, spriteSize);
    animation.push(img);
  }

  // assign animation to animation helper
  let absCtr = 0;
  for (let i = 0; i < 10; i++) {
    let xStart = random(width * 0.1, width * 0.8);
    let animSize = random();
    flowers[i] = new Sprite(animation, xStart, animSize);
  }
  console.log(flowers);
}

function draw() {
  background(bgColor);

  // set plotting order
  let ascIndices = solveIndexAsc();

  for (let i = 0; i < ascIndices.length; i++) {
    let currIndex = ascIndices[i];
    let flower = flowers[currIndex];

    if (flower.isOverEdge()) {
      let xStart = random(width * 0.1, width * 0.8);
      let animSize = random();
      flower.resetParams(xStart, animSize);
    }
    flower.show();
    flower.animate();
  }
}

function solveIndexAsc() {
  let animSizes = [];
  // retrieve sizes
  for (let i = 0; i < flowers.length; i++) {
    animSizes[i] = flowers[i].normAnimSize();
  }

  // sort in ascending order
  let animSizesSorted = [];
  arrayCopy(animSizes, animSizesSorted, animSizes.length);
  animSizesSorted = sort(animSizes, animSizes.length);

  // get indices
  indicesSorted = [];
  for (let i = 0; i < animSizes.length; i++) {
    for (let j = 0; j < animSizes.length; j++) {
      if (animSizesSorted[i] == animSizes[j]) {
        indicesSorted[i] = j;
      }
    }
  }
  return indicesSorted;
}
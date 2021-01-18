// Personal Projects #6: Face Invaders

// space invader
let alienImg; // 23 * 16
let shooters;
let playerImg;
let player;

// faceApi vars
let faceapi;
let video;
let detections = null;
let face = new Face();
let faceVertOff = 0;
const detection_options = {
  withLandmarks: true,
  withDescriptors: false,
}

// visual effects
let isShooting = false;
let isGameOver = false;
let isTitleTime = true;
let titleTimer = 2000;
const titleTimerDec = 100;
let mouthText = "";
let gameOverTimer = 200;
const gameOverDec = 110;

function preload() {
  alienImg = loadImage("invader1.png");
  playerImg = loadImage("shooter1.png");
}

function setup() {
  createCanvas(360, 270);

  // space invader
  shooters = new Shooters(playerImg, 4);
  player = new Player(alienImg);

  // load up your video
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide(); // Hide the video element, and just show the canvas
  faceapi = ml5.faceApi(video, detection_options, modelReady)
  textAlign(CENTER);

  // reset values
  titleTimer = 2000;
  gameOverTimer = 200;
  
  noLoop();
}

function draw() {  
  // update only if face is detected, avoid flicker
  if (detections && detections.length > 0 && gameOverTimer > 0) {
    background(0);

    // face
    push();
    // draw face in correct position
    translate(0, faceVertOff); // update face pos upwards
    face.drawCamFeed(video);
    face.drawMask(detections[0].parts.jawOutline);

    // draw mouth text
    if (face.isMouthOpen(detections[0].parts.mouth)) {
      mouthText = "PEW";
      isShooting = true;
    } else {
      mouthText = "";
    }

    // check if hurt
    if (player.getOuchStatus()) {
      mouthText = "OUCH";
    }
    
    // show mouth text
    face.drawMouthText(detections[0].parts.mouth, mouthText);
    
    // update face offset
    faceVertOff = face.calcFaceOffset();
    pop();

    // space invader
    shooters.update(player);
    shooters.draw();

    player.update();
    player.draw();
    player.setPos(face.getPosX() - player.getCenterOffX(), face.getPosY() + faceVertOff);

    if (player.lives == 0) {
      gameOverTimer -= gameOverDec;
    }

    if (isShooting) {
      player.shoot();
      isShooting = false;
    }    
  }
  
  // show title for a limited time
  if (isTitleTime) {
    showTitle();
    titleTimer -= titleTimerDec;
    if (titleTimer < 0) {
      isTitleTime = false;
    }
  }
  
  // show game over
  if (gameOverTimer < 0) {
    showGameOver();
  }
}

function showGameOver() {
  fill(255);
  stroke(0);
  rectMode(CENTER);
  
  textSize(50);
  text("GAME OVER", width/2, height/2);
  
  textSize(20);
  text("SCORE: " + player.getScore(), width/2, height/2 + 30);
  text("press space bar", width/2, height/2 + 50);
}

function showTitle() {
  fill(255);
  stroke(0);
  rectMode(CENTER);
  
  textSize(50);
  text("FACE\nINVADERS", width/2, height/2 - 15);
}

function gotResults(err, result) {
  if (err) {
    console.log(err)
    return
  }

  // draw landmarks if face is detected
  detections = result;
  faceapi.detect(gotResults);

  redraw();
}

function modelReady() {
  console.log('ready!')
  console.log(faceapi)
  faceapi.detect(gotResults)
}

function keyPressed() {
  if (keyCode === 32) {
    setup();
  }
}
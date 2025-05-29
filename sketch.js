let introImage;
let treeImage;
let backgroundMusic;
let boyImage;
let ladybugImage;
let stumpImage;
let paperImage;
let endingImage;
let magnifyingGlassCursor;
let cursorImage;
let ad1Image, ad2Image, ad3Image, ad4Image;
let adImages = [];
let forestImage;
let forest2Image;
let adImageIndex = 0;
let showingAdImage = false;

let currentScreen = 'start';
let boyX, boyY;
let treeX, treeY;
let treeCollisionDistance = 100;
let isTreeCloseUp = false;
let ageRingPositions = [];
let currentAdvice = "";
let ladybugVisible = false;
let ladybugX, ladybugY;
let musicStarted = false;
let hasSetupRings = false;

function preload() {
  treeImage = loadImage('assets/tree.png');
  boyImage = loadImage('assets/boy.png');
  ladybugImage = loadImage('assets/ladybug.png');
  stumpImage = loadImage('assets/stump.png');
  backgroundMusic = loadSound('assets/background_music.mp3');
  magnifyingGlassCursor = loadImage('assets/magnifying_glass.png');
  cursorImage = loadImage('assets/cursor.png');
  paperImage = loadImage('assets/paper.png');
  introImage = loadImage('assets/intro.png');
  endingImage = loadImage('assets/ending.jpg');
  forestImage = loadImage('assets/forest.jpg');
  forest2Image = loadImage('assets/forest2.jpg')

  ad1Image = loadImage('assets/ad/ad1.jpg');
  ad2Image = loadImage('assets/ad/ad2.jpg');
  ad3Image = loadImage('assets/ad/ad3.jpg');
  ad4Image = loadImage('assets/ad/ad4.jpg');

  adImages = [ad1Image, ad2Image, ad3Image, ad4Image];
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  treeX = width / 4;
  treeY = height / 2;
  boyX = width / 2 + width / 4;
  boyY = height / 2;
  ladybugX = width / 2;
  ladybugY = height / 2 + 50;
  adImageIndex = 0;
}

function draw() {
  background(135, 206, 235);

  if (currentScreen === 'showAd' && showingAdImage) {
    image(adImages[adImageIndex], width / 2, height / 2, windowWidth, windowHeight);
    return;
  }

  if (currentScreen === 'start') {
    drawIntroScreen();
  } else if (currentScreen === 'treeStart') {
    drawStartScreen();
    handleStartInteraction();
  } else if (currentScreen === 'treeView') {
    drawTreeView();
    displayTreeMessage('"안녕. 바쁜 하루에 지쳐보이는구나. 여기 숲에 와서 내 나이테를 한번 봐. 네가 힘들 때 이미 받았던, 그리고 앞으로 받게 될 따뜻한 응원들을 떠올리게 해줄 거야."');
  } else if (currentScreen === 'stumpView') {
    drawStumpView();
    displayStumpMessage('"자, 이쪽으로 가까이 와 봐. 날 한번 클릭해보렴. 내 삶의 흔적을 보여줄게."', 30);
    displayStumpMessage('"내 나이테 하나하나에는 삶의 지혜가 담겨 있단다. 나이테를 누르면 네게 필요한 이야기가 들릴 거야."', 70);
  } else if (currentScreen === 'ageRingInteraction') {
    drawAgeRingView();
  } else if (currentScreen === 'ladybugInteraction') {
    drawStumpView();
    image(ladybugImage, ladybugX, ladybugY, 50, 50);
    displayEasterEggMessage('"나를 찾아줘서 고마워요. 뜻밖의 작은 행복이 당신을 찾아올 거예요. 오늘 하루도 즐거운 일이 가득하길 바라요!"');
  } else if (currentScreen === 'treeEnd') {
    drawTreeView();
    displayTreeEndMessage('"내 이야기가 네 마음에 조금이라도 닿았니? 힘들 때마다 오늘을 기억하고, 네 안의 힘과 주변의 응원을 잊지 말고 살아가렴. 언제든 다시 찾아와!"', 70);
    displayTreeEndMessage('"ENTER키 누르렴"', 30);
  } else if (currentScreen === 'ending') {
    drawEndingScreen();
  }
}

function mousePressed() {
  if (currentScreen === 'start') {
    if (mouseX >= 423 && mouseX <= 1126 && mouseY >= 400 && mouseY <= 900) {
      currentScreen = 'treeStart';
      if (!musicStarted) {
        backgroundMusic.loop();
        backgroundMusic.setVolume(0.3);
        musicStarted = true;
      }
    }
    return;
  }
}

function mouseClicked() {
  if (currentScreen === 'showAd' && showingAdImage) {
    showingAdImage = false;
    adImageIndex++;
    if (adImageIndex >= adImages.length) {
      currentScreen = 'treeEnd';
    } else {
      currentScreen = 'stumpView';
      hasSetupRings = false;
    }
    return;
  }

  if (currentScreen === 'treeView' && isTreeCloseUp) {
    currentScreen = 'stumpView';
    hasSetupRings = false;
  } else if (currentScreen === 'stumpView') {
    let ladybugClicked = dist(mouseX, mouseY, ladybugX, ladybugY) < 25;
    if (ladybugClicked) {
      currentScreen = 'ladybugInteraction';
    } else {
      checkAgeRingClick();
    }
  } else if (currentScreen === 'ladybugInteraction') {
    currentScreen = 'treeEnd';
  }
}

function drawIntroScreen() {
  image(introImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  noCursor();
  image(cursorImage, mouseX, mouseY, 70, 70);
  textSize(30);
  textAlign(CENTER, BOTTOM);
  fill(0);
  text("재생 버튼을 클릭하세요.", width / 2, height - 50);
}

function drawStartScreen() {
  image(forestImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  image(treeImage, treeX, treeY, 500, 500);
  image(boyImage, boyX, boyY, 330, 330);
  noCursor();
  image(cursorImage, mouseX, mouseY, 70, 70);
  fill(255);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, height - 70, 680, 60);
  textSize(30);
  textAlign(CENTER, BOTTOM);
  fill(0);
  text("방향키를 이용하여 나무에게 다가가세요.", width / 2, height - 60);
}

function handleStartInteraction() {
  if (keyIsPressed) {
    if (keyCode === LEFT_ARROW) boyX -= 6;
    else if (keyCode === RIGHT_ARROW) boyX += 6;
    else if (keyCode === UP_ARROW) boyY -= 6;
    else if (keyCode === DOWN_ARROW) boyY += 6;
  }

  let d = dist(boyX, boyY, treeX, treeY);
  if (d < treeCollisionDistance) {
    currentScreen = 'treeView';
  }
}

function drawTreeView() {
  image(forestImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  let treeSize = 400;
  image(treeImage, width / 2, height / 2, treeSize, treeSize);
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  if (d < treeSize / 2) {
    noCursor();
    image(magnifyingGlassCursor, mouseX, mouseY, 100, 100);
    isTreeCloseUp = true;
  } else {
    cursor(ARROW);
    isTreeCloseUp = false;
  }
}

function displayTreeMessage(message) {
  textSize(20);
  textAlign(CENTER, BOTTOM);
  fill(0);
  text(message, width / 2, height - 50);
}

function drawEndingScreen() {
  image(endingImage, width / 2, height / 2, windowWidth, windowHeight);
  noCursor();
  image(cursorImage, mouseX, mouseY, 70, 70);
}

function drawStumpView() {
  image(forest2Image, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  image(stumpImage, width / 2, height / 2, 300, 300);

  if (!hasSetupRings) {
    setupAgeRings();
    hasSetupRings = true;
  }

  noCursor();
  image(cursorImage, mouseX, mouseY, 100, 100);
}

function displayStumpMessage(message, yOffset) {
  textSize(18);
  textAlign(CENTER, BOTTOM);
  fill(255);
  text(message, width / 2, height - 50 - yOffset);
}

function setupAgeRings() {
  ageRingPositions = [
    { x: width / 2 - 40, y: height / 2 - 20, radius: 30 },
    { x: width / 2 + 20, y: height / 2 + 10, radius: 40 },
    { x: width / 2 - 10, y: height / 2 + 50, radius: 25 },
    { x: width / 2 + 60, y: height / 2 - 40, radius: 35 }
  ];
}

function drawAgeRingView() {
  image(forestImage, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
  image(stumpImage, width / 2, height / 2, 300, 300);
  noCursor();
  image(cursorImage, mouseX, mouseY, 100, 100);
}

function checkAgeRingClick() {
  for (let i = 0; i < ageRingPositions.length; i++) {
    let d = dist(mouseX, mouseY, ageRingPositions[i].x, ageRingPositions[i].y);
    if (d < ageRingPositions[i].radius) {
      selectedAgeRingIndex = i;
      adImageIndex = i;
      showingAdImage = true;
      currentScreen = 'showAd';
      return;
    }
  }
}

function displayEasterEggMessage(message) {
  textSize(22);
  textAlign(CENTER, TOP);
  fill(255);
  text(message, width / 2, height - 80);
}

function displayTreeEndMessage(message, yoffset) {
  textSize(20);
  textAlign(CENTER, BOTTOM);
  fill(0);
  text(message, width / 2, height - yoffset);
}

function keyPressed() {
  if (currentScreen === 'treeEnd' && keyCode === ENTER) {
    currentScreen = 'ending';
  }
}

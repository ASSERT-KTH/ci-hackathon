let name;
let drawM, drawF;
let t= 0;

travisListener.connect();
travisListener.on(data => {
  name = data.commit.author_name
  var firstName = name.split(" ")[0].trim().toLowerCase();
  // console.log(firstName)
  // console.log("Contains a male name: " + mnames.includes(firstName));
  if (mnames.includes(firstName)) {
    drawM = true;
  }
  // console.log("Contains a female name: " + fnames.includes(firstName));
  if (fnames.includes(firstName)) {
    drawF = true;
    console.log(firstName)
  }
})


function setup() {
  preload();
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  textSize(10);
  fill(0, 102, 153);
  noStroke();

  // Draw for each name
  if (drawM) {
    let colorM = color(randomColor({
      hue: 'yellow',
      luminosity: 'light'
    }));
    fill(colorM);
    // ellipse(random(width), random(height), 100, 100);
    blob(100, random(width), random(height), 0.75, t);
    drawM = false;
  }

  if (drawF) {
    let colorF = color(randomColor({
      hue: 'purple',
      luminosity: 'light'
    }));
    fill(colorF);
    // ellipse(random(width), random(height), 100, 100);
    blob(100, random(width), random(height), 0.75, t);
    drawF = false;
  }


  t += 0.5;
}

// blob code from https://www.openprocessing.org/sketch/744449
function blob(size, xCenter, yCenter, k, t) {
  beginShape();
  for (let theta = 0; theta < 2 * PI; theta += 0.01) {
    let r1, r2;
    if (theta < PI/2) {
      r1 = cos(theta);
      r2 = 1;
    } else if (theta < PI) {
      r1 = 0;
      r2 = sin(theta);
    } else if (theta < 3 * PI/2) {
      r1 = sin(theta);
      r2 = 0;
    } else {
      r1 = 1;
      r2 = cos(theta);
    }
    let r = size + noise(k * r1, k * r2, t) * (1/3) * size;
    let x = xCenter + r * cos(theta);
    let y = yCenter + r * sin(theta);
    curveVertex(x, y);
  }
  endShape();
}

// Male and female name databases. Obtained from https://data.world/howarder/gender-by-name
let fnames, mnames;
function preload() {
  fnames = loadStrings('fnames.txt');
  mnames = loadStrings('mnames.txt');
}


let name;
let drawM, drawF;

travisListener.connect();
travisListener.on(data => {
  name = data.commit.author_name

  // console.log(name)

  // if (data.commit.user) {
  //   console.log(data.commit.user.name)
  // }
  var firstName = name.split(" ")[0].trim().toLowerCase(); 
  // console.log(firstName)
  // console.log("Contains a male name: " + mnames.includes(firstName));
  if(mnames.includes(firstName)){
    drawM = true;
  }
  // console.log("Contains a female name: " + fnames.includes(firstName));
  if(fnames.includes(firstName)){
    drawF = true;
    console.log(firstName)
  }
})


function setup() {
  preload();
  createCanvas(600, 600);
}

function draw() {
  textSize(10);
  fill(0, 102, 153);
  noStroke();

  if(drawM){
    fill(255,230,30)
    ellipse(random(width), random(height), 55, 55);
    drawM = false;
  }

  if(drawF){
    fill(150,100,240)
    ellipse(random(width), random(height), 55, 55);
    drawF = false;
  }

  // text(name, 10, 10, 1000, 1000);
}

// Male and female names
let fnames, mnames;
function preload() {
  fnames = loadStrings('fnames.txt');
  mnames = loadStrings('mnames.txt');
  // console.log(fnames)
}


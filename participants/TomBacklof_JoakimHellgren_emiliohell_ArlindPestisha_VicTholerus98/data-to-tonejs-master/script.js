function postColor(color) {
	for (i=0; i < 24; i++) { 
    fetch('https://ci-lights.azurewebsites.net/setcolor', {
		   method: 'post',
            body: JSON.stringify({
				id: `${i}`,
                color: [parseInt(Math.random()*255), 80, 120],
                session: 'whatever',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => console.log(res));
}
 }

// P5JS:


//Tree1:
var myTree;
var startPoint;
var direction;
var count;

function setup() 
{
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0, 250); //Bakrundsfärg Orginal: 230, 250, 220
  ellipseMode(CENTER);
  stroke(80, 0, 50, 200);
  fill(250, 80, 120, 120); //(250, 80, 120, 120);
  ellipseMode(CENTER);
  smooth();

  startPoint = createVector(width/2, height);
  direction = createVector(0, -height);
  myTree = new Tree(startPoint, direction);
  count = myTree.treeSize;
  
}

function draw() {
  background(0, 0, 0, 250); //1.Bakrundsfärg innan "reload".
  myTree.swing();

  stroke(random(255), random(255), random(255), random(255));
  var tempIndex;
  var i;
  for(i = 1; i < count; i++)
  {
    strokeWeight(myTree.twig[parseInt(myTree.map[i].x)].thickness[parseInt(myTree.map[i].y)]);
    line(myTree.twig[parseInt(myTree.map[i].x)].location[parseInt(myTree.map[i].y) - 1].x, myTree.twig[parseInt(myTree.map[i].x)].location[parseInt(myTree.map[i].y) - 1].y,
         myTree.twig[parseInt(myTree.map[i].x)].location[parseInt(myTree.map[i].y)].x, myTree.twig[parseInt(myTree.map[i].x)].location[parseInt(myTree.map[i].y)].y);
  }

  noStroke(); 
  for(i = 0; i < myTree.twig.length; i++)
  {
    var num = myTree.twig[i].location.length - 1;
    ellipse(myTree.twig[i].location[num].x, myTree.twig[i].location[num].y, 12, 12);
  }
}

function newtree1() {
  background(255, 255, 255, 255); //1.Bakrundsfärg 
  stroke(255, 255, 255, 255);
  myTree = new Tree(startPoint, direction);
  count = myTree.treeSize;
} 

function Branch(loc, thic, id, branchIndex)
{
  this.location = [createVector(loc.x, loc.y)];
  this.thickness = [thic];

  this.baseIndex = []
  this.baseIndex.push([id]);
  this.baseIndex.push([branchIndex]);

  this.dTheta = [];
  this.isCandidate = false;
}

Branch.prototype.branchRotate = function(index, theta, reference)
{
  this.location[index].sub(reference);
  this.rotate2D(this.location[index], theta);
  this.location[index].add(reference);
}

Branch.prototype.rotate2D = function(v, theta)
{
  var xTemp = v.x;
  v.x = v.x * cos(theta) - v.y * sin(theta);
  v.y = xTemp * sin(theta) + v.y * cos(theta);
}


function Frontier(a,b)
{
  if(Object.prototype.toString.call(a) === '[object Object]' 
     && typeof b === 'undefined')
  {
    //a is parent
    this.constructorWithParent(a);
  }
  else
  {
    // a is location, and b is direction
    this.constructorWithStarPoint(a,b);
  }    
}


Frontier.prototype.constructorWithStarPoint = function(startPoint, direction) {
  this.location = createVector(startPoint.x, startPoint.y);
  this.velocity = createVector(direction.x, direction.y);
  this.thickness = random(10, 50);
  this.finished = false;
}

Frontier.prototype.constructorWithParent = function(parent) 
{
  this.location = parent.location.copy();
  this.velocity = parent.velocity.copy();
  this.thickness = parent.thickness;
  parent.thickness = this.thickness;
  this.finished = parent.finished;
}

Frontier.prototype.update = function(factor) 
{
  if(  this.location.x > -10 
     & this.location.y > -10
     & this.location.x < width + 10
     & this.location.y < height + 10 
     & this.thickness > factor)  
  {
    this.velocity.normalize();
    var uncertain = createVector(random(-1, 1), random(-1, 1));
    uncertain.normalize();
    uncertain.mult(0.2);
    this.velocity.mult(0.8);
    this.velocity.add(uncertain);
    this.velocity.mult(random(8, 15));
    this.location.add(this.velocity);
  }

  else
  {
    this.finished = true;
  }

} // void update()



function Tree(startPoint, direction)
{
  this.treeSize;
  var BranchLengthFactor = 0.3;
  var BranchLocationFactor = 0.3;
  this.dt = 0.025;
  this.time = 0;
  this.dtheta;

  this.candNum = 3;
  this.candidateIndex = Array(this.candNum);
  this.amplitude = Array(this.candNum);
  this.phaseFactor = Array(this.candNum);
  this.freq;
  this.period;

  var id = 0;
  var growth = false;

  this.fr = [new Frontier(startPoint, direction)];
  this.twig = [new Branch(this.fr[id].location, this.fr[id].thickness, id, 0)];
  this.map = [createVector(this.id, this.twig[id].location.length - 1)];

  while(!growth)
  {
    var growthSum = 0;
    for(id = 0; id < this.fr.length; id++)
    {
      this.fr[id].update(BranchLocationFactor);
      if(!this.fr[id].finished)
      {
        this.twig[id].location.push(createVector(this.fr[id].location.x, this.fr[id].location.y)); 
        this.twig[id].thickness.push(this.fr[id].thickness);
        this.map.push(createVector(id, this.twig[id].location.length - 1));

        if (random(0, 1) < BranchLengthFactor)  // control length of one branch  
        { 
          this.fr[id].thickness *= 0.65;
          this.twig[id].thickness[this.twig[id].thickness.length - 1] = this.fr[id].thickness;
          if(this.fr[id].thickness > BranchLocationFactor)  // control the number of the locations on all branches, i.e., treeSize.
          {

            this.fr.push(new Frontier(this.fr[id]));           
            this.twig.push(new Branch(this.fr[id].location, this.fr[id].thickness, id, this.twig[id].location.length - 1));

            var _id = id;
            if(_id !== 0)
            {
              for(var _i = 0; _i < 2; _i++)
              {
                this.twig[this.twig.length - 1].baseIndex[_i] = concat(this.twig[this.twig.length - 1].baseIndex[_i], this.twig[_id].baseIndex[_i]);
              }
            }
          }

        } // if (random(0, 1) < 0.2)

      }
      else
      {
        growthSum++;
      }
    }
    if(growthSum == this.fr.length) 
    {
      this.dtheta = Array(this.twig.length);
      this.treeSize = this.map.length;
      growth = true;
    }
  } // while(!growth)

  var _candList = [];
  var _candfloat = Array(this.twig.length);
  var i;
  for(i = 0; i < this.twig.length; i++)
  {
    _candfloat[i] = parseFloat(this.twig[i].location.length);
    _candList.push(_candfloat[i]);
  }
  this.candidateIndex[0] = 0;
  this.twig[0].isCandidate = true;
  this.twig[0].dTheta = Array(this.twig[0].location.length);
  _candfloat[0] = -1.0;
  _candList[0] = -1.0;
  for(i = 1; i < this.candNum; i++) 
  {
    var _temp = max(_candfloat);
    this.candidateIndex[i] = _candList.indexOf(_temp);
    this.twig[this.candidateIndex[i]].isCandidate = true;
    this.twig[this.candidateIndex[i]].dTheta = Array(this.twig[this.candidateIndex[i]].location.length);
    _candfloat[this.candidateIndex[i]] = -1.0;
    _candList[this.candidateIndex[i]] = -1.0;
  }
  //    println(this.candidateIndex);

  this.amplitude[0] = random(0.006, 0.012);
  this.phaseFactor[0] = random(0.6, 1.2);
  this.freq = random(0.5, 0.8);
  this.period = 1 / this.freq;
  for(i = 1; i < this.candNum; i++)
  {
    this.amplitude[i] = this.amplitude[i-1] * random(0.9, 1.4);
    this.phaseFactor[i] = this.phaseFactor[i-1] * random(0.9, 1.4);
  }
}

Tree.prototype.swing = function()
{
  var j;
  for(var i = 0; i < this.candNum; i++)
  {
    var _num = this.twig[this.candidateIndex[i]].location.length;
    for(j = 0; j < _num; j++)  this.twig[this.candidateIndex[i]].dTheta[j] = this.amplitude[i] * this.dt * TWO_PI * this.freq * cos(TWO_PI * this.freq * this.time - this.phaseFactor[i] * PI * parseFloat(j) / parseFloat(_num));
  }

  for(var id = 0; id < this.twig.length; id++)
  {
    if(this.twig[id].isCandidate)
    {
      for(var _id = 1; _id < this.twig[id].location.length; _id++)
      {
        this.twig[id].branchRotate(_id, this.twig[id].dTheta[_id], this.twig[id].location[0]);
      }
    }

    for(j = 0; j < this.twig[id].baseIndex[0].length; j++)
    {
      if(!this.twig[this.twig[id].baseIndex[0][j]].isCandidate | id === 0)
      {
        continue;
      }
      else
      {
        for(var k = (id === 0) ? 1 : 0; k < this.twig[id].location.length; k++)
        {
          this.twig[id].branchRotate(k, this.twig[this.twig[id].baseIndex[0][j]].dTheta[this.twig[id].baseIndex[1][j]], this.twig[this.twig[id].baseIndex[0][j]].location[0]);
        }
      }
    }

  } // for(int id = 0; id < twig.length; id++)

  this.time += this.dt;
  if(this.time >= this.period) this.time -= this.period;    
}
















//create a synth and connect it to the master output (your speakers)
//Synths are capable of a wide range of sounds depending on their settings
var freeVerb = new Tone.Freeverb({
	roomSize : 0.95,
	dampening : 4000,
	wet : 0.3
});
var volSine = new Tone.Volume(-12);
var volPluck = new Tone.Volume(-18);
var pingPong = new Tone.PingPongDelay("4n", 0.2);
var tremolo = new Tone.Tremolo().start();
var comp = new Tone.Compressor(-64, 3);
var channel = new Tone.Channel({
	pan : 0,
	volume : -12
});
var channelTwo = new Tone.Channel({
	pan : 0,
	volume : -100
});
var pingPong = new Tone.PingPongDelay("3n", 0.7);

var synthA = new Tone.PolySynth(6, Tone.Synth, {
	oscillator : {
		  type : "sine"
	  },
	envelope : {
		attack : 1.5,
		decay : 2.3,
		sustain : 0,
		release : 6
	}
}).chain(volSine, pingPong, freeVerb, tremolo, channel, comp, Tone.Master);

var KickDrum = new Tone.MembraneSynth({
	pitchDecay : 0.11,
	octaves : 5
}).chain(channel, comp, Tone.Master);

var synthB = new Tone.PluckSynth({
	attackNoise : 1,
	dampening : 1000,
	resonance : 0.7
}).chain(volPluck, pingPong, freeVerb, tremolo, channelTwo, comp, Tone.Master);


// randomizers
var randomOne = 'C4';

	
//erlang
var countColorOne = 0; var countColorTwo = 0;
var treeCount = 0; var treeCountTwo = 0;
var kickCount = 0; 
var pluckCountOne = 0; var pluckCountTwo = 0; var pluckCountThree = 0;
var pluckCountFour = 0; var pluckCountFive = 0; var pluckCountSix = 0;

var node_js = 0; var python = 0; var java = 0; var generic = 0; var ruby = 0;
var scala = 0; var php = 0; var cpp = 0; var elixir = 0; var go = 0; 
var minimal = 0; var sh = 0; var julia = 0;	var objectiveC = 0; var rust = 0;
var r = 0; var bash = 0; var cplusplus = 0; var csharp = 0;

var canAddPostOne = true; var canAddPostTwo = true;
var canAddTree = true; var canAddTreeTwo = true;
var canAddKickDrum = true;
var canAddPluckOne = true; var canAddPluckTwo = true; var canAddPluckThree = true; 
var canAddPluckFour = true; var canAddPluckFive = true; var canAddPluckSix = true;

var canAddNode = true; var canAddPython = true; var canAddJava = true; var canAddGeneric = true; var canAddRuby = true;
var canAddScala = true; var canAddPhp = true; var canAddCpp = true; var canAddElixir = true; var canAddGo = true;
var canAddMinimal = true; var canAddSh = true; var canAddJulia = true; var canAddObjectivec = true; var canAddRust = true;
var canAddR = true; var canAddBash = true; var canAddCplusplus = true; var canAddCsharp = true;

var ws = null;
var onmessage = function (e) {
    // basic check if the message is in JSON format.
    if (e.data[0] != '{') return;
    var data = JSON.parse(e.data);
    // and log it to the console, like so.
	// console.log(data);
	       
    // event types
	if (canAddNode) {
		if (data.data.config.language === 'node_js') {
			node_js += 1;
			randomOne = 'C3';
		}
	}
	if (node_js > 5 & node_js < 8) {
		synthA.triggerAttackRelease([randomOne], "8n");
		node_js = 0;
		canAddNode = false;
		setTimeout(function() {
			canAddNode = true;
		}, 3500);
	}
	///////////////////////////////////////////////////
	if (canAddPython) {
		if (data.data.config.language === 'python') {
			python += 1;
			randomOne = 'E3';
		}
	}
	if (python > 5 & python < 8) {
		synthA.triggerAttackRelease([randomOne], "8n");
		python = 0;
		canAddPython = false;
		setTimeout(function() {
			canAddPython = true;
		}, 2400);
	}
	///////////////////////////////////////////////////
	if (canAddJava) {
		if (data.data.config.language === 'java') {
			java += 1;
			randomOne = 'G3';
		}
	}
	if (java > 3 & java < 8) {
		synthA.triggerAttackRelease([randomOne], "8n");
		java = 0;
		canAddJava = false;
		setTimeout(function() {
			canAddJava = true;
		}, 3000);
	}
	///////////////////////////////////////////////////
	if (canAddGeneric) {
		if (data.data.config.language === 'generic') {
			generic += 1;
			randomOne = 'B3'
		}
	}
	if (generic > 2 & generic < 4) {
		synthA.triggerAttackRelease([randomOne], "8n");
		generic = 0;
		canAddGeneric = false;
		setTimeout(function() {
			canAddGeneric = true;
		}, 3500);
	}
	///////////////////////////////////////////////////
	if (canAddRuby) {
		if (data.data.config.language === 'ruby') {
			ruby += 1;
			randomOne = 'C4';
		}
	}
	if (ruby > 2 & ruby < 4) {
		synthA.triggerAttackRelease([randomOne], "8n");
		ruby = 0;
		canAddRuby = false;
		setTimeout(function() {
			canAddRuby = true;
		}, 3200);
	}
	//////////////////////////////////////////
	if (canAddScala) {
		if (data.data.config.language === 'scala') {
			ruby += 1;
			randomOne = 'E4';
		}
	}
	if (scala > 2 & scala < 4) {
		synthA.triggerAttackRelease([randomOne], "8n");
		scala = 0;
		canAddScala = false;
		setTimeout(function() {
			canAddScala = true;
		}, 2000);
	}
	//////////////////////////////////////////
	if (canAddPhp) {
		if (data.data.config.language === 'php') {
			php += 1;
			randomOne = 'G4';
		}
	}
	if (php > 2 & php < 4) {
		synthA.triggerAttackRelease([randomOne], "8n");
		php = 0;
		canAddPhp = false;
		setTimeout(function() {
			canAddPhp = true;
		}, 3200);
	}
	//////////////////////////////////////////
	if (canAddCpp) {
		if (data.data.config.language === 'cpp') {
			cpp += 1;
			randomOne = 'B4';
		}
	}
	if (cpp > 2 & cpp < 4) {
		synthA.triggerAttackRelease([randomOne], "8n");
		cpp = 0;
		canAddCpp = false;
		setTimeout(function() {
			canAddCpp = true;
		}, 2500);
	}
	//////////////////////////////////////////
	if (canAddPluckOne) {
		if (data.data.config.os === 'linux' & data.data.config.language === 'node_js') {
			pluckCountOne += 1;
			randomOne = 'C2';
		}
	}
	if (pluckCountOne > 5) {
		synthB.triggerAttackRelease('C2', "8n");
		pluckCountOne = 0;
		canAddPluckOne = false;
		setTimeout(function() {
			canAddPluckOne = true;
		}, 1800);
	}
	//////////////////////////////////////////
	if (canAddPluckTwo) {
		if (data.data.config.os === 'linux' & data.data.config.language === 'python') {
			pluckCountTwo += 1;
			randomOne = 'E5';
		}
	}
	if (pluckCountTwo > 2) {
		synthB.triggerAttackRelease('E5', "8n");
		pluckCountTwo = 0;
		canAddPluckTwo = false;
		setTimeout(function() {
			canAddPluckTwo = true;
		}, 1024);
	}
	//////////////////////////////////////////
	if (canAddPluckThree) {
		if (data.data.config.os === 'osx'& data.data.config.language === 'node_js') {
			pluckCountThree += 1;
			randomOne = 'G2';
		}
	}
	if (pluckCountThree > 1) {
		synthB.triggerAttackRelease('G2', "8n");
		pluckCountThree = 0;
		canAddPluckThree = false;
		setTimeout(function() {
			canAddPluckThree = true;
		}, 2000);
	}
	//////////////////////////////////////////
	if (canAddPluckFour) {
		if (data.data.config.os === 'osx') {
			pluckCountFour += 1;
		}
	}
	if (pluckCountFour > 3) {
		synthB.triggerAttackRelease('B5', "8n");
		pluckCountFour = 0;
		canAddPluckFour = false;
		setTimeout(function() {
			canAddPluckFour = true;
		}, 1500);
	}
	//////////////////////////////////////////
	if (canAddPluckFive) {
		if (data.data.config.os === 'osx' & data.data.config.language === 'ruby') {
			pluckCountFive += 1;
		}
	}
	if (pluckCountFive > 4) {
		synthB.triggerAttackRelease('C6', "8n");
		pluckCountFive = 0;
		canAddPluckFive = false;
		setTimeout(function() {
			canAddPluckFive = true;
		}, 1650);
	}
	//////////////////////////////////////////
	if (canAddKickDrum) {
		if (data.event === 'job') {
			kickCount += 1;
		}
	}
	if (kickCount > 0) {
        KickDrum.triggerAttack('C2');
        kickCount = 0;
        canAddKickDrum = false;
        setTimeout(function() {
            canAddKickDrum = true;
        }, 500);
    
        
	}
	//////////////////////////////////////////
	if (canAddPostOne) {
		if (data.data.config.os === 'osx') {
			countColorOne += 1;
		}
	}
	if (countColorOne > 1) {
        postColor([parseInt(Math.random()*255), 80, 120]);
        countColorOne = 0;
        canAddPostOne = false;
        setTimeout(function() {
            canAddPostOne = true;
        }, 1000);
	}
	//////////////////////////////////////////
	if (canAddPostTwo) {
		if (data.data.config.os === 'linux') {
			countColorTwo += 1;
		}
	}
	if (countColorTwo > 1) {
        postColor([0, 0, 0]);
        countColorTwo = 0;
        canAddPostTwo = false;
        setTimeout(function() {
            canAddPostTwo = true;
        }, 1000);
	}
	//////////////////////////////////////////
	if (canAddTree) {
		if (data.event === 'job') {
			treeCount += 1;
		}
	}
	if (treeCount > 1) {
		newtree1();
		treeCount = 0;
		canAddTree = false;
		setTimeout(function() {
			canAddTree = true;
		}, 5000);
	}
	//////////////////////////////////////////
	if (canAddTreeTwo) {
		if (data.data.config.language === 'node_js') {
			treeCountTwo += 1;
		}
	}
	if (treeCountTwo > 3) {
		treeCountTwo = 0;
		canAddTreeTwo = false;
		setTimeout(function() {
			canAddTreeTwo = true;
		}, 5000);
	}
	
	
	

//	if (data.data.config.language === 'node_js	') {
//		node_js += 1;
//	}
//
//
//	if (node_js > 5) {
//		synthA.triggerAttackRelease('C4');
//		node_js = 0;
//	}

	// heres the most recent code Eskil gave me (monday/w41/data visualization presentation) 
	// to try to incorporate in to our project.
	// the idea behind this line of code is to create a counter that keeps track of
	// which language have been called x times in a row, similar to how the python fighting game
	// that Tom linked in the facebook group chat.
	// broken atm.
	// vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

	//		var counter = {};
    //		            
    //		            
	//		if (counter[job.language]) {
	//			counter[job.language] += 1;
	//		} else {
	//			counter[data.data.config.language == 'python'] = 0;
	//		}
	//		
	//		if (counter.node_js > 5) {
	//			playSound();
	//			counter.node_js = 0;
	//		} 
	//		
	//		Object.keys(counter).forEach(function(language) {
	//			playSound(language + '.mp3');
	//			counter[language] = 0;
	//		});

	// GOOD LUCK.



    // job details, the structure of the job is available here: https://docs.travis-ci.com/api/#jobs
	//dont think this code block is actually nessecary.
    var job = data.data;
    var commit = job.commit;
    console.log(job.config.language);
};




//this is just travis websocket/api(?). this is where all the data comes from
function startWS(){
    ws = new WebSocket("wss://travis.durieux.me");
    if (onmessage != null) {
        ws.onmessage = onmessage;
    }
    ws.onclose = function(){
        // Try to reconnect in 5 seconds
        setTimeout(function(){startWS()}, 5000);
    };
}
startWS();



//start/stop the transport
document.querySelector('#melody').addEventListener('change', e => KickDrum.triggerAttackRelease('C2'))



































let tryAgain = document.querySelector('.game-over .button');
let home = document.querySelector('.home');
const novice = document.getElementById('novice');
const intermidate = document.getElementById('intermidate');
const expert = document.getElementById('expert');
const skill = document.querySelector('.skill');
let start = document.querySelector('.home .button');
let homeScore = document.querySelector('.home .score');
let timer = document.querySelector('.start-timer');

let obstGenSpeed,pillarSpeed,holeHeightCss;
let selectedBtn;




//get skill level onload according to high score of local storage
window.addEventListener('load',function(){
if(localStorage.getItem('flappyBirdHighScore')){
	let highestScore = localStorage.getItem('flappyBirdHighScore');
	homeScore.innerHTML = highestScore;
	if(highestScore > 10 && highestScore <= 30){
		novice.removeAttribute('checked');
		expert.removeAttribute('checked');
		intermidate.setAttribute('checked','yes');
		selectedBtn = 'intermidate';
	}else if(highestScore > 30){
		novice.removeAttribute('checked');
		intermidate.removeAttribute('checked');
		expert.setAttribute('checked','yes');
		selectedBtn = 'expert';
	}else if(highestScore <= 10){
		expert.removeAttribute('checked');
		intermidate.removeAttribute('checked');
		novice.setAttribute('checked','yes');
		selectedBtn = 'novice';
	};
}else{
	homeScore.innerHTML = 0;
	selectedBtn = 'novice';
};

});

let playerName;



///////souunds
	const die = new Audio("audio/sfx_die.wav");
	const flap = new Audio("audio/sfx_flap.wav");
	const hit = new Audio("audio/sfx_hit.wav");
	const point = new Audio("audio/sfx_point.wav");
	const swoosh = new Audio("audio/sfx_swooshing.wav");



//updating selectedBtn variable on changing the selected radio btn
skill.addEventListener('click',function(e){
	const id = e.target.getAttribute('id');
	if(id == 'novice'){
		selectedBtn = 'novice';
	}else if(id == 'intermidate'){
		selectedBtn = 'intermidate';
	}else if(id == 'expert'){
		selectedBtn = 'expert';
	};
});

//making changes in app according to skill set sleccted

function applyGameSettings(){
	if(selectedBtn == 'novice'){
			obstGenSpeed = 1900;
			pillarSpeed = 4;
		 	holeHeightCss = 200 + 'px';
	}else if(selectedBtn == 'intermidate'){
			obstGenSpeed = 1500;
		 	pillarSpeed = 5;
			holeHeightCss = 170 + 'px';
	}else if (selectedBtn == 'expert'){
			obstGenSpeed = 1100;
			pillarSpeed = 6.5;
			holeHeightCss = 150 + 'px';
	};
}


//making timer function's countdown + App function to run
function timerCountDown(){
	timer.style.display = 'flex';
	const timerspeed = 600;
		setTimeout(function(){timer.innerHTML = 2;
			point.currentTime = 0;
			point.play()},timerspeed);

		setTimeout(function(){timer.innerHTML = 1;
			point.currentTime = 0;
			point.play()},timerspeed*2);

		setTimeout(function(){
			timer.style.fontSize = '5rem'
			timer.innerHTML = 'Boom!';
			point.play();
			swoosh.play();
		},timerspeed*3);

		setTimeout(function(){
		timer.style.display = 'none';
		App();
		timer.innerHTML = '3';
		timer.style.fontSize = '15rem'
		},timerspeed*3+timerspeed/2);
}

start.addEventListener('click',function(){
	point.play();
	home.style.display = 'none';
	timerCountDown();
	applyGameSettings();
});

function App(){
	let scoreUStatus = 'ok';

	const bird = document.querySelector('.bird');
	const playground = document.querySelector('.playground');
	const hole = document.querySelector('.hole');


	let playgroundHeight = parseFloat(window.getComputedStyle(playground).getPropertyValue('height'));
	let playgroundWidth = parseFloat(window.getComputedStyle(playground).getPropertyValue('width'));

	let birdLeft = parseFloat(window.getComputedStyle(bird).getPropertyValue('left'));
	let birdWidth = parseFloat(window.getComputedStyle(bird).getPropertyValue('width'));
	let birdHeight = parseFloat(window.getComputedStyle(bird).getPropertyValue('height'));

	// obstGenSpeed 2000
	// pillarSpeed 3
	//holeHeightCss 170px





	

	let	isGameOver = false;

	let birdRotate = 0;
	let birdGravity = setInterval(gravity,20);

	document.body.addEventListener('click',pullUp);
	window.addEventListener('keydown',function(e){
		// swoosh.play();
		if(e.keyCode == 32){

			pullUp()
			
	}
	});


	function gravity(){
		let birdBottom = parseFloat(window.getComputedStyle(bird).getPropertyValue('bottom'));
		
		if(birdBottom > 0) {
		birdBottom -= 5;
		bird.style.bottom = birdBottom + 'px';

			if(birdRotate < 30){
			birdRotate += 1;
			bird.style.transform = `rotateZ(${birdRotate}deg)`;
			}
		}

	}


	function pullUp(){
		if(isGameOver===false){
	flap.currentTime = 0;
		flap.play();
		clearInterval(gravity);
		let birdBottom = parseFloat(window.getComputedStyle(bird).getPropertyValue('bottom'));

		if(birdBottom < playgroundHeight - 90) {
			

	let oks = setInterval(function(){
		
			bird.style.bottom = `${birdBottom + 60}px`;
			birdRotate = -15;
			bird.style.transform = `rotateZ(${birdRotate}deg)`;}
		,5);

		setTimeout(function(){
			clearInterval(oks);
		},100)

	}}
	}

	let generateObstacleLeft = setInterval(function(){
console.log(playgroundHeight);
		let holeTop = Math.floor(Math.random()*250 + 50);


		let obstacleLeft = playgroundWidth;

		let obstacleBottom = document.createElement('div');
		let hole = document.createElement('div');

		obstacleBottom.classList.add('obstacle');
		hole.classList.add('hole');
		hole.style.height = holeHeightCss;

		playground.appendChild(obstacleBottom);
		playground.appendChild(hole);


		let moveObstacleLeft = setInterval(function(){
			obstacleLeft -= pillarSpeed;
			if(isGameOver === false){obstacleBottom.style.left = obstacleLeft;
			hole.style.left = obstacleLeft -2 +'px';
			hole.style.top = holeTop + 'px';
		}
		},20);

		let obstacleWidth = parseFloat(window.getComputedStyle(obstacleBottom).getPropertyValue('width'));

		let removeObstacleLeft = setInterval(function(){
			let obstLeft = parseFloat(window.getComputedStyle(obstacleBottom).getPropertyValue('left'));
			if(obstLeft <= -obstacleWidth){
			scoreUStatus = 'ok';
				obstacleBottom.remove();
				hole.remove();
			}
		},10)

	let holeHeight = parseFloat(window.getComputedStyle(hole).getPropertyValue('height'));

	let checkDead = setInterval(function(){
		let birdBottom = parseFloat(window.getComputedStyle(bird).getPropertyValue('bottom'));
		let obstacleLeft = parseFloat(window.getComputedStyle(obstacleBottom).getPropertyValue('left'));

		if(birdBottom<0){
			isGameOver = true;
			die.play();
			clearInterval(generateObstacleLeft);
			clearInterval(moveObstacleLeft);
			clearInterval(removeObstacleLeft);
			clearInterval(birdGravity);
			clearInterval(calculateScore);
			gameOver();
		}else{
			if(obstacleLeft+obstacleWidth>birdLeft && obstacleLeft<birdLeft+birdWidth ){
				if((birdBottom+birdHeight)>(playgroundHeight-holeTop) || (birdBottom)<(playgroundHeight-(holeTop+holeHeight))) {
				isGameOver = true;
					
					hit.play();
					clearInterval(generateObstacleLeft);
					clearInterval(moveObstacleLeft);
					clearInterval(removeObstacleLeft);
					clearInterval(birdGravity);
					clearInterval(calculateScore);
					gameOver();
				};
			};
		}
	},1)

let calculateScore = setInterval(function(){
		let obstacleLeft = parseFloat(window.getComputedStyle(obstacleBottom).getPropertyValue('left'));

		if(obstacleLeft+obstacleWidth/2 <= birdLeft){
			if (scoreUStatus == 'ok') {
			updateScore();
			scoreUStatus = 'nope';
			};
		}
	},10)
function updateScore(){
	point.play();
	let scoreBox = document.querySelector('.playground .score-board .score');
	scoreBox.innerHTML = +scoreBox.innerHTML + 1;
	
}


	 function gameOver(){
	 	swoosh.play();
		clearInterval(checkDead);
		let scoreBox = document.querySelector('.playground .score-board .score');
		let score = parseInt(scoreBox.innerHTML);
		document.querySelector('.game-over .score').innerHTML = score;

		let prevScore = localStorage.getItem('flappyBirdHighScore');
		if(score>prevScore){
			localStorage.setItem('flappyBirdHighScore', score);
		};

		let overMsg = document.querySelector('.game-over');
		overMsg.style.display = 'flex';
	}
	},obstGenSpeed);

tryAgain.addEventListener('click',function(){
	window.location.reload();
});

}

const PI180 = (Math.PI / 180);
const COLORS = [
	{ r:4, g:40, b:102 },
	{ r:211, g:232, b:232 },
	{ r:249, g:151, b:192 },
	{ r:240, g:240, b:240 }
];
const SIZE = 500;
const HALF_SIZE = (SIZE / 2);
const ORBIT_RADIUS = 50;
const ORBIT_SPEED = 1;
const SPAWN_DELAY = 5;
const FADE_TIME = 10;
const ROTATION_AMOUNT = 3;

function Logo(src, dest, centerX, centerY, size, color, alpha, rotation) {
	this.logo = document.getElementById('logo');
	this.src = src;
	this.srcCtx = src.getContext('2d');
	this.dest = dest;
	this.destCtx = dest.getContext('2d');
	this.x = centerX;
	this.y = centerY;
	this.size = size;
	this.half = this.size / 2;
	this.color = color;
	this.alpha = alpha;
	this.rotation = rotation;

	this.draw = (() => {
		this.src.width = SIZE;
		this.src.height = SIZE;
		this.srcCtx.save();
		this.srcCtx.translate(HALF_SIZE, HALF_SIZE);
		this.srcCtx.rotate(this.rotation * PI180);
		this.srcCtx.drawImage(this.logo, -HALF_SIZE, -HALF_SIZE, SIZE, SIZE);
		this.srcCtx.restore();

		let data = this.srcCtx.getImageData(0, 0, SIZE, SIZE);
		for (let i = 0; i < data.data.length; i += 4) {
			if (data.data[i+3] !== 0) {
				data.data[i] = this.color.r;
				data.data[i+1] = this.color.g;
				data.data[i+2] = this.color.b;
			}
		}
		this.srcCtx.putImageData(data, 0, 0);

		this.destCtx.globalAlpha = this.alpha;
		this.destCtx.drawImage(this.src, 0, 0, SIZE, SIZE, (this.x - this.half), (this.y - this.half), this.size, this.size);
		this.destCtx.globalAlpha = 1;
	});
}

let dropper = (() => {
	let stagePrep = document.getElementById('stage-prep');
	let stage = document.getElementById('stage');
	let stageCtx = stage.getContext('2d');

	let primary = null;
	let logos = [];
	let logoSpawnCounter = SPAWN_DELAY;
	let curColorIdx = 0;
	let curColor = {
		r: COLORS[curColorIdx].r,
		g: COLORS[curColorIdx].g,
		b: COLORS[curColorIdx].b
	};
	let curAngle = 0;
	let curCenter = {
		x: 540,
		y: 540
	};
	let curRotation = 0;

	function Init() {
		stage.width = 1080;
		stage.height = 1080;

		primary = new Logo(stagePrep, stage, curCenter.x, curCenter.y, SIZE, {...curColor}, 1, curRotation);

		ColorShift();
		requestAnimationFrame(Tick);
	}
	function Tick() {
		PrimaryFloat();

		primary.color.r = parseInt(curColor.r, 10);
		primary.color.g = parseInt(curColor.g, 10);
		primary.color.b = parseInt(curColor.b, 10);
		primary.x = parseInt(curCenter.x, 10);
		primary.y = parseInt(curCenter.y, 10);
		primary.rotation = curRotation;

		logoSpawnCounter--;
		if (logoSpawnCounter <= 0) {
			logoSpawnCounter = SPAWN_DELAY;

			let newLogo = new Logo(stagePrep, stage, primary.x, primary.y, SIZE, {...primary.color}, 1, primary.rotation);
			logos.push(newLogo);
			TweenMax.to(newLogo, FADE_TIME, {
				size: 2,
				half: 1,
				alpha: 0,
				onComplete: function() {
					logos.shift();
				}
			});
		}

		stageCtx.clearRect(0, 0, 1080, 1080);
		for (let i = 0; i < logos.length; i++) {
			logos[i].draw();
		}
		primary.draw();

		requestAnimationFrame(Tick);
	}
	function ColorShift() {
		curColorIdx++;
		if (curColorIdx >= COLORS.length) {
			curColorIdx = 0;
		}

		TweenMax.to(curColor, 2, {
			r: COLORS[curColorIdx].r,
			g: COLORS[curColorIdx].g,
			b: COLORS[curColorIdx].b,
			onComplete: function() {
				ColorShift();
			}
		});
	}
	function PrimaryFloat() {
		curAngle += ORBIT_SPEED;
		if (curAngle >= 360) {
			curAngle = 360 - curAngle;
		}
		curRotation += ROTATION_AMOUNT;
		if (curRotation >= 360) {
			curRotation = 360 - curRotation;
		}

		let radAngle = curAngle * PI180;
		curCenter.x = 540 + ORBIT_RADIUS * Math.cos(radAngle);
		curCenter.y = 540 + ORBIT_RADIUS * Math.sin(radAngle);
	}

	return {
		Init: Init
	};
})();

dropper.Init();

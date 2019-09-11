const CIRCLE_RADIUS = 2;
const CIRCLE_COLORS = [
	"1, 205, 215",
	"39, 248, 125",
	"189, 189, 189"
];
const STAGE_WIDTH = 1080;
const STAGE_HEIGHT = 1080;
const FULL_CIRCLE = (2 * Math.PI);
const NUM_DOTS = 5000;

function rnd(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function Dot(startX, startY, startColor, startAlpha) {
	this.x = startX;
	this.y = startY;
	this.color = startColor;
	this.alpha = startAlpha;
	
	this.draw = ((ctx) => {
		ctx.beginPath();
		ctx.arc(this.x, this.y, CIRCLE_RADIUS, 0, FULL_CIRCLE, false);
		ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
		ctx.fill();
	});
}

let dots = (() => {
	let preloadedSVG = document.getElementById("svgPreload");
	let stage = document.getElementById("canvas-dots");
	let stageCtx = stage.getContext('2d');
	let prep = document.getElementById("canvas-prep");
	let prepCtx = prep.getContext('2d');

	let dots = [];

	function Init() {
		stage.width = prep.width = STAGE_WIDTH;
		stage.height = prep.height = STAGE_HEIGHT;

		for (let i = 0; i < NUM_DOTS; i++) {
			let d = new Dot(rnd(0, STAGE_WIDTH), rnd(0, STAGE_HEIGHT), CIRCLE_COLORS[rnd(0, CIRCLE_COLORS.length - 1)], 0.3);
			dots.push(d);

			MoveDot(d, null);
		}

		setTimeout(FillSVG, 3000);
		requestAnimationFrame(Tick);
	}

	function Tick() {
		stageCtx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);

		for (let i = 0; i < NUM_DOTS; i++) {
			dots[i].draw(stageCtx);
		}

		requestAnimationFrame(Tick);
	}

	function FillSVG() {
		let imgData = null;
		let positions = [];

		prepCtx.clearRect(0, 0, STAGE_WIDTH, STAGE_HEIGHT);
		prepCtx.drawImage(preloadedSVG, 50, 50, 980, 980);

		imgData = prepCtx.getImageData(0, 0, STAGE_WIDTH, STAGE_HEIGHT).data;
		for (let i = imgData.length; i >= 0; i -= 4) {
			if (imgData[i] !== 0) {
				let x = (i / 4) % STAGE_WIDTH;
				let y = Math.floor(Math.floor(i / STAGE_WIDTH) / 4);

				if ((x && x % (CIRCLE_RADIUS * 2 + 3) === 0) && (y && y % (CIRCLE_RADIUS * 2 + 3) === 0)) {
					positions.push({
						x: x,
						y: y
					});
				}
			}
		}

		for (let i = 0; i < positions.length; i++) {
			MoveDot(dots[i], positions[i]);
		}

		setTimeout(BreakSVG, 3000);
	}
	function BreakSVG() {
		for (let i = 0; i < NUM_DOTS; i++) {
			MoveDot(dots[i], null);
		}

		setTimeout(FillSVG, 3000);
	}

	function MoveDot(dot, pos) {
		if (pos === null) {
			//Float around randomly
			TweenMax.to(dot, (3 + Math.round(Math.random() * 100) / 100), {
				x: rnd(0, STAGE_WIDTH),
				y: rnd(0, STAGE_HEIGHT),
				alpha: 0.3,
				ease: Cubic.easeInOut,
				onComplete: function() {
					MoveDot(dot, null);
				}
			});
		} else {
			//Move to specific position
			TweenMax.to(dot, (1.5 + Math.round(Math.random() * 100) / 100), {
				x: pos.x,
				y: pos.y,
				delay: 0,
				alpha: 1,
				ease: Cubic.easeInOut,
				onComplete: function() {}
			});
		}
	}

	return {
		Init: Init
	}
})();

dots.Init();

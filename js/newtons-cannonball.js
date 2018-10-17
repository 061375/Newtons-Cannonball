/** 
 * Newton's Cannon
 * https://en.wikipedia.org/wiki/Newton%27s_cannonball
 * @author Jeremy Heminger <contact@jeremyheminger.com>
 * @website http://jeremyheminger.com
 * 
 * @version 1.0.4
 * @date October 2018
 *
 * Credit: Vector class from here: https://codepen.io/akm2/pen/rHIsa
 *
 *
 * */
const 	G = 6.674e-11,
		WW = window.innerWidth,
		HH = window.innerHeight;

// initialize variables
var canvas, ctx, _cannon, _cannonball, _planet, _objects, c_speed = 0.1 , cspeed = 0.8, isrunnning = true, W, H, hW, hH;

// initalize listeners
window.addEventListener('load', init, false);
window.addEventListener('blur', stopLoop, false);
window.addEventListener('focus', startLoop, false);
window.addEventListener('resize', resizeHandler, false);

/** 
 * initalize
 * @function init
 * */
function init() {

	W = document.getElementById('container').clientWidth;
	H = document.getElementById('container').clientHeight;
	hW = (W/2);
	hH = (H/2);
	PLANETRADIUS = (H/3);

	// set a constant based on the initial speed of the cannon ball
	//c_speed = cspeed;

	// create the canvas
	canvas = document.createElement('canvas');
	ctx = canvas.getContext('2d');

	// instantiate our classes
	_planet = new Planet(hW,hH,PLANETRADIUS,-90);

	_cannon = new Cannon(_planet.get().x,_planet.get().y,PLANETRADIUS,-90);

	_cannonball = new Cannonball(_cannon.get().x,_cannon.get().cannon.breach.y);

	// add the objects in the order want them drawn
	// from back to front
	_objects = [
		_cannonball,
		_planet,
		_cannon
	];

	// add the canvas
	document.getElementById('container').appendChild(canvas);

	makeStars(50);

	// handle a resize
	this.resizeHandler();

	// start rendering
	this.render();
}
/** 
 * make some stars
 * @method makeStars
 * @param {Number}
 * */
function makeStars(n) {

	for(let i=0; i<n; i++) {
		let s = document.createElement('div');	
			s.setAttribute('class','star');
			s.style.left = (Math.random() * WW)+'px';
			s.style.top = (Math.random() * HH)+'px';
		document.getElementById('stars').appendChild(s);
	}
}
/** 
 * just like the name implies
 * @method stopLoop
 * */
function stopLoop() {
	isrunnning = false;
	console.log('stop loop');
}
/** 
 * just like the name implies
 * @method startLoop
 * */
function startLoop() {
	isrunnning = true;
}
/** 
 * set the size of the canvas
 * @note currently this really only works once
 * @function resizeHandler
 * */
function resizeHandler() {
	canvas.height = H;
	canvas.width = W;
}
/** 
 * clear the canvas
 * @function clear
 * */
function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
/** 
 * render the visible stuff
 * @method render
 * */
function render() {

	requestAnimationFrame(render);

	// if true then render 
	if(isrunnning) {
		// clear
		this.clear();
		// save
		ctx.save();
		// loop everything
		for(let i=0; i<_objects.length; i++) {
			_objects[i].loop();
			_objects[i].draw();
		}
		// restore
		ctx.restore();
	}
}
/** 
 * 
 * @function trig
 * @param {Number}
 * @param {Number}
 * @param {Number}
 * @param {Number}
 * @param {Boolean}
 * @returns {Mixed} 
 * */
function trig(x,y,r,d,array) {

	if(d<0)d+=360;
	if(d>360)d-=360;

	let a = d * Math.PI / 180;
	let xpos = r * Math.cos(a);
	let ypos = r * Math.sin(a);

    if(array) {
    	return [
    		xpos+x,
    		ypos+y
    	]
    }else{
    	return {
    		x:xpos+x,
    		y:ypos+y
    	}
    }
}
/** 
 * 
 * @function distance
 * @param {Number}
 * @param {Number}
 * @param {Number}
 * @param {Number}
 * @returns {Number}
 * */
function distance(x1,y1,x2,y2) {
	return Math.hypot(x2-x1, y2-y1);
}
/** 
 * 
 * @class
 * */
class Planet {
	/** 
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * */
	constructor(x,y,r,d) {

		this.vars = {
			x:x,
			y:y,
			r:r,
			d:d,
			mass:12e+12,
			color:'#008000'
		}
	}
	/** 
	 * no need for a loop here but its called automatically
	 * @method loop
	 * */
	loop() {}
	/** 
	 * @method draw
	 * */
	draw() {
		ctx.beginPath();
		var grd=ctx.createRadialGradient(75,50,300,90,60,800);
			grd.addColorStop(0,this.vars.color);
			grd.addColorStop(1,'#000');
		ctx.fillStyle=grd;       
		ctx.arc(this.vars.x,this.vars.y,this.vars.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}
	/** 
	 * @method get
	 * @returns {Object}
	 * */
	get() {
		return this.vars;
	}

}
/** 
 * @class Canon
 * */
class Cannon {
	/** 
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * @param {Number}
	 * */
	constructor(x,y,r,d) {

		// @var {Number} An amount to resize objects in relation to the planet size
		this.divsize = 25;
		// @var {Number}
		this.r = r;
		// @var {Number}
		this.d = d;
		// @var {Object}
		this.pos = trig(x,y,r,d,false);
		// @var {Object}
		this.vars = {
			x:this.pos.x,
			y:this.pos.y,
			mountain:{
				coords:[],
				color:'#008000'
			},
			cannon:{
				barrel:{
					x:0,
					y:0,
					w:0,
					h:0
				},
				breach:{
					x:0,
					y:0,
					r:0
				},
				x:0,
				y:0,
				r:0,
				color:'#000000'
			}
		}

		this.mountain();
		this.makecannon();

	}
	/** 
	 * no need for a loop here but its called automatically
	 * @method loop
	 * */
	loop() {}
	/** 
	 * @method draw
	 * */
	draw() {
		ctx.fillStyle=this.vars.cannon.color;

		// cannon wheel
		ctx.beginPath();
		ctx.arc(this.vars.cannon.x,this.vars.cannon.y,this.vars.cannon.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();

		// cannon breach
		ctx.beginPath();
		ctx.arc(this.vars.cannon.breach.x,this.vars.cannon.breach.y,this.vars.cannon.breach.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();

		// cannon barrel
		ctx.beginPath();
		ctx.fillRect(
			this.vars.cannon.barrel.x,
			this.vars.cannon.barrel.y,
			this.vars.cannon.barrel.w,
			this.vars.cannon.barrel.h
		);

		// mountain
		ctx.fillStyle=this.vars.mountain.color;
		ctx.beginPath();
		ctx.moveTo(this.vars.mountain.coords[0][0],this.vars.mountain.coords[0][1]);
		for (let i = 0;i<this.vars.mountain.coords.length; i++) {
			ctx.lineTo(
				this.vars.mountain.coords[i][0],
				this.vars.mountain.coords[i][1]
			);
		}
		ctx.fill();

	}
	/** 
	 * establish the mountains polygon
	 * @method mountain
	 * */
	mountain() {
		// create the polygon coords for the mountain
		this.vars.mountain.coords[0] = trig(this.pos.x,this.pos.y+5,(this.r/(this.divsize/2)),(this.d-90),true);
		this.vars.mountain.coords[1] = trig(this.pos.x,this.pos.y,(this.r/(this.divsize/5)),this.d-10,true);
		this.vars.mountain.coords[2] = trig(this.pos.x,this.pos.y,(this.r/(this.divsize/5)),this.d+10,true);
		this.vars.mountain.coords[3] = trig(this.pos.x,this.pos.y+5,(this.r/(this.divsize/2)),(this.d+90),true);
	}
	/** 
	 * @method makecanon
	 * */
	makecannon() {
		// cannon wheel
		let xy = trig(this.pos.x,this.pos.y,(this.r/(this.divsize/6)),this.d,false);
		this.vars.cannon.x = xy.x;
		this.vars.cannon.y = xy.y+5;
		this.vars.cannon.r = (this.r/this.divsize)-5;

		// breach
		xy = trig(this.vars.cannon.x,this.vars.cannon.y,this.vars.cannon.r,-120);
		this.vars.cannon.breach.x = xy.x;
		this.vars.cannon.breach.y = xy.y;
		this.vars.cannon.breach.r = this.vars.cannon.r/2;

		this.vars.cannon.barrel.x = xy.x;
		this.vars.cannon.barrel.y = xy.y-3;
		this.vars.cannon.barrel.w = this.vars.cannon.r*3;
		this.vars.cannon.barrel.h = this.vars.cannon.r;
	}
	/** 
	 * @method get
	 * @returns {Object}
	 * */
	get() {
		return this.vars;
	}
}
/** 
 * @method Canonball
 * */
class Cannonball {

	constructor(x,y) {
		//
		Vector.call(this, x, y);
		// @var {Number}
		this.startx = x;
		// @var {Number}
		this.starty = y;
		// @var {Number}
		this.deadtimer = 0; // this counts until the reset
		// @var {Number}
		this.resettimer = 1; // raise this to set a pause beween resets
		// @var {Object}
		this.vars = {
			x:x,
			y:y,
			r:3,
			dead:false,
			speed: new Vector(cspeed,0),
			dir:0,
			mass:2e+2,
			planet:{},
			color:'#fff'
		};
	}
	/** 
	 * 
	 * @method loop
	 * */
	loop() {

		//
		this.getplanet();

		// 
		if(this.collision())
			this.destroy();

		//
		if(this.vars.dead) {
			// move the cannonball off the stage
			this.vars.x = 1000000;
			// increment the timer
			this.deadtimer++;
			// if timer greater than reset
			if(this.deadtimer > this.resettimer)
				this.reset();
		}else{

			// THIS IS WHERE THE MAGIC HAPPENS
			// The math that is
			// @todo - reduce the code here
			//		   some of this can be combined

			// init empty vector
			let a = new Vector(0,0);


			this.vars.planet.rv.x -= this.vars.x;
			this.vars.planet.rv.y -= this.vars.y;

			// I was using V.length() however it isn't updated by the class
			// the maths to do so is easy enough so I just called thew standard method
			let d = this.vars.planet.distance;

			let n = this.vars.planet.rv.normalize();

			// stuck in the gravity well
			if ( d < 20 ) { 
			  n.x *= Math.pow(d/20,5);
			  n.y *= Math.pow(d/20,5);
			}

			let m = _planet.get().mass;
			 	m = m + this.vars.mass;

			a.x += n.x*(G*m)/(d*d);
			a.y += n.y*(G*m)/(d*d);

			this.vars.speed.x += a.x;
			this.vars.speed.y += a.y;

			this.vars.x+=this.vars.speed.x;
			this.vars.y+=this.vars.speed.y;
		}
	}
	/** 
	 * @method draw
	 * */
	draw() {
		ctx.fillStyle=this.vars.color;
		ctx.beginPath();
		ctx.arc(this.vars.x,this.vars.y,this.vars.r,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
	}
	/** 
	 * @method
	 * */
	addSpeed(d) {
		this.vars.speed.add(d);
	}
	/** 
	 * comment
	 * @method getplanet
	 * */
	getplanet() {
		this.vars.planet.rv = new Vector(_planet.get().x, _planet.get().y);
		this.vars.planet.r = _planet.get().r;

		// get the distance to the planet
		
		this.vars.planet.distance = distance(
			this.vars.x,
			this.vars.y,
			this.vars.planet.rv.x,
			this.vars.planet.rv.y
		);
	}
	/** 
	 * 
	 * @method collision
	 * */
	collision() {
		// check the distance to the planet
		if(this.vars.planet.distance < this.vars.planet.r)
		{
			return true;
		}else{
			return false;
		}
	}
	/** 
	 * 
	 * @method destroy
	 * */
	destroy() {
		this.vars.dead = true;
	}
	/** 
	 * 
	 * @method reset
	 * */
	reset() {
		this.deadtimer = 0;

		// place it back home
		this.vars.x = this.startx;
		this.vars.y = this.starty;
		// reset var
		this.vars.dead = false;
		// increment speed
		cspeed += c_speed;
		this.vars.speed = new Vector(cspeed,0);
	}
	/** 
	 * 
	 * @method get
	 * @returns {Object}
	 * */
	get() {
		return {
			x:this.vars.x,
			y:this.vars.y
		}
	}
}

/** 
 * @NOTE - I always thought that in the abstract Vectors and Tensors were essentially Objects
 * 		   This class proves my observation		   
 **/

/**
 * Vector
 */
function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
}

Vector.add = function(a, b) {
    return new Vector(a.x + b.x, a.y + b.y);
};

Vector.sub = function(a, b) {
    return new Vector(a.x - b.x, a.y - b.y);
};

Vector.scale = function(v, s) {
    return v.clone().scale(s);
};

Vector.random = function() {
    return new Vector(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
    );
};

/** 
 * comment
 * @method
 * */
Vector.prototype = {
    set: function(x, y) {
        if (typeof x === 'object') {
            y = x.y;
            x = x.x;
        }
        this.x = x || 0;
        this.y = y || 0;
        return this;
    },

    add: function(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    },

    sub: function(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },

    scale: function(s) {
        this.x *= s;
        this.y *= s;
        return this;
    },

    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    lengthSq: function() {
        return this.x * this.x + this.y * this.y;
    },

    normalize: function() {
        var m = Math.sqrt(this.x * this.x + this.y * this.y);
        if (m) {
            this.x /= m;
            this.y /= m;
        }
        return this;
    },

    angle: function() {
        return Math.atan2(this.y, this.x);
    },

    angleTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.atan2(dy, dx);
    },

    distanceTo: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceToSq: function(v) {
        var dx = v.x - this.x,
            dy = v.y - this.y;
        return dx * dx + dy * dy;
    },

    lerp: function(v, t) {
        this.x += (v.x - this.x) * t;
        this.y += (v.y - this.y) * t;
        return this;
    },

    clone: function() {
        return new Vector(this.x, this.y);
    },

    toString: function() {
        return '(x:' + this.x + ', y:' + this.y + ')';
    }
};
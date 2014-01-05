'use-strict';

Quintus.SpaceInvadersModels = function(Q) {
  Q.gravityY = 0;
  Q.gravityX = 0;
  // define the sprite masks
  var SPRITE_FRIENDLY = 1,
      SPRITE_ENEMY = 2,
      SPRITE_NEUTRAL = 4,
      SPRITE_NONE = 8;
  
  /**
  * Das Logo
  */
  Q.Sprite.extend("Logo",{
    init: function(p) {
      this._super({
        y: 200,
        x: Q.width/2,
        asset: "logo.png"
      });

    }
  });

  /**
   * Image
   */
  Q.Sprite.extend("ColourfullInvaders",{
	    init: function(p) {
	      this._super({
	        y: 470,
	        x: Q.width/2,
	        asset: "colourfullInvaders.png"
	      });

	    }
	  });
  
  
/**
* Der Kanonenschuss
*/
Q.Sprite.extend("CannonShot",{
    init: function(p) {
        this._super(p,{
           asset: 'shoot.png', // image
            w: 11,
            h: 10,
            sprite: 'shot',
            type: SPRITE_FRIENDLY,
            collisionMask: SPRITE_ENEMY | SPRITE_NEUTRAL
        });
        this.on('hit.sprite', this, 'collide');
    },

    step: function(dt){
        this.p.y = this.p.y-6;
        //Wenn es ausserhalb des Bereiches erreicht, sollte es entfernt werden
        if(this.p.y < 0) this.destroy();
        this.stage.collide(this);
    },

    collide: function(col) {
        if(col.obj.isA("ShieldElement")) {
            col.obj.destroy(); // destroy the element
            this.destroy(); // destroy the shot
        } else if(col.obj.isA("Alien")) {
            col.obj.trigger('hit');
            this.destroy();
        }else if(col.obj.isA("AlienShot")) {
                this.off("collide");
                var decide = Math.random();
                if(decide<0.5){
                this.destroy();
                }else{
                col.obj.trigger('destroy');
                    this.on("collide");
                }
        }
    }
});


/**
* The Cannon class which is at the bottom of the page.
*/
Q.Sprite.extend("Cannon", {
    init: function(p){
        var self = this;
        this._super(p, {
            asset: 'cannon.png', // image
            w: 110, // width
            h: 68, // height
            y: 680, // position
            x: 512,
            sprite: 'cannon',
            scale: 0.8,
            stepDistance: 50, // moving speed
            cannonReady: true,
            cadence: 680, // in ms
            hittable: false,
            type: SPRITE_FRIENDLY,
            collisionMask: SPRITE_ENEMY // will be changed. Prevent hit on insert
        });
        this.add('GunControls, gunControls');
        this.add('animation');
        this.on('hit');
        this.on('kill');
        Q.input.on('fire', this, "fireGun");
        // Die Kanone soll die ersten 2 Sekunden unverletzbar sein.
        setTimeout(function(){
            self.p.hittable = true;
        },2000);
    },

    fireGun: function(){
        if(this.p.cannonReady){
            var p = this.p;
            p.cannonReady = false;
            
            setTimeout(function(){
                p.cannonReady = true;
            }, p.cadence);
            
            var cannonShot = new Q.CannonShot({x: this.p.x, y: this.p.y-40 });
            this.stage.insert(cannonShot);
            Q.audio.play("fire2.mp3");
        }
    },
    
    hit: function(){
        var self = this;
        if(this.p.hittable){
            this.off('hit');
            this.p.sheet = "explosion1";
            this.p.scale = 1.5;
            this.p.y = this.p.y - 50;
            this.play('explode', 1);
            
            Q.audio.play("explosion.mp3");
            Q.state.dec("lives",1);

            if(Q.state.get('lives') <= 0) {
                setTimeout(function(){
                    Q.stageScene("gameOver");
                }, 1000);
            } else {
                setTimeout(function(){
                    self.stage.insert(new Q.Cannon());
                }, 1000);
            }
        }
    },
    
    kill: function(){
        this.destroy();
    }

});

Q.Sprite.extend("CannonLiveTracker", {
    init: function(p){
        this._super({
            x: 20,
            y: Q.height - 20,
            w: 1,
            h: 1,
            type: SPRITE_NONE,
            xPos: 60
        }, p);

        this.on("inserted", this, "setup");
        Q.state.on("change.lives", this, "renderIcons");
    },

    removeIcon : function(id) {
    	console.log("this.children[id] " +this.children[id]);
    	this.children[id].destroy();
        this.p.xPos =  this.p.xPos- 60;

		setTimeout(function(){

	    	console.log("-removeIcon--");
	    	console.log("Q.state.get('lives') " +Q.state.get('lives'));
	    	console.log("this.children.length "+this.children.length);
	    	console.log("---");}, 40000);
    },
    
    addIcon : function() {
	        var self = this;

	        self.stage.insert(new Q.CannonLive({
	            x: this.p.xPos
	        }), this);
	        this.p.xPos =  this.p.xPos+ 60;
    },
    
    setup: function() {
    	//TODO Q.state.get('lives') ist nach removeIcon immer kleiner als this.children.length -> endlosschleife
    	while(Q.state.get('lives')!=this.children.length){
        	if(Q.state.get('lives')<this.children.length){
        		this.removeIcon(this.children.length);
        	}else{
        		this.addIcon();
        	}
		}
    	
    	console.log("-setup--");
    	console.log("Q.state.get('lives') " +Q.state.get('lives'));
    	console.log("this.children.length "+this.children.length);
    	console.log("---");

    },

    
    renderIcons: function() {

//    	while(Q.state.get('lives')!=this.children.length){
        	if(Q.state.get('lives')<this.children.length){
        		this.removeIcon(this.children.length-1);
        	}else{
        		this.addIcon();
        	}
//		}

    	console.log("-renderIcons--");
    	console.log("Q.state.get('lives') " +Q.state.get('lives'));
    	console.log("this.children.length "+this.children.length);

    	console.log("---");
    }

});


Q.Sprite.extend("CannonLive", {
    init: function(p){
    	  this._super(p, {
            asset: 'cannon.png', // image
            w: 110, // width
            h: 68, // height
            y: 0,
            scale: 0.4
          });
    }
    
});


Q.UI.Container.extend("AlienTracker", {
    init: function(p) {
        this._super({
            w: 1,
            h: 1,
            x: 100,
            y: 60,
            direction: 'right',
            data: Q.assets[p.assetMap],
            step: 0, // step counter (ca 50-60 steps/s)
            move: 40 - (p.level*4) // alle 40 steps ein Move.
        }, p);
        this.on('move');
        this.on('resize', this, 'setSize');
        this.on("inserted", this, "setupAlien");

        this.beep = function() { // closure pattern
            var i = 0; // closure
            return function() {
                var sample = i % 4 + 1; // 0-4
                Q.audio.play('fastinvader' + sample + '.mp3');
                i++;
            };
        }();

    },
    step: function(dt) {
        if (this.p.step < this.p.move) {
            this.p.step++;
        } else {
            this.trigger('move');
            this.p.step = 0;
        }

    },
    move: function() {
        this.beep();
        if ((this.p.x + this.p.w - this.p.cx) >= Q.width-10  && this.p.direction === 'right') {
            this.moveDown();
        } else if (this.p.x - this.p.cx <=10 && this.p.direction === 'left') {
            this.moveDown();
        } else {
            this.p.x = this.p.x + this.direction(this.p.direction);
        }
        console.log(this.p.x);

        // start collision test with shields
        if(this.p.y > 240){
            Q._each(this.children, function(alien){
                alien.stage.collide(alien);
            });
        }

        if (this.children.length == 0) {
            this.stage.trigger('complete');
        }
    },
    moveDown: function(){
        this.p.y = this.p.y + 16;
        if ( this.p.y + this.p.h >= Q.height - 40) {
            Q.stageScene('gameOver');
        }
        // switch direction
        this.p.direction = this.p.direction === 'right' ? 'left': 'right';
        if(this.p.move > 10) {
            this.p.move -= 3;
        }
    },

    direction: function(richtung) {

        if (richtung === 'left') {
            return -20;
        } else {
            return 20;
        }
    },

    setupAlien: function() {
        var alienScore = [0, 40, 20, 10];
        Q.assets.invaders = {}; // Store a reference to the aliens
        Q._each(this.p.data, function(row, y) {
            Q._each(row, function(type, x) {
                if (type > 0) {
                    Q.assets.invaders[x] = Q.assets.invaders[x] || []; // Create a stack per column
                    Q.assets.invaders[x].push(
                        this.stage.insert(new Q.Alien({
                            sheet: "alien" + type,
                            score: alienScore[type],
                            column: x,
                            parent: this,
                            x: 60 * x,
                            y: 60 * y
                        }), this)
                    );
                }
            }, this);
        }, this);
        this.fit(10,10);
    },

    setSize: function() {
        console.log('resizing...');
        this.fit(10,10);
        console.log([this.p.w, this.p.cx, this.p.x]);
    },
    render: function(ctx){
        Q._invoke(this.children,"render",ctx);
    }

});

    Q.Sprite.extend("Alien", {
        init: function(p) {
            this._super(p, {
                type: SPRITE_ENEMY,
                collisionMask: SPRITE_FRIENDLY | SPRITE_NEUTRAL,
                scale: 0.5,
                hidden: false,
                sprite: "alien"
            });
            this.on('fire', this, "fireGun");
            this.on('hit.sprite', this, 'collide');
            this.add('animation');
            this.play('hampelmann');
        },

        fireGun: function() {
            var alienshot = new Q.AlienShot({
                x: this.p.x + this.p.parent.p.x,
                y: this.p.y + this.p.parent.p.y + this.p.cy
            });
            this.stage.insert(alienshot);
        },
        
        collide: function(col){
            var parent = this.p.parent;
            if (col.obj.isA("ShieldElement")) {
                col.obj.trigger('hit'); // destroy the element
            } else {
                this.off('hit'); // event is fired multiple times
                Q.assets.invaders[this.p.column].pop();
                Q.audio.play('fire1.mp3');
                Q.state.inc('score', this.p.score);
                setTimeout(function(){
                    parent.trigger('resize');
                }, 40);
                this.destroy();
            }
        }
    });

    Q.Sprite.extend("AlienShot", {
        init: function(p) {
            this._super(p,{
               asset: 'alienShot.png', // image
                w: 11,
                h: 10,
                sprite: 'shot',
                type: SPRITE_ENEMY,
                collisionMask: SPRITE_FRIENDLY | SPRITE_NEUTRAL
            });
            this.on('hit.sprite', this, 'collide');
            this.on('destroy', this, 'destroy');
        },

        step: function(dt){
            
            this.p.y = this.p.y+6;
            if(this.p.y > 700) this.destroy();
            this.stage.collide(this);
        },

        collide: function(col) {
            if (col.obj.isA("ShieldElement") || col.obj.isA("Cannon")) {
                col.obj.trigger('hit', 'AlienShot'); // destroy the element
                this.destroy(); // destroy the shot
            }
        }
    });


    Q.Sprite.extend("ShieldElement", {
        init: function(p) {
            this._super({
                sheet: 'shield',
                sprite: 'shieldElement',
                w: 10,
                h: 10,
                strength: 1,
                type: SPRITE_NEUTRAL,
                collisionMask: SPRITE_ENEMY | SPRITE_FRIENDLY
            }, p);
            this.on('hit');
        },
        hit: function(evt) {
            this.off('hit');
            // Bei einem Alientreffer das Schild erst beschädigen, dann zerstören.
            if (this.p.strength && evt === 'AlienShot'){
                this.p.sheet = 'shield-hit';
                this.p.strength -= 1;
                var self = this;
                setTimeout(function(){
                    self.on('hit', self, 'hit');
                }, 100);
            } else {
                this.destroy();
            }
        }


    });

    Q.Sprite.extend("Shield", {
        init: function(p) {
            this._super(p, {
                x: 100,
                y: 100,
                w: 120,
                h: 70,
                type: SPRITE_NONE,
                data: Q.assets['shield']
            });
            this.on("inserted", this, "setupShield");
        },
        setupShield: function() {
            Q._each(this.p.data, function(row, y) {
                Q._each(row, function(block, x) {
                    if (block < 5) {
                        this.stage.insert(new Q.ShieldElement({
                            frame: block,
                            x: 10 * x + this.p.x,
                            y: 10 * y + this.p.y
                        }), this);
                    }
                }, this);
            }, this);
        }
    });

    Q.Sprite.extend("UFO", {
        init: function(p) {
            this._super(p, {
                type: SPRITE_ENEMY,
                sprite: "UFO",
                sheet: 'ufo'
            });
            this.on('inserted'); // ruft this.insterted() auf.

            this.on('hit');
        },


        inserted: function() {
                   Q.audio.play('ufo.lowpitch.mp3');
        },
        hit: function() {
                   Q.audio.play('ufo_shot.mp3');
            this.destroy();
            // TODO: add points
        }
    });


    /**
* Add the score Class and UI components
*/
    Q.UI.Text.extend("Score", {
        init: function(p) {
            this._super({
            	family: "'Press Start 2P'",
                label: "SCORE: 0",
                align: "right",
                color: 'white',
                size: 20,
                x: Q.width - 150,
                y: 20,
                nextLife: 10
            });

            Q.state.on("change.score", this, "score");
        },

        score: function(score) {
            this.p.label = "SCORE: " + score;
            if (score >= this.p.nextLife) {
                this.p.nextLife += this.p.nextLife;
                Q.state.inc('lives', 1);
            }
        }
    });

    Q.UI.Text.extend("Level", {
        init: function() {
            this._super({
            	family: "'Press Start 2P'",
                label: "LEVEL: 1",
                align: "right",
                color: 'white',
                level: 1,
                size: 20,
                x: Q.width - 100,
                y: Q.height - 20,
                weight: "normal"
            });

            Q.state.on("change.level", this, "level");
        },

        level: function(lvl) {
            this.p.label = "LEVEL: " + lvl;
        }
    });


    Q.UI.Button.extend("Startbutton", {
        init: function() {
            this._super({
    			x : Q.width / 2,
    			y : 720,
    			h : 75,
    			w : 320,
    			border : 7,
                size: 40,
                color: 'red',
                font: '400 24px "Press Start 2P"',
    			fill : "#ffe744",
    			label : "INSERT COIN"
            });

            this.on('click');
        },
        
        click: function(){
			Q.clearStages();
			Q.stageScene('level1');
            isPaused = 1;
       }
    });
    
}

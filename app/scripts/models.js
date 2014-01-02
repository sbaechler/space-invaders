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

            this.destroy();
            var lives = Q.state.get('lives');

            if(lives <= 0) {
                Q.stageScene("gameOver");
            } else {

                Q.state.inc('cannonLive', lives);
            	
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
            type: SPRITE_NONE
        }, p);

        this.on("inserted", this, "setupCannonLives");
        Q.state.on("change.lives", this, "cannonLive");
    },

    cannonLive: function(id) {
    	this.children[Q.state.get('lives')].destroy();
    },
    
    setupCannonLives: function() {
        Q.assets.lives =[]; // Store a reference to the aliens

        var pos = [60, 120, 180];
        var self = this;
        Q._each(pos, function(pos, id) {
        	 Q.assets.lives.push(
                self.stage.insert(new Q.CannonLive({
                    x: pos
                }), self)
             )
        }, this);
    }

});


Q.Sprite.extend("CannonLive", {
    init: function(p){
    	  this._super(p, {
            asset: 'cannonlive.png', // image
            w: 110, // width
            h: 68, // height
            y: 0
          });
    }
    
});


Q.Sprite.extend("AlienTracker", {
    init: function(p) {
        this._super({
            sprite: 'alienTracker',
            w: 1,
            h: 1,
            x: 100,
            y: p.y + 40,
            direction: 'right',
            data: Q.assets['level1'],
            type: SPRITE_NONE,
            cadence: 80,
            step: 0, // step counter (ca 50-60 steps/s)
            move: 50 // alle 50 steps ein Move.
        }, p);
        this.on('hit');
        this.on('move');
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
    hit: function() {
        this.destroy();
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
        var ystep = false;
        // this.beep(); // NOT YET.
        if (Q.width - this.p.w > this.p.x + 100 && this.p.x < 100 && this.p.x < 320 && this.p.direction == 'left') {
            this.p.y = this.p.y + 10;
            ystep = true;
            this.p.direction = 'right';

            // this.p.x = this.p.x + this.direction('right');
        } else if (Q.width - this.p.w < this.p.x + 100 && this.p.x > 100 && this.p.direction == 'right') {
            this.p.y = this.p.y + 10;
            ystep = true;
            this.p.direction = 'left';
        }

        if (ystep == false) {
            this.p.x = this.p.x + this.direction(this.p.direction);
        }
        ystep = false;

        if(this.p.y > 240){
            Q._each(this.children, function(alien){
                alien.stage.collide(alien);
            });
        }
        this.getWidth();
        //max rechts = 340
        //min links = 100

        //1024-600>340
    },

    direction: function(richtung) {

        if (richtung == 'left') {
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
                            parent: this.p,
                            x: 60 * x,
                            y: 60 * y
                            /*x: 55 * x + this.p.x,
								y: 80 * y + this.p.y*/
                        }), this)
                    );
                }
            }, this);
        }, this);
        this.getWidth();
    },

    getWidth: function() {
        var maxx_pos = 0;
        var minx_pos = 500;
        Q._each(this.children, function(alien, i) {

            if (alien.p.x > maxx_pos) {
                maxx_pos = alien.p.x;
            };
            if (alien.p.x < minx_pos) {
                minx_pos = alien.p.x;
            };


            // var breite =
            //console.log(alien);
        });
        this.p.w = maxx_pos - minx_pos;
        this.p.h = 100;

        // Q.width

    }

});

    Q.Sprite.extend("Alien", {
        init: function(p) {
            this._super(p, {
                type: SPRITE_ENEMY,
                collisionMask: SPRITE_FRIENDLY | SPRITE_NEUTRAL,
                scale: 0.5,
                sprite: "alien"
            });
            this.on('fire', this, "fireGun");
            this.on('hit.sprite', this, 'collide');
            this.add('animation');
            this.play('hampelmann');
        },

        fireGun: function() {
            var alienshot = new Q.AlienShot({
                x: this.p.x + this.p.parent.x,
                y: this.p.y + this.p.parent.y + this.p.cy
            });
            this.stage.insert(alienshot);
        },
        
        collide: function(col){
            if (col.obj.isA("ShieldElement")) {
                col.obj.trigger('hit'); // destroy the element
            } else {
                this.off('hit'); // event is fired multiple times
                Q.assets.invaders[this.p.column].pop();
                Q.audio.play('fire1.mp3');
                Q.state.inc('score', this.p.score);
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
            	family: "Courier New",
                label: "score: 0",
                align: "right",
                color: 'white',
                x: Q.width - 100,
                y: 20,
                nextLife: 1500
            });

            Q.state.on("change.score", this, "score");
        },

        score: function(score) {
            this.p.label = "score: " + score;
            if (score >= this.p.nextLife) {
                this.p.nextLife += this.p.nextLife;
                Q.state.inc('lives', 1);
            }
        }
    });

    Q.UI.Text.extend("Level", {
        init: function() {
            this._super({
            	family: "Courier New",
                label: "level: 1",
                align: "right",
                color: 'white',
                level: 1,
                x: Q.width - 70,
                y: Q.height - 10,
                weight: "normal",
            });

            Q.state.on("change.level", this, "level");
        },

        level: function(lvl) {
            this.p.label = "level: " + lvl;
        }
    });


    Q.UI.Button.extend("Startbutton", {
        init: function() {
            this._super({
    			x : Q.width / 2,
    			y : 720,
    			h : 75,
    			w : 250,
    			border : 7,
    			fill : "#ffe744",
    			label : "Play Game"
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

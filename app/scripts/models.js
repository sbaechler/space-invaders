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
* Add the score Class
*/
//Q.UI.Text.extend("Score",{
// init: function(p){
// this._super({
// label: "score: 0",
// x: 0,
// y: 0
// });
//
// Q.state.on("change.score",this,"score");
// },
//
// score: function(score) {
// this.p.label = "score: " + score;
// }
//});

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
        this.p.y = this.p.y-2;
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
        }
    }
});


/**
* The Cannon class which is at the bottom of the page.
*/
Q.Sprite.extend("Cannon", {
    init: function(p){
        this._super(p, {
            asset: 'cannon.png', // image
            w: 110, // width
            h: 68, // height
            y: 680, // position
            x: 512,
            sprite: 'cannon',
            stepDistance: 50, // moving speed
            type: SPRITE_FRIENDLY,
            collisionMask: SPRITE_ENEMY
        });
        this.add('GunControls, gunControls');
        Q.input.on('fire', this, "fireGun");

// this.on("hit.sprite",function(collision) {
// if(collision.obj.isA("AlienShot")) {
// Q.stageScene("CannonHit", 1);
// this.destroy();
// }
// });

    },

    fireGun: function(){
        var cannonShot = new Q.CannonShot({x: this.p.x, y: this.p.y-40 });
        this.stage.insert(cannonShot);
        Q.audio.play("fire2.mp3");
    }
});

    Q.Sprite.extend("AlienTracker", {
        init: function(p){
            this._super({
                sprite: 'alienTracker',
                w: 2, //habe das mal so klein gemacht, da wenn man links vorbeischoss, das ganze verschwunden war....
                h: 100,
                x: 120,
                y: p.y + 40,
                data: Q.assets['level1'],
                type: SPRITE_NONE
            }, p);
            this.on('hit');
            this.on("inserted", this, "setupAlien");
        },
        hit: function(){
            this.destroy();
        },
       step: function(dt){
           // this.p.y = this.p.y+1;
           if(this.p.y < 0) this.destroy();
           if(this.p.y>600) this.destroy();
        },
        setupAlien: function(){
            Q.assets.invaders = {};  // Store a reference to the aliens
            Q._each(this.p.data, function(row,y) {
                Q._each(row, function(type, x) {
                    if(type > 0) {
                        Q.assets.invaders[x] = Q.assets.invaders[x]  || []; // Create a stack per column
                        Q.assets.invaders[x].push(
                            this.stage.insert(new Q.Alien({
                                sheet:"alien"+type,
                                column: x,
                                x: 100 * x + this.p.x,
                                y: 80 * y + this.p.y
                            }), this)
                        );
                    }
                }, this);
            }, this)
        }
    });

    Q.Sprite.extend("Alien", {
        init: function(p) {
            this._super(p, {
                type: SPRITE_ENEMY,
                collisionMask: SPRITE_FRIENDLY | SPRITE_NEUTRAL
            });

            this.add('GunControls, gunControls');
            this.on('fire', this, "fireGun");
            this.on('hit');
        },

        fireGun: function(){
                console.log("alienshoot");
            var alienshot = new Q.AlienShot({x: this.p.x+(this.p.w/2), y: this.p.y+80 });
            this.stage.insert(alienshot);
        },
        hit: function(){
            this.off('hit'); // event is fired multiple times
            Q.assets.invaders[this.p.column].pop();
            this.destroy();
        }
        
    });

    Q.Sprite.extend("AlienShot",{
        init: function(p) {
            this._super(p,{
               asset: 'shoot.png', // image
                w: 11,
                h: 10,
                sprite: 'shot',
                type: SPRITE_ENEMY,
                collisionMask: SPRITE_FRIENDLY | SPRITE_NEUTRAL
            });
            this.on('hit.sprite', this, 'collide');
        },

        step: function(dt){
                
            this.p.y = this.p.y+2;
            if(this.p.y > 700) this.destroy();
            this.stage.collide(this);
        },

        collide: function(col) {
            if(col.obj.isA("ShieldElement")|| col.obj.isA("Cannon")) {
                col.obj.destroy(); // destroy the element
                this.destroy(); // destroy the shot
            }
        }
    });


Q.Sprite.extend("ShieldElement", {
    init: function(p){
        this._super({
           sheet: 'shield',
           sprite: 'shieldElement',
           w: 10,
           h: 10,
           type: SPRITE_NEUTRAL,
           collisionMask: SPRITE_ENEMY | SPRITE_FRIENDLY
        }, p);
        this.on('hit');
    },
    hit: function(){
        this.destroy();
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
    setupShield: function(){
        Q._each(this.p.data, function(row,y) {
            Q._each(row, function(block, x) {
                if(block<5) {
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
}
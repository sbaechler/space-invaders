'use-strict';

Quintus.SpaceInvadersModels = function(Q) {
  Q.gravityY = 0;
  Q.gravityX = 0;

  // Blueprint for the shield element
  Q.assets['shield'] = [
    [0,1,1,1,1,1,1,1,1,1,1,4],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,2,5,5,5,5,5,5,3,1,1],
    [1,1,5,5,5,5,5,5,5,5,1,1]
    ];

/**
 * Add the score Class
 */




Q.UI.Text.extend("Score",{
    init: function(p){
    this._super({
      label: "score: 0",
      x: 0,
      y: 0
    });

    Q.state.on("change.score",this,"score");
    },

    score: function(score) {
    this.p.label = "score: " + score;
    }
});

Q.Sprite.extend("CannonShot",{
    init: function(p) {
        this._super(p,{
           asset: 'shoot.png',    // image
            w: 20,
            h: 20,
            sprite: 'shot',
            collisionMask: Q.SPRITE_DEFAULT
        });
        this.on('hit.sprite', this, 'collide');
    },

    step: function(dt){
        this.p.y = this.p.y-2;
        if(this.p.y < 0) this.destroy();
        this.stage.collide(this);
    },

    collide: function(col) {
        if(col.obj.isA("ShieldElement")) {
            col.obj.destroy();  // destroy the shield element
            this.destroy();  // destroy the shot
        }
    }

});


/**
 * The Cannon class which is at the bottom of the page.
 */
Q.Sprite.extend("Cannon", {
    init: function(p){
        this._super(p, {
            asset: 'cannon.png',    // image
            w: 110,                 // width
            h: 68,                  // height
            y: 680,                 // position
            x: 512,
            sprite: 'cannon',
            stepDistance: 50       // moving speed
        });
        this.add('GunControls, gunControls');
        Q.input.on('fire', this, "fireGun");

//        this.on("hit.sprite",function(collision) {
//            if(collision.obj.isA("AlienShot")) {
//                Q.stageScene("CannonHit", 1);
//                this.destroy();
//              }
//            });

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
                w: 400,
                h: 300,
                x: 10,
                y: 100,
                data: Q.assets['level1']
            }, p);
            this.on('hit');
            this.on("inserted", this, "setupAlien");
        },
        hit: function(){
            this.destroy();
        },
        setupAlien: function(){
            Q._each(this.p.data, function(row,y) {
                Q._each(row, function(type, x) {
                    if(type) {
                        this.stage.insert(new Q.Alien({
                            sheet:"alien"+type,
                            x: 100 * x + this.p.x,
                            y: 80 * y + this.p.y
                        }), this);
                    }
                }, this);
            }, this)
        }
    });

    Q.Sprite.extend("Alien", {
        init: function(p) {
            this._super(p, {
                w: 107,
                h: 88,
                collisionMask: Q.SPRITE_DEFAULT

            });


        }



    });





Q.Sprite.extend("ShieldElement", {
    init: function(p){
        this._super({
           sheet: 'shield',
           sprite: 'shieldElement',
            w: 10,
            h: 10
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
          collisionMask: Q.SPRITE_DEFAULT,
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



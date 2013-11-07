'use-strict';

Quintus.SpaceInvadersModels = function(Q) {
  Q.gravityY = 0;
  Q.gravityX = 0;
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
            type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY
        });

    },

    step: function(dt){
        this.p.y =this.p.y-2;
        if(this.p.y < 0) this.destroy();
    }

});


/**
 * The Cannon class which is at the bottom of the page.
 */
Q.Sprite.extend("Cannon", {
    init: function(p){
        this._super({
            asset: 'cannon.png',    // image
            w: 110,                 // width
            h: 68,                  // height
            collisionMask: Q.SPRITE_DEFAULT,// reacts to sprites mask
            y: 680,                 // position
            x: 512,
            stepDistance: 50       // moving speed
        }, p);
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
        console.log("firing...");
        var cannonShot = new Q.CannonShot({x: this.p.x, y: this.p.y-40 });
        this.stage.insert(cannonShot);


        Q.audio.play("fire2.mp3");
    }
});
Q.Sprite.extend("Alien", {
    init: function(p) {
      this._super({
        sheet: "alien" + p.num,
        sprite: "alien"
      },p);

      this.add("animation");
      this.play("appear");
      this.on("destroy"); // will just call destroy
    }
});

Q.Sprite.extend("AlienTracker",{
    init: function(p) {
      this._super(p, {
        x: Q.width/2,
        y: 64,
        scale: 0.1
      });

      this.add("tween");

      this.animate({ scale: 1 },1.5, Q.Easing.Quadratic.InOut);

      this.on("inserted", this, "setupAliens");
    },

    setupAliens: function() {
      Q._each(this.p.data,function(row,y) {
        Q._each(row,function(alien,x) {
          if(alien) {
            // Add onto the stage, with this as the
            // container
            this.stage.insert(new Q.Alien({
              num: alien,
              x: 32 * x - (row.length / 2 - 0.5) * 32,
              y: 16 * y
            }), this);
          }

        },this);
      },this);
    },

    step: function(dt) {
      if(this.children.length == 0) {
        this.stage.trigger("complete");
      }
    }
  });





}
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
}
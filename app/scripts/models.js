'use-strict';

Quintus.SpaceInvadersModels = function(Q) {

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

/**
 * The Cannon class which is at the bottom of the page.
 */

Q.Sprite.extend("Cannon", {
    init: function(p){
        this._super({
            asset: 'cannon.png',    // image
            w: 110,                 // width
            h: 68,                  // height
            type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY, // reacts to sprites mask
            y: 680,                 // position
            x: 512,
            stepDistance: 50,       // moving speed
            gravity: 0              // gravity factor
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
        Q.audio.play("fire2.mp3");
    }
});
}
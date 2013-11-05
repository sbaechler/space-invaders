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

Q.Sprite.extend("CannonShoot",{
    init: function(p) {
        this._super(p,{
           asset: 'shoot.png',    // image
           // color: "red",

            stepDistance: 50,       // moving speed
            w: 20,
            h: 20,
            y: 680,                 // position
            x: 512
        });

    },

    step: function(dt){
        this.p.y =this.p.y-2;
    }
/*
    Q.input.on('step', this, "runShoot");
    },

    runShoot: function() {
        this.p.y += this.p.vy +2;
    }*/
   /* draw: function(ctx) {
       //ctx.fillStyle = this.p.color;
        this.p.y = this.p.y-1;
        // Draw a filled rectangle centered at
        // 0,0 (i.e. from -w/2,-h2 to w/2, h/2)
        /*ctx.fillRect(-this.p.cx,
            -this.p.cy,
            this.p.w,
            this.p.h);
    }*/

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
            stepDistance: 50,       // moving speed
            gravity: 0              // gravity factor
        }, p);
        this.add('2d, stepControls');
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
        console.log(this);
        var xPos = this.p.origX;
        var cannonShoot = new Q.CannonShoot({x: xPos-50});
        Q.stage().insert(cannonShoot);


        Q.gameLoop(function(dt){
            cannonShoot.update(dt);
          Q.clear();
            cannonShoot.render(Q.ctx);
        });
        //cannonShoot.runShoot();
        //Q.stage().add("viewport").follow(cannonShoot ,{ x: false, y: true });

        /*Q.gameLoop(function(dt){
            //cannonShoot.clear();
            cannonShoot.update(dt);
            cannonShoot.render(Q.ctx);
        });*/

        Q.audio.play("fire2.mp3");
    }
});
}
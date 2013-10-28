'use strict';

window.onload = function(){
    var Q = Quintus()                          // Create a new engine instance
          .include("Sprites, Scenes, Input, 2D, Touch, UI") // Load any needed modules
          .setup("screen", {maximize: true})                           // Add a canvas element onto the page
          .controls()                        // Add in default controls (keyboard, buttons)
          .touch();                          // Add in touch support (for the UI)

    Q.UI.Text.extend("Score",{
        init: function(p) {
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

    Q.Sprite.extend("Cannon", {
        init: function(){
            console.log("Cannon created");
        },
        fireGun: function(){
            console.log("firing...");
        }
    });

    var cannon = new Q.Cannon();
    cannon.on('fire', "fireGun");


    Q.state.reset({ score: 0, lives: 3 });


}
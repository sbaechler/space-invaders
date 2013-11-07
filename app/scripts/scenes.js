'use strict';

Quintus.SpaceInvadersScenes = function(Q) {


    /**
     *  The first level.
     */
 /*   Q.scene("level1",function(stage) {
        var cannon = stage.insert(new Q.Cannon());
        var alien = stage.insert(new Q.Alien());

        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
            alien.destroy();
        });
    });

*/

    Q.scene("hud",function(stage) {
        stage.insert(new Q.Cannon());

        stage.insert(new Q.Level());
    }, { stage: 1 });

    function setupLevel(levelAsset,stage) {

       // if(Q.useTiles) {
            stage.collisionLayer(new Q.GameTiles());
    //  } else {
     //       stage.insert(new Q.Background());
      //  }

       // stage.insert(new Q.BlockTracker({ data: Q.asset(levelAsset) }));

       // stage.insert(new Q.Ball({ x: 50, y: 100 }));
        //stage.insert(new Q.Countdown());
    //    stage.insert(new Q.Paddle());

    }

    Q.scene("level1",function(stage) {
        // Set up the game state
        Q.state.reset({ score: 0, lives: 3, level: 1 });

        // Add the hud in
        Q.stageScene("hud");

        // Call the helper methods to get the
        // level all set up with blocks, a ball and a paddle
        setupLevel("level1",stage);

        // Set up a listener for when the stage is complete
        // to load the next level
        stage.on("complete",function() { Q.stageScene("level2"); });
    });

    Q.scene("level2",function(stage) {
        Q.state.set("level",2);
        setupLevel("level2",stage);
        stage.on("complete",function() { Q.stageScene("level3"); });
    });

    Q.scene("level3",function(stage) {
        Q.state.set("level",3);
        setupLevel("level3",stage);
        stage.on("complete",function() { Q.stageScene("level4"); });
    });

    Q.scene("level4",function(stage) {
        Q.state.set("level",4);
        setupLevel("level4",stage);
        stage.on("complete",function() { Q.stageScene("winner"); });
    });

    Q.UI.Text.extend("Lives",{
        init: function() {
            this._super({
                label: "lives: 3",
                align: "left",
                x: 70,
                y: Q.height - 10,
                weight: "normal",
                size:18
            });

            Q.state.on("change.lives",this,"lives");
        },

        lives: function(lives) {
            this.p.label = "lives: " + lives;
        }
    });

    Q.Sprite.extend("Background",{
        init: function(p) {
            this._super(p,{
                x: Q.width/2,
                y: Q.height/2,
                asset: 'bg_prerendered.png',
                type: 0
            });
        }
    });

}
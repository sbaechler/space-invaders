'use strict';

Quintus.SpaceInvadersScenes = function(Q) {

    function setupLevel(levelAsset,stage) {

        // stage.insert(new Q.Background());

        var cannon = stage.insert(new Q.Cannon())  ;
        var alien = stage.insert(new Q.AlienTracker());


//        stage.insert(new Q.AlienTracker({ data: Q.asset(levelAsset) }));
        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
        });
      }


    /**
     *  The first level.
     */
    Q.scene("level1",function(stage) {
        setupLevel("level1", stage);
        stage.on("complete",function() { Q.stageScene("level2"); });
    });
}
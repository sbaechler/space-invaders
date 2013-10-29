'use strict';

Quintus.SpaceInvadersScenes = function(Q) {


    /**
     *  The first level.
     */
    Q.scene("level1",function(stage) {
        var cannon = stage.insert(new Q.Cannon());




        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
        });
    });
}
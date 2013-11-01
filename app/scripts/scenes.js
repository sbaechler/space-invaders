'use strict';

Quintus.SpaceInvadersScenes = function(Q) {


    /**
     *  The first level.
     */
    Q.scene("level1",function(stage) {
        var cannon = stage.insert(new Q.Cannon());
        var alien=stage.insert(new Q.Alien())




        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
            alien.destroy();
        });
    });

}
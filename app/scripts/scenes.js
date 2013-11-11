'use strict';

Quintus.SpaceInvadersScenes = function(Q) {


    /**
     *  The first level.
     */
    Q.scene("level1",function(stage) {
        var cannon = stage.insert(new Q.Cannon());
        // stage.collisionLayer(new Q.Shield());
        var shieldPos = [60, 171, 282, 393];
        Q._each(shieldPos, function(pos, i) {
            stage.insert(new Q.Shield({x: pos, y:250 }));
        });




        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
            shield1.destroy();
        });
    });
}
'use strict';

Quintus.SpaceInvadersScenes = function(Q) {

    function setupLevel(levelAsset,stage) {
        var cannon = stage.insert(new Q.Cannon());
        var shieldPos = [60, 171, 282, 393];
        Q._each(shieldPos, function(pos, i) {
            stage.insert(new Q.Shield({x: pos, y:250 }));
        });

        // TODO: use levelAsset
        var alien = stage.insert(new Q.AlienTracker({y:20}));

        // cleanup
        stage.on("destroy",function() {
            cannon.destroy();
            shield1.destroy();
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
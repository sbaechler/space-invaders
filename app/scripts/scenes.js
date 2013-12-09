'use strict';

Quintus.SpaceInvadersScenes = function(Q) {

    function setupLevel(levelAsset, stage) {

        var cannon = stage.insert(new Q.Cannon());
        var shieldPos = [60, 171, 282, 393];
        Q._each(shieldPos, function(pos, i) {
            stage.insert(new Q.Shield({
                x: pos,
                y: 250
            }));
        });

        // TODO: use levelAsset
        var alien = stage.insert(new Q.AlienTracker({
            y: 40
        }));
        makeAliensShoot(levelAsset, stage);

        //var alien = stage.insert(new Q.UfoTracker({y:40}));

        // cleanup
        stage.on("destroy", function() {
            cannon.destroy();
            shield1.destroy();
        });
    };

    function makeAliensShoot(levelAsset, stage) {
        setInterval(function() {
            // TODO: This just takes the length of the first row of aliens. Should use max.
            var columns = Q.assets[levelAsset][0].length;
            var column = Math.floor((Math.random() * columns));
            // makes the lowest alien shoot
            var ufocreator = Math.floor((Math.random() * 10));
            console.log(ufocreator);
            if (ufocreator === 3) stage.insert(new Q.UfoTracker({
                y: 40,
                x: -200,
                step: 2
            }));
            if (ufocreator === 8) stage.insert(new Q.UfoTracker({
                y: 40,
                x: 1200,
                step: -2
            }));
            var alien = Q.assets.invaders[column].slice(-1).pop();
            if (alien !== undefined) alien.trigger('fire');
        }, 2000);
    };

    /**
     * The HUD displays score and level
     */
    Q.scene("hud", function(stage) {
        stage.insert(new Q.Score());
        stage.insert(new Q.Lives());
        stage.insert(new Q.Level());
    }, {
        stage: 1
    });

    /**
     *  The first level.
     */
    Q.scene("level1", function(stage) {
        Q.state.reset({
            score: 0,
            lives: 3,
            level: 1
        }); // removes all event listeners


        // Add the hud in
        Q.stageScene("hud");

        setupLevel("level1", stage);
        // Set up the game state
        stage.on("complete", function() {
            Q.stageScene("level2");
        });
    });
}

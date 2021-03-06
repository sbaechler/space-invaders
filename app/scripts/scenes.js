'use strict';

Quintus.SpaceInvadersScenes = function (Q) {

	function setupLevel(level, stage) {
        Q.clearStage(stage);
        var levelAsset = 'level1'  // only one asset for now.
        var canvas = document.getElementById('quintus');
        var github = document.getElementById('github');
        var fire;
        if (canvas) {
            canvas.style['background-image'] = "url('images/background.png')";
            github.style['display'] = 'none';
        }

		var cannon = stage.insert(new Q.Cannon());
		var shieldPos = [ 60, 171, 282, 393 ];
		
		Q._each(shieldPos, function(pos, i) {
			stage.insert(new Q.Shield({
				x : pos,
				y : 250
			}));
		});

		// TODO: use levelAsset
		stage.insert(new Q.AlienTracker({
            level: level,
            assetMap: 'level1'
		}));
		fire = makeAliensShoot(level, levelAsset);

        displayUfo(stage);

		// cleanup
        stage.on('destroyed', function(){
            clearInterval(fire);
            clearTimeout(Q.assets.ufoTimeout);
        });
		stage.on("destroy", function() {
            isPaused = 1;
			cannon.destroy();
            canvas.style['background']="black";
		});
	}
	;
	
	function makeAliensShoot(level, levelAsset) {
        var CADENCE_FACTOR = 150  // ms for each level
        var interval = setInterval(function() {
			// TODO: This just takes the length of the first row of aliens.
			// Should use max.
			var columns = Q.assets[levelAsset][0].length;
			var column = Math.floor((Math.random() * columns));
			// makes the lowest alien shoot
			var alien = Q.assets.invaders[column].slice(-1).pop();
			if (alien !== undefined)
				alien.trigger('fire');
		}, 2000 - (level*CADENCE_FACTOR));
        return interval;
	};

    function displayUfo(stage) {
        var stage = stage;
        // the next Ufo appears within 10-25 s.
        var nextUfo = (Math.floor(Math.random()*25) * 1000) + 20000;

        Q.assets.ufoTimeout = setTimeout(function(){
            // The UFO appears from the left or the right.
            if (Math.random() >= 0.5) {
                stage.insert(new Q.UFO({
                    y: 50,
                    x: -100,
                    speed: 3
                }));
            } else  {
                stage.insert(new Q.UFO({
                    y: 50,
                    x: Q.width+100,
                    speed: -3
                }));
            }
            displayUfo(stage);
        }, nextUfo);
    };

	/** Game Over Scene* */
	Q.scene("gameOver", function(stage) {
        var canvas = document.getElementById('quintus');
        var github = document.getElementById('github');
        if (canvas != null) {
            canvas.style['background'] = "black";
            github.style['display'] = 'block';
        }
		Q.stageScene(null, 1);

		document.body.style.background="rgba(0, 0, 0, 1)";

		stage.insert(new Q.UI.Text({
        	family: "'Press Start 2P'",
			label : "GAME OVER",
			align : 'center',
			color : 'white',
			x : Q.width / 2,
			y : 350,
			weight : "normal",
			size : 80
		}));
        stage.insert(new Q.UI.Text({
        	family: "'Press Start 2P'",
			label : "YOUR SCORE: " + Q.state.get('score'),
			align : 'center',
			color : '#ddd',
			x : Q.width / 2,
			y : 450,
			weight : "normal",
			size : 24
		}));

		setTimeout(function(){Q.stageScene('startpage');}, 4000);
	});

	/**
	 * The HUD displays score and level
	 */
	Q.scene("hud", function(stage) {
		stage.insert(new Q.Score());
		stage.insert(new Q.Level());
		stage.insert(new Q.CannonLiveTracker());
	}, {
		stage : 1
	});

	/**
	 * The startpage
	 */
	Q.scene("startpage", function(stage) {

		Q.clearStage(1);

        Q.state.reset({
            score : 0,
            lives : 3,
            level : 1
        }); // removes all event listeners

		stage.insert(new Q.Logo());
		stage.insert(new Q.ColourfullInvaders());

		stage.insert(new Q.UI.Button({
			x : Q.width / 2,
			y : 670,
			h : 20,
			w : 320,
			border : 5,
			fill : "red"
		}))
		
	    stage.insert(new Q.Startbutton());
        if (Q.sid !== undefined) {
            Q.sid.load("Super_Space_Invaders.sid");
        }


	});

	/**
	 * The level factory
	 */
    function createLevel(level){
        Q.scene("level" + level , function(stage) {
            if(level==1){
                // Add the hud in
                Q.stageScene("hud");
            }

            setupLevel(level, stage);
            // Set up the game state
            if (level <= 5){
                stage.on("complete", function() {
                    gaq('send', 'event', 'level-' + level, 'complete');
                    Q.stageScene("level"+(level+1));
                    Q.state.inc("level",1);
                });
            } else {
                stage.on("complete", function() {
                    Q.stageScene("gameOver");
                });
            }
        });
    }
    for (var i=1; i<=6; i++){
        createLevel(i);
    }
}
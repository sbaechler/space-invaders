'use strict';

/**
 * Test aller Game-Objekte
 */
(function () {
    describe('Sprites Test', function () {
        var Q, canvas, stage;
        beforeEach(function() {
            canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 200;

            Q = Quintus()
            .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio, Anim")
            .include("SpaceInvadersScenes, SpaceInvadersModels, GunControls, SpaceInvadersAssets")
            .setup(canvas)
            .controls();
            Q.clearColor = "#CCC";
            Q.clear();
            Q.scene("dummy_scene", function(stage) {
			});
			Q.stageScene("dummy_scene");
			stage = Q.stage();

            SpriteFixtures.loadSprites(Q);
            waitsFor(SpriteFixtures.doneLoaded,400);
            window.Q = Q;
        });


        // Don't forget the loop needs to be killed if it exists
        afterEach(function() {
            cancelAnimationFrame(Q.loop);
        });
        describe('Cannon', function () {
            it('should have the right asset', function(){
                runs(function(){        // wait for Quintus to have finished initialization.
                    var cannon = new Q.Cannon();
                    expect(cannon.p.asset).toEqual('cannon.png');
                    expect(cannon.p.collisionMask).toEqual(2);
                    expect(cannon.p.sprite).toEqual('cannon');
                });
            });
            it('should be able to shoot', function(){
                runs(function(){
                    var cannon = new Q.Cannon();
                    stage.insert(cannon);
                    Q.input.trigger('fire');
                    expect(Q('CannonShot').length).toBe(1);
                });
            });

        });
        
        describe('AlienTracker', function () {
            it('should be able to shoot', function(){
                runs(function(){
                    var alien = new Q.AlienTracker();
                    stage.insert(alien);
                    expect(Q('AlienShot').length).toBe(1);
                });
            });

        });
        
        describe('AlienTracker', function () {
            it('should be able to shoot', function(){
                runs(function(){
                    var cannonShot = new Q.CannonShot();
                    stage.insert(cannonShot);
                    
                    var alienShot = new Q.AlienShot();
                    stage.insert(alienShot);
                    
                    cannonShot.collide(alienShot);
                });
            });

        });
    });
})();

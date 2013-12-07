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
            Q.state.reset({ score: 0, lives: 3, level: 1 });

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
                runs(function(){ // wait for Quintus to have finished initialization.
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
                    expect(Q('CannonShot').items.length).toBe(1);
                });
            });
            it('should be destroyed if hit', function(){
                runs(function(){
                    var cannon = new Q.Cannon({hittable: true});
                    stage.insert(cannon);
                    expect(Q('Cannon').items.length).toBe(1);
                    expect(Q.state.get('lives')).toBe(3);
                    cannon.trigger('hit');
                    // wait 0.1s
                    waits(100);
                    runs(function(){
                        expect(Q('Cannon').items.length).toBe(0);
                        expect(Q.state.get('lives')).toBe(2);
                        }
                    );
                });
            });
        });
    });
})();
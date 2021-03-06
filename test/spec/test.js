'use strict';

/**
 * Test aller Game-Objekte
 */
(function() {
	describe('Sprites Test', function() {
		var Q, canvas, stage;
		beforeEach(function() {
            canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 200;
            window.gaq = function(){};

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
            waitsFor(SpriteFixtures.doneLoaded, 400);
            Q.animations('alien', {
                hampelmann: { frames: [0,1], rate:1/1}
            });
            Q.animations('cannon', {
                explode: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], rate: 1/15,
                    loop: false, trigger: 'kill' }
            });
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
                        expect(cannon.p.sheet).toEqual("explosion1");
                        expect(Q.state.get('lives')).toBe(2);
                        }
                    );
                });
            });
        });
        describe('Shields', function () {
            it('should have 70 elements', function(){
                runs(function(){
                    var shield = stage.insert(new Q.Shield({x: 100, y:100 }));
                    expect(Q('Shield').items.length).toBe(1);
                    expect(shield.children.length).toBe(70);
                    expect(Q('ShieldElement').items.length).toBe(70);
                });
            });
            it('should be damaged by Alien hit', function(){
                runs(function(){
                    var shield = new Q.Shield({x: 100, y:100 });
                    stage.insert(shield);
                    expect(shield.children.length).toBe(70);
                    var element = shield.children[0];
                    expect(element.p.sheet).toEqual('shield');
                    expect(element.p.strength).toBe(1);
                    element.trigger('hit', 'AlienShot');
                    expect(element.p.sheet).toEqual('shield-hit');
                    expect(element.p.strength).toBe(0);
                    var element = shield.children[1];
                    element.trigger('hit', 'Alien');
                    waits(100);
                    runs(function(){
                        expect(shield.children.length).toBe(69);
                    });
                });
            });
        });
        describe('Aliens', function(){
            it('should be able to shoot', function() {
                runs(function() {
                    var alien = new Q.Alien();
                    alien.p.parent = {p: {x: 100}}; // mock
                    stage.insert(alien);
                    alien.trigger('fire');
                    expect(Q('AlienShot').items.length).toBe(1);
                });
            });
            it('should destroy one shot', function() {
                runs(function() {
                    var cannonShot = new Q.CannonShot();
                    stage.insert(cannonShot);

                    var alienShot = new Q.AlienShot();
                    stage.insert(alienShot);

                    alienShot.trigger('collide', 'CannonShot');
                    waits(100);
                    runs(function(){
                        var shotCounter = Q('CannonShot').items.length
                            + Q('AlienShot').items.length;

                        expect(shotCounter).toBe(1);
                    });
                });
            });

            it('should show a game over screen if no lives are left', function() {
                runs(function() {

                    var cannon = new Q.Cannon({
                        hittable : true
                    });
                    stage.insert(cannon);
                    Q.state.set('lives', 1);
                    cannon.trigger('hit');
                    waits(1000);
                    runs(function(){
                       expect(Q.stage().items[0].p.label).toEqual('GAME OVER');
                    });
                });
            });
        });
         
    /*UFO*/
    describe('Ufo', function(){
            it('there should be an ufo', function() {
                runs(function() {
                    var ufo = new Q.UFO();
                    ufo.p.parent = {x: 100}; // mock
                    stage.insert(ufo);
                   
                    expect(Q('UFO').items.length).toBe(1);
                });
            });
            it('ufo should have speed', function() {
                runs(function() {
                    var ufo = new Q.UFO();
                    ufo.p = {x: -100, y:50, speed: 1.5}; // mock
                    stage.insert(ufo);
                   ufo.trigger('step');
                    expect(Q('UFO').items[0].p.speed).toBe(1.5);
                });
            });
            it('ufo should fly from left to right', function() {
                runs(function() {
                    var ufo = new Q.UFO();
                    ufo.p = {x: -100, y:50, speed: 1.5}; // mock
                    stage.insert(ufo);
                    ufo.p.x=ufo.p.x + ufo.p.speed;

                      expect(Q('UFO').items[0].p.x).toBe(-98.5);
                });
            });
             it('ufo should fly from right to left', function() {
                runs(function() {
                    var ufo = new Q.UFO();
                    ufo.p = {x: Q.width+100, y:50, speed: 1.5}; // mock
                    stage.insert(ufo);
                    ufo.p.x=ufo.p.x - ufo.p.speed;

                      expect(Q('UFO').items[0].p.x).toBe(Q.width+98.5);
                });
            });
             it('ufoscore by shot', function() {
                runs(function() {
                   var ufoscore = new Q.UfoScore({punkte:300});
                   
                      expect(ufoscore.p.label).toBe('300');
                });
            });
    });

    describe('Startpage', function () {
        it('should show startpage elements', function(){
            runs(function(){
                Q.stageScene("startpage");
                expect(Q('Startbutton').items.length).toBe(1);
                expect(Q('Logo').items.length).toBe(1);
            });
        });
        
        it('after pushed the button should show level 1', function(){
            runs(function(){
                Q.stageScene("startpage");

                expect(Q('Startbutton').items.length).toBe(1);
                expect(Q('Logo').items.length).toBe(1);
                Q('Startbutton').trigger('click');
                
                expect(Q('Startbutton').items.length).toBe(0);
                expect(Q('Cannon').items.length).toBe(1);
                
            });
        });
    });
    describe('Level', function(){
        it('should have 6 levels and the title screens', function(){
            runs(function(){
                expect(Q.scenes.hud).toBeTruthy();
                expect(Q.scenes.startpage).toBeTruthy();
                expect(Q.scenes.gameOver).toBeTruthy();
                expect(Q.scenes.level1).toBeTruthy();
                expect(Q.scenes.level2).toBeTruthy();
                expect(Q.scenes.level3).toBeTruthy();
                expect(Q.scenes.level4).toBeTruthy();
                expect(Q.scenes.level5).toBeTruthy();
                expect(Q.scenes.level6).toBeTruthy();
                expect(Q.scenes.level7).toBeFalsy();
            });
        });

    });
    
    
    describe('Lives', function(){
        it('should be 3 lives', function(){
            runs(function(){
            	   Q.stageScene("startpage");
                   Q('Startbutton').trigger('click');
                   expect(Q.state.get('lives')).toBe(3);
            });
        });
        
        it('dec and inc lives should work', function(){
            runs(function(){
            	   Q.stageScene("startpage");
                   Q('Startbutton').trigger('click');
                   expect(Q.state.get('lives')).toBe(3);
                   
                   Q.state.dec("lives",1);
                   expect(Q.state.get('lives')).toBe(2);

                   Q.state.inc('score', 1500);
                   expect(Q.state.get('lives')).toBe(3);
            });
        });
    });
    
  });
})();

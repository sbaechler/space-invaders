'use strict';

window.addEventListener('load',function() {

    /**
     * The game engine class is initialized.
     */
    var Q = Quintus()       // Create a new engine instance
          .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio, Anim, SID") // Load any needed modules
          .include("SpaceInvadersScenes, SpaceInvadersModels, GunControls, SpaceInvadersAssets")
          .setup({ width: 1024, height: 768, downsampleWidth: 640, downsampleHeight: 480 })
          
          //.controls()                        // Add in default controls (keyboard, buttons)
          .enableSound()
          .enableSid()
          .touch();                          // Add in touch support (for the UI)


    Q.state.reset({ score: 0, lives: 3 });
    Q.input.touchControls({
      controls:  [ ['left','<' ],
                   ['right','>' ],
                   [],
                   [],
                   ['fire', 'fire' ]]
    });
    Q.controls();
    // Q.debug = true;
    window.Q = Q;

    Q.animations('alien', {
        hampelmann: { frames: [0,1], rate:1/1}
    });
    Q.animations('cannon', {
        explode: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], rate: 1/15,
            loop: false, trigger: 'kill' }
    });
    Q.animations('UFO', {
        explode: { frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], rate: 1/15,
            loop: false, trigger: 'kill' }
    });

    // images are loaded from 'images', audio from 'audio' and anything else from 'data'


    Q.load([ "background.png", "colourfullInvaders.png", "logo.png",
             "cannon.png", "invaders2.png",  "alienShot.png", "shoot.png",  "shield.png",
             "fire2.mp3", "explosion.mp3", "fastinvader1.mp3", "fastinvader2.mp3",
             "fastinvader3.mp3", "fastinvader4.mp3", "fire1.mp3", "ufo_lowpitch.mp3",
             "ufo_shot.mp3", "explosion.png",
             // only mp3 needs to be specified. Alternate formats loaded accordingly.
             "sprites.json", "explosions.json"],

        function() {
            Q.compileSheets("invaders2.png","sprites.json");
            Q.compileSheets("explosion.png","explosions.json");
            Q.sheet("shield", "shield.png", {tilew: 10, tileh: 10, sx:0, sy:0, frames:5 });
            Q.sheet("shield-hit", "shield.png", {tilew: 10, tileh: 10, sx:0, sy:10, frames:5 });
        // show startpage
        Q.stageScene("startpage");
    });

});
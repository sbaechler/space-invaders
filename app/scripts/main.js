'use strict';

window.addEventListener('load',function() {

    /**
     * The game engine class is initialized.
     */
    var Q = Quintus()       // Create a new engine instance
          .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio, Anim") // Load any needed modules
          .include("SpaceInvadersScenes, SpaceInvadersModels, GunControls, SpaceInvadersAssets")
          .setup({ width: 1024, height: 768, downsampleWidth: 640, downsampleHeight: 480 })
          .controls()                        // Add in default controls (keyboard, buttons)
          .enableSound();
          // .touch();                          // Add in touch support (for the UI)


    Q.state.reset({ score: 0, lives: 3 });
//     Q.debug = true;
    window.Q = Q;

    // images are loaded from 'images', audio from 'audio' and anything else from 'data'


    Q.load([ "cannon.png", "invaders.png",  "alienShot.png", "shoot.png",  "shield.png",
             "fire2.mp3", "explosion.mp3", "fastinvader1.mp3", "fastinvader2.mp3",
             "fastinvader3.mp3", "fastinvader4.mp3", "fire1.mp3", "ufo_lowpitch.mp3",
             "ufo_shot.mp3",
             // only mp3 needs to be specified. Alternate formats loaded accordingly.
             "sprites.json"],
        function() {
            Q.compileSheets("invaders.png","sprites.json");
            Q.sheet("shield", "shield.png", {tilew: 10, tileh: 10, sx:0, sy:0, frames:5 });
          //  Q.sheet("alien", "invaders.png", {tilew: 110, tileh: 110, sx:10, sy:10, frames:2 });


            // Start level 1
        Q.stageScene("level1");
    });

});
'use strict';

window.addEventListener('load',function() {

    /**
     * The game engine class is initialized.
     */
    var Q = Quintus({
                    audioSupported: ['mp3']   // We only have mp3 samples for now.
           })       // Create a new engine instance
          .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio, Anim") // Load any needed modules
          .include("SpaceInvadersScenes, SpaceInvadersModels, GunControls, SpaceInvadersAssets")
          .setup({ width: 1024, height: 768, downsampleWidth: 640, downsampleHeight: 480 })
          .controls()                        // Add in default controls (keyboard, buttons)
          .enableSound();
          // .touch();                          // Add in touch support (for the UI)


    Q.state.reset({ score: 0, lives: 3 });
    // Q.debug = true;
    window.Q = Q;

    // images are loaded from 'images', audio from 'audio' and anything else from 'data'

    Q.load([ "cannon.png", "invaders.png", "shoot.png",  "shield.png","fire2.mp3", "sprites.json"],
        function() {
            Q.compileSheets("invaders.png","sprites.json");
            Q.sheet("shield", "shield.png", {tilew: 10, tileh: 10, sx:0, sy:0, frames:5 });
          //  Q.sheet("alien", "invaders.png", {tilew: 110, tileh: 110, sx:10, sy:10, frames:2 });


            // Start level 1
        Q.stageScene("level1");
    });

});
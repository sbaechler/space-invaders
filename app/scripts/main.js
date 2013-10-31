'use strict';

window.addEventListener('load',function() {

    /**
     * The game engine class is initialized.
     */
    window.Q = Quintus({    // bind it to window for debugging
                    audioSupported: ['mp3']   // We only have mp3 samples for now.
           })       // Create a new engine instance
          .include("Sprites, Scenes, Input, 2D, Touch, UI, Audio") // Load any needed modules
          .include("SpaceInvadersScenes, SpaceInvadersModels, GunControls")
          .setup({ width: 1024, height: 768, downsampleWidth: 640, downsampleHeight: 480 })
          .controls()                        // Add in default controls (keyboard, buttons)
          .enableSound();
          // .touch();                          // Add in touch support (for the UI)


    Q.state.reset({ score: 0, lives: 3 });

    // images are loaded from 'images', audio from 'audio' and anything else from 'data'
    Q.load([ "cannon.png", "invaders.png", "fire2.mp3"], function() {

        // Start level 1
        Q.stageScene("level1");
    });

});
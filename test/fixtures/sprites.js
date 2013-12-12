/**
 * Helper class for testing Sprites.
 * @type {{isLoaded: boolean, loadBlocks: Function, doneLoaded: Function, sample: Function}}
 */
SpriteFixtures = {

  isLoaded: false,

  loadSprites: function(Q,callback) {
    SpriteFixtures.isLoaded = false;
    Q.load(["cannon.png", "shoot.png",  "shield.png", "invaders2.png"],function() {
      // fake the sprites.json asset as the JSON doesn't load in the browser
      Q.assets['sprites.json'] =  {

          "alien1":{"sx":0,"sy":0,"tilew":64,"tileh":64, "cols":2},
          "alien2":{"sx":0,"sy":71,"cols":2,"tilew":88,"tileh":64, "w":58,"h":70 },
          "alien3":{"sx":0,"sy":140,"cols":2,"tilew":96,"tileh":65, "w":58,"h":70 },
            "ufo":{"sx":0,"sy":210,"cols":2,"tilew":196,"tileh":85, "w":58,"h":70 }

        };
      SpriteFixtures.isLoaded = true;
      if(callback) callback();
    });
  },

  doneLoaded: function() {
    return SpriteFixtures.isLoaded;
  }

};



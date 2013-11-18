/**
 * Helper class for testing Sprites.
 * @type {{isLoaded: boolean, loadBlocks: Function, doneLoaded: Function, sample: Function}}
 */
SpriteFixtures = {

  isLoaded: false,

  loadSprites: function(Q,callback) {
    SpriteFixtures.isLoaded = false;
    Q.options.imagePath = 'app/images/';
    Q.options.dataPath = 'app/data/';
    Q.load(["cannon.png", "shoot.png",  "shield.png", "invaders.png"],function() {
      // fake the sprites.json asset as the JSON doesn't load in the browser
      Q.assets['sprites.json'] =  {
          "alien1":{"sx":40,"sy":30,"cols":1,"tilew":64,"tileh":64, "w":64,"h":64,"frames":2 },
          "alien2":{"sx":27,"sy":134,"cols":1,"tilew":88,"tileh":64, "w":88,"h":64,"frames":2 },
          "alien3":{"sx":15,"sy":245,"cols":1,"tilew":95,"tileh":60, "w":95,"h":60,"frames":2 },
          "ufo":{"sx":15,"sy":337,"cols":1,"tilew":180,"tileh":88, "w":128,"h":70,"frames":2 }
        };
      SpriteFixtures.isLoaded = true;
      if(callback) callback();
    });
  },

  doneLoaded: function() {
    return SpriteFixtures.isLoaded;
  }

};
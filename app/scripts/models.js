'use-strict';

Quintus.SpaceInvadersModels = function(Q) {
  Q.gravityY = 0;
  Q.gravityX = 0;
/**
 * Add the score Class
 */

Q.UI.Text.extend("Score",{
    init: function(p){
    this._super({
      label: "score: 0",
      x: 0,
      y: 0
    });

    Q.state.on("change.score",this,"score");
    },

    score: function(score) {
    this.p.label = "score: " + score;
    }
});


Q.Sprite.extend("CannonShot",{
    init: function(p) {
        this._super(p,{
           asset: 'shoot.png',    // image
            w: 20,
            h: 20,
            type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY
        });

    },

    step: function(dt){
        this.p.y =this.p.y-2;
        if(this.p.y < 0) this.destroy();
    }

});

    Q.Sprite.extend("Alien",{
        init: function(p){
            this._super(p,{
               asset:'invaders.png',
                w:20,
                h:20,
                type:  Q.SPRITE_DEFAULT,
                y: 80,                 // position
                x: 412,
                stepDistance: 50
            });
        }
    });

    Q.TileLayer.extend("GameTiles",{
        init: function(p) {
            this._super({
                dataAsset: "bg.tmx",
                sheet: 'tiles',
                tileW: 16,
                tileH: 16,
                blockTileW: 21,
                blockTileH: 27
            });
        },

        // Override the load method to load the bg.tmx file,
        // then pass the data array to the original implementation
        load: function(dataAsset) {
            var parser = new DOMParser(),
                doc = parser.parseFromString(Q.asset(dataAsset), "application/xml");

            var layer = doc.getElementsByTagName("layer")[0],
                width = parseInt(layer.getAttribute("width")),
                height = parseInt(layer.getAttribute("height"));

            var data = [],
                tiles = layer.getElementsByTagName("tile"),
                idx = 0;
            for(var y = 0;y < height;y++) {
                data[y] = [];
                for(var x = 0;x < width;x++) {
                    var tile = tiles[idx];
                    data[y].push(parseInt(tile.getAttribute("gid")-1));
                    idx++;
                }
            }

            this._super(data);
        },

        collidableTile: function(tileNum) {
            return tileNum != 23;
        }

    });

/**
 * The Cannon class which is at the bottom of the page.
 */

Q.Sprite.extend("Cannon", {
    init: function(p){
        this._super({
            asset: 'cannon.png',    // image
            w: 110,                 // width
            h: 68,                  // height
            type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY, // reacts to sprites mask
            y: 680,                 // position
            x: 512,
            stepDistance: 50       // moving speed
        }, p);
        this.add('GunControls, gunControls');
        Q.input.on('fire', this, "fireGun");

//        this.on("hit.sprite",function(collision) {
//            if(collision.obj.isA("AlienShot")) {
//                Q.stageScene("CannonHit", 1);
//                this.destroy();
//              }
//            });

    },

    fireGun: function(){
        console.log("firing...");
        Q.audio.play("fire2.mp3");
    }
});




    Q.TileLayer.extend("Alien", {
        init: function(p){
            this._super({

                tileW: 32,  // Default tile width
                tileH: 32,  // Default tile height
                blockTileW: 10,  // Default pre-render size
                blockTileH: 10,
                type: Q.SPRITE_DEFAULT // Default type (for collisions)


                   // gravity factor
            }, p);
            //this.add('2d, stepControls');
            Q.input.on('fire', this, "fireGun");

            this.on("hit",this,"collision");

        },
        step: function(dt) {
            this.p.vy += dt * 2.8;

            this.p.x += this.p.vx * dt;
            this.p.y += this.p.vy * dt;
        },
        fireGun: function(){
            console.log("firing...");
            Q.audio.play("fire2.mp3");
        }
    });

    Q.UI.Text.extend("Level",{
        init: function() {
            this._super({
                label: "level: 1",
                align: "right",
                level: 1,
                x: Q.width - 70,
                y: Q.height - 10,
                weight: "normal",
                size:18
            });

            Q.state.on("change.level",this,"level");
        },

        level: function(lvl) {
            this.p.label = "level: " + lvl;

        }
    });




}
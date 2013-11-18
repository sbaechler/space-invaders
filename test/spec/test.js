/*global describe, it */
'use strict';


(function () {
    describe('Sprites Test', function () {
        var Q, canvas;
        beforeEach(function() {
            canvas = document.createElement("canvas");
            canvas.width = 200;
            canvas.height = 200;

            Q = Quintus().include("Sprites, SpaceInvadersModels").setup(canvas);
            Q.clearColor = "#CCC";
            Q.clear();
        });


        // Don't forget the loop needs to be killed if it exists
        afterEach(function() {
            cancelAnimationFrame(Q.loop);
        });
        describe('Cannon', function () {
            var cannon = new Q.Cannon();
            it('should have the right asset', function(){
                expect(cannon.asset).toEqual('cannon.png');
            });



            it('should run here few assertions', function () {
                expect(true).toBeTruthy();
            });
        });
    });
})();

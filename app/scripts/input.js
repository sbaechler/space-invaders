'use strict';

Quintus.GunControls = function(Q) {
  Q.component("gunControls", {

    added: function() {
      var p = this.entity.p;

      if(!p.stepDistance) { p.stepDistance = 32; }
      if(!p.stepDelay) { p.stepDelay = 0.2; }

      p.stepWait = 0;
      this.entity.on("step",this,"step");
      this.entity.on("hit", this,"collision");
    },

    collision: function(col) {
      var p = this.entity.p;

      if(p.stepping) {
        p.stepping = false;
      }

    },

    step: function(dt) {
      var p = this.entity.p,
          moved = false;
      p.stepWait -= dt;

      if(p.stepping) {
        p.x += p.diffX * dt / p.stepDelay;
      }

      if(p.stepWait > 0) { return; }
      if(p.stepping) {
        p.x = p.destX;
      }
      p.stepping = false;

      p.diffX = 0;
      p.diffY = 0;

      if(Q.inputs['left'] && p.x > p.w) {
        p.diffX = -p.stepDistance;
      } else if(Q.inputs['right'] && p.x < Q.width - p.w) {
        p.diffX = p.stepDistance;
      }

      if(p.diffX ) {
        p.stepping = true;
        p.origX = p.x;
        p.destX = p.x + p.diffX;
        p.stepWait = p.stepDelay;
      }

    }

  });
}
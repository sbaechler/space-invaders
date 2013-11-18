;Quintus.SpaceInvadersAssets = function(Q) {

  // Blueprint for the shield element
  Q.assets['shield'] = [
    [0,1,1,1,1,1,1,1,1,1,1,4],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,2,5,5,5,5,5,5,3,1,1],
    [1,1,5,5,5,5,5,5,5,5,1,1]
    ];

    var b = 1; // red
    var r = 3; // blue
    var o = 2; // orange
    var g = 1; // green
    var X = 0; // null

  Q.assets['level1'] = [
      [X,X,g,o,g,X,X],
      [o,b,g,g,g,b,o],
      [X,b,r,r,b,b,X]
  ];

};

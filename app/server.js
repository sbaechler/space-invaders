'use strict';

var path = require('path');
var statik = require('statik');
statik({
    port: 3000,
    root: path.join(__dirname)
});

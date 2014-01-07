#A Web version of SpaceInvaders

[![Build Status](https://travis-ci.org/sbaechler/space-invaders.png?branch=master)](https://travis-ci.org/sbaechler/space-invaders)

Zum aufsetzen benötigst du [Ruby](https://www.ruby-lang.org/de/downloads/),
[node js](http://nodejs.org/) und [Yeoman](http://yeoman.io/).


##Zum installieren

    bower install & npm install

##Server starten

    grunt server

##Testen

    grunt test

##Deployen

    grunt build
    cd dist
    git push heroku master



## Live Version

http://html5-space-invaders.herokuapp.com/


## Benutzte externe Bibliotheken

[Quintus HTML5 game engine](http://html5quintus.com/)
[TinyJsSid library](http://www.wothke.ch/experimental/TinyJsSid.html) (C64 SID emulator)
[High Voltage SID Collection](http://hvsc.c64.org/) (Musik)
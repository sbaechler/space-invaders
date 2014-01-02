/*
    This provides experimental support for SID audio files:
    It requires the TinyJsSid library: http://www.wothke.ch/experimental/TinyJsSid.html
    http://hvsc.c64.org/
 */

Quintus.SID = function(Q) {
    const SAMPLES_PER_BUFFER = 8192;	// allowed: buffer sizes: 256, 512, 1024, 2048, 4096, 8192, 16384
    var audioCtx;
    var bufferSource;
    var gainNode;
    var analyzerNode;

    function initialAudioSetup() {
        if (typeof bufferSource != 'undefined') {
            bufferSource.stop(0);
        } else {
            setupAudioNodes();
        }
    }

    function setupAudioNodes() {
        if (typeof audioCtx == 'undefined') {
            try {
                window.AudioContext = window.AudioContext||window.webkitAudioContext;
                audioCtx = new AudioContext();
            } catch(e) {
                alert('Web Audio API is not supported in this browser (get Chrome 18 or Firefox 26)');
            }
            analyzerNode = audioCtx.createAnalyser();

            var rsidNode = audioCtx.createScriptProcessor(SAMPLES_PER_BUFFER, 0, 1);
            rsidNode.onaudioprocess = tinyRSID_genSamples;

            gainNode = audioCtx.createGain();

            rsidNode.connect(gainNode);
            gainNode.connect(analyzerNode);
            analyzerNode.connect(audioCtx.destination);
        }
    }


    var sid = {
        load: function(){},
        play: function(){},
        stop: function(){}
      };

    Q.enableSid = function(){
        Q.sid = sid;
        if(!Q.hasWebAudio){
                log("No Web Audio.");
                return this;
        }
        Q.sid.load = function(song){
            var xhr = new XMLHttpRequest();
            xhr.open("GET", 'audio/' + song, true);
            xhr.responseType = "arraybuffer";

            xhr.onload = function (oEvent) {
                isPaused = 1;
                tinyRSID_loadData(xhr.response);
                tinyRSID_playSong(actualSubsong);
                initialAudioSetup();
                isPaused = 0;
            };
            xhr.send(null);
        }
        Q.sid.play = function(){
          if (typeof bufferSource === 'undefined') {
            bufferSource = audioCtx.createBufferSource();
            if (!bufferSource.start) {
              bufferSource.start = bufferSource.noteOn;
              bufferSource.stop = bufferSource.noteOff;
            }
            bufferSource.start(0);
          }
        }
        Q.sid.stop = function(){
            isPaused = 1;
        }
        return this;
    }



}
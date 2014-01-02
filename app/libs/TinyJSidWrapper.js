/*
	output: once the song has been loaded the the below attributes are available
*/
var playSpeed;
var maxSubsong;
var actualSubsong;
var songName;
var songAuthor;
var soungReleased;

var sourceBuffer;

function tinyRSID_loadData(arrayBuffer) {
  if (arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);

	var buf = Module._malloc(byteArray.length);
	Module.HEAPU8.set(byteArray, buf);
	var ret = Module.ccall('loadSidFile', 'number', ['number', 'number'], [buf, byteArray.length]);
	Module._free(buf);
													
	var array = Module.HEAP32.subarray(ret>>2, (ret>>2)+7);
	var loadAddr= Module.HEAP32[((array[0])>>2)]; // i32
	playSpeed= Module.HEAP32[((array[1])>>2)]; // i32
	maxSubsong= Module.HEAP8[(array[2])]; // i8
	actualSubsong= Module.HEAP8[(array[3])]; // i8
	songName= Module.Pointer_stringify(array[4]);
	songAuthor= Module.Pointer_stringify(array[5]);
	soungReleased= Module.Pointer_stringify(array[6]);
	
	sourceBuffer= Module.ccall('getSoundBuffer', 'number');
  }
}

function tinyRSID_playSong(id) {
  Module.ccall('playTune', 'number', ['number'], [id]);
}

var numberOfSamplesRendered= 0;
var numberOfSamplesToRender= 0;
var sourceBufferIdx=0;

var isPaused= 0;

function tinyRSID_genSamples(event) {
	var output = event.outputBuffer.getChannelData(0);

	if (isPaused === 1) {
		var i;
		for (i= 0; i<output.length; i++) {
			output[i]= 0;
		}		
	} else {
		var outSize= output.length;
		numberOfSamplesRendered = 0;		
		
		while (numberOfSamplesRendered < outSize)
		{
			if (numberOfSamplesToRender == 0) {
				numberOfSamplesToRender = Module.ccall('computeAudioSamples', 'number');
				sourceBufferIdx=0;			
			}
			
			var srcBufI32= sourceBuffer>>2;
			if (numberOfSamplesRendered + numberOfSamplesToRender > outSize) {
				var availableSpace = outSize-numberOfSamplesRendered;
				
				var i;
				for (i= 0; i<availableSpace; i++) {
					output[i+numberOfSamplesRendered]= Module.HEAP32[srcBufI32+sourceBufferIdx]/(0x8000);
					sourceBufferIdx+=1;
				}				
				numberOfSamplesToRender -= availableSpace;
				numberOfSamplesRendered = outSize;
			} else {
				var i;
				for (i= 0; i<numberOfSamplesToRender; i++) {
					output[i+numberOfSamplesRendered]= Module.HEAP32[srcBufI32+sourceBufferIdx]/(0x8000);
					sourceBufferIdx+=1;
				}						
				numberOfSamplesRendered += numberOfSamplesToRender;
				numberOfSamplesToRender = 0;
			} 
		}  
	}	
}

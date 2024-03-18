var playing = false;
var resolution = 128;
var progress = 0;

var fft = new Tone.FFT(resolution); 
var waveform = new Tone.Waveform(resolution); 

var audioContext = new AudioContext();
var analyser = audioContext.createAnalyser();
analyser.fftSize = resolution * 2;

// Get canvas and context
// var canvas = document.getElementById("fft");
// var ctx = canvas.getContext("2d");

var ctx = $("canvas")
  .get(0)
  .getContext("2d");

Tone.Buffer.on("progress", function(data) {
    progress = data;
});


function visualize(audio) {
    

    // Connect AnalyserNode to the audio source
    var source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    playing = true;
    drawLoop();
}


// Function to draw frame
function drawFrame(fftvalues, waveformvalues) {
    sizeCanvases();
    var fftvalue = 0;
    var waveformvalue = 0;
  
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
  
    var arc = 360 / resolution;
    for (var i = 0, len = resolution; i < len; i++) {
      
      // Infinite values caused by silence will lock up the browser.
      // Detect and adjust.
      if (fftvalues && isFinite(fftvalues[i])) {
        fftvalue = fftvalues[i];
      } else {
        fftvalue = -105;
      }
  
      if (waveformvalues && isFinite(waveformvalues[i])) {
        waveformvalue = waveformvalues[i];
      } else {
        waveformvalue = -1;
      }
  
      var wendr = map(waveformvalue, -1, 1, 0, 10);
      var endr = map(fftvalue, -127, 127, -25, 200);
      var startr = 100 - endr / 2;
  
      endr = endr + startr + wendr;
  
      var angle = arc * i * Math.PI / 180;
  
      var startx = startr * Math.cos(angle);
      var starty = startr * Math.sin(angle);
      var endx = endr * Math.cos(angle);
      var endy = endr * Math.sin(angle);
      
      ctx.beginPath();
  
      if (arc * i < 360 * progress) {
        if (!playing) {
          ctx.strokeStyle = "rgba(255,255,255,1)";
        } else {
          ctx.strokeStyle = "rgba(255,255,255," + endr + ")";
        }
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
      }
  
      ctx.lineCap = "round";
      ctx.moveTo(startx, starty);
      ctx.lineTo(endx, endy);
      ctx.lineWidth = wendr;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "white";
      ctx.stroke();
    }
  }

// size the canvases
var canvasWidth, canvasHeight;
function sizeCanvases() {
  canvasWidth = $("#fft").width();
  canvasHeight = $("#fft").height();
  ctx.canvas.width = canvasWidth;
  ctx.canvas.height = canvasHeight;
}

// start the draw loop
// see http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/ for details on how this works.
var fps = 30;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function drawLoop() {
  requestAnimationFrame(drawLoop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - delta % interval;

    // Draw a frame
    sizeCanvases();

    // Get the fft data and draw it
    if (playing) {
    //   var fftValues = fft.getValue();
    //   var waveformValues = waveform.getValue();

        // Get FFT data
        var fftValues = new Uint8Array(analyser.frequencyBinCount);
        for (let i = 0; i < fftValues.length; i++) {
            fftValues[i] = Math.floor(Math.random() * 256); // Generate a random integer between 0 and 255
        }
        //analyser.getByteFrequencyData(fftValues);

        // Get waveform data
        var waveformValues = new Uint8Array(analyser.frequencyBinCount);
        for (let i = 0; i < waveformValues.length; i++) {
            waveformValues[i] = Math.floor(Math.random() * 256); // Generate a random integer between 0 and 255
        }
        //analyser.getByteTimeDomainData(waveformValues);

        drawFrame(fftValues, waveformValues);
    }

  }
}




// Map function borrowed and mangled from P5
function map(n, start1, stop1, start2, stop2, withinBounds) {
  var newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  if (!withinBounds) {
    return newval;
  }
  if (start2 < stop2) {
    return constrain(newval, start2, stop2);
  } else {
    return constrain(newval, stop2, start2);
  }
}

// Constrain function borrowed and mangled from P5
function constrain(n, low, high) {
  return Math.max(Math.min(n, high), low);
}

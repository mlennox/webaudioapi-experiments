export function waveformDisplay(canvasSelector = '.oscilloscope', audioContext = new window.AudioContext(), source) {

  console.log('waveform init');

  this.analyser = {
    instance: null,
    dataArray: [],
    // canvasContext: null,
    // visualiser: null,
    // width: 0,
    // height: 0
  };

  this.display = {
    canvasSelector,
    canvasContext: null,
    visualiser: null,
    width: 0,
    height: 0
  };

  this.audio = {
    context: audioContext,
    source: source || defaultOscillator(audioContext)
  };

}

waveformDisplay.prototype.init = function () {
  this.initCanvas();
  this.initAnalyser();
  this.startDrawing();
}

waveformDisplay.prototype.initAnalyser = function () {
  this.analyser.instance = this.audio.context.createAnalyser();
  this.analyser.instance.fftSize = 2048;
  var bufferLength = this.analyser.instance.frequencyBinCount;
  this.analyser.dataArray = new Uint8Array(bufferLength);
  // this.analyser.instance.getByteTimeDomainData(this.analyser.dataArray);

  this.audio.source.connect(this.analyser.instance);
};

waveformDisplay.prototype.initCanvas = function () {
  var canvasContainer = document.querySelector(this.display.canvasSelector);
  this.display.width = canvasContainer.width;
  this.display.height = canvasContainer.height;
  this.display.canvasContext = canvasContainer.getContext('2d');
}


waveformDisplay.prototype.startDrawing = function () {
  this.analyser.visualiser = requestAnimationFrame(this.startDrawing.bind(this));

  this.analyser.instance.getByteTimeDomainData(this.analyser.dataArray);
  this.display.canvasContext.fillStyle = 'rgb(200, 200, 200)';
  this.display.canvasContext.fillRect(0, 0, this.display.width, this.display.height);

  for (let bin = 0; bin < this.analyser.instance.frequencyBinCount; bin++) {
    let currentValue = this.analyser.dataArray[bin];
    let percent = currentValue / 256;
    let height = this.display.height * percent;
    let offset = this.display.height - height - 1;
    let barWidth = this.display.width / this.analyser.instance.frequencyBinCount;
    let hue = bin / this.analyser.instance.frequencyBinCount * 360;
    this.display.canvasContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
    this.display.canvasContext.fillRect(bin * barWidth, offset, barWidth, height);
  }
}

waveformDisplay.prototype.stopDrawing = function () {

}
// source.connect(analyser);




function defaultOscillator(audioContext) {
  const osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1, audioContext.currentTime);
  osc.start();
  return osc;
}
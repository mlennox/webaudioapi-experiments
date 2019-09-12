export function waveformDisplay(canvasSelector = '.oscilloscope', audioContext = new window.AudioContext(), source) {

  console.log('waveform init');

  this.analyser = {
    instance: null,
    dataArray: [],
    timeData: [],
    frequencyData: []
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
  this.analyser.timeData = new Uint8Array(bufferLength);
  this.analyser.frequencyData = new Uint8Array(bufferLength);

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

  this.display.canvasContext.fillStyle = 'rgb(200, 200, 200)';
  this.display.canvasContext.fillRect(0, 0, this.display.width, this.display.height);

  this.drawFrequencyDomain();
  this.drawTimeDomain();
}

waveformDisplay.prototype.drawTimeDomain = function () {
  this.analyser.instance.getByteTimeDomainData(this.analyser.timeData);

  this.analyser.timeData.forEach((currentValue, bin) => {
    let percent = currentValue / 256;
    let height = this.display.height * percent;
    let offset = this.display.height - height - 1;
    let barWidth = this.display.width / this.analyser.instance.frequencyBinCount;
    let hue = bin / this.analyser.instance.frequencyBinCount * 360;
    this.display.canvasContext.fillStyle = `hsl(${hue}, 100%, 50%)`;
    this.display.canvasContext.fillRect(bin * barWidth, offset, barWidth, height);
  });
}

waveformDisplay.prototype.drawFrequencyDomain = function () {
  this.analyser.instance.getByteFrequencyData(this.analyser.frequencyData);

  this.analyser.frequencyData.forEach((currentValue, bin) => {
    let percent = currentValue / 256;
    let height = this.display.height * percent;
    let offset = this.display.height - height - 1;
    let barWidth = this.display.width / this.analyser.instance.frequencyBinCount;
    this.display.canvasContext.fillStyle = 'black';
    this.display.canvasContext.fillRect(bin * barWidth, offset, 1, 1);
  });
}

waveformDisplay.prototype.stopDrawing = function () {

}


function defaultOscillator(audioContext) {
  const osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1, audioContext.currentTime);
  osc.start();
  return osc;
}
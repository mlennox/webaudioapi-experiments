export function waveformDisplay({ canvasSelector = '.oscilloscope', audioContext = new window.AudioContext(), source } = {}) {

  console.log('waveform init');

  this.analyser = {
    instance: null,
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

  this.display.canvasContext.fillStyle = 'rgb(0,0,0)';
  this.display.canvasContext.fillRect(0, 0, this.display.width, this.display.height);

  // draw the frequency domain data
  this.drawData({
    dataType: 'frequency',
    colourFn: ({ traceDimensions }) => {
      const frequencyFill = this.display.canvasContext.createLinearGradient(0, 0, traceDimensions.width, this.display.height);
      frequencyFill.addColorStop(0.000, 'rgba(255, 255, 170, 1.000)');
      frequencyFill.addColorStop(1.0, 'rgba(186, 0, 0, 1.000)');

      return frequencyFill;
    },
    dimensionFn: (height, width) => {
      return {
        height,
        width
      }
    }
  });
  // draw the time domain data
  this.drawData();
}


waveformDisplay.prototype.drawData = function ({ dataType = 'time', colourFn = () => 'white', dimensionFn = (height, width) => { return { height: 1, width }; } } = {}) {

  let dataSource = this.analyser[`${dataType}Data`];

  this.analyser.instance[`getByte${dataType === 'time' ? 'TimeDomain' : 'Frequency'}Data`](dataSource);

  dataSource.forEach((currentValue, bin) => {
    let percent = currentValue / 256;
    let height = this.display.height * percent;
    let offset = this.display.height - height - 1;
    let barWidth = this.display.width / this.analyser.instance.frequencyBinCount;
    const traceDimensions = dimensionFn(height, barWidth);
    this.display.canvasContext.fillStyle = colourFn({ bin, frequencyBinCount: this.analyser.instance.frequencyBinCount, currentValue, traceDimensions })
    this.display.canvasContext.fillRect(bin * barWidth, offset, traceDimensions.width, traceDimensions.height);
  });
}

waveformDisplay.prototype.stopDrawing = function () {

}


function defaultOscillator(audioContext) {
  const osc = audioContext.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, audioContext.currentTime);
  osc.start();
  return osc;
}
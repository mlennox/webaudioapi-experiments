export function waveformDisplay(canvasSelector = '.oscilloscope', audioContext = window.audioContext, source) {

  this.analyser = {
    instance: null,
    dataArray: [],
    canvasContext: null,
    visualiser: null,
    width: 0,
    height: 0
  };

  this.audio = {
    context: audioContext
  }

  function initAnalyser() {
    this.analyser.instance = this.audio.context.createAnalyser();
    this.analyser.instance.fftSize = 2048;
    var bufferLength = this.analyser.instance.frequencyBinCount;
    this.analyser.dataArray = new Uint8Array(bufferLength);
  };

  function initCanvas() {
    var canvasContainer = document.querySelector(canvasSelector);
    this.analyser.width = canvasContainer.width;
    this.analyser.height = canvasContainer.height;
    this.analyser.canvasContext = canvasContainer.getContext('2d');
  }

  function defaultOscillator() {
    const osc = this.audio.context.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.audio.context.currentTime);
    osc.start();
    return osc;
  }

  function startDrawing() {

  }

  function stopDrawing() {

  }
  // source.connect(analyser);

}

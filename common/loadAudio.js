export function loadAudio({ fileName, audioContext = new window.AudioContext(), asRawAudio = false }) {

  this.audioContext = audioContext;
  this.asRawAudio = asRawAudio;

  this.req = new window.XMLHttpRequest();
  this.req.open("GET", fileName, true);
  this.req.responseType = "arraybuffer";

  return new Promise((resolve, reject) => {

    this.req.addEventListener('load', () => {
      this.onLoad(this.req.response).then(audio => {
        resolve(audio);
      });
    });
    this.req.addEventListener('error', function () { this.onError(reject) });
    this.req.send();

  });
  //   .finally(() => {
  //   // null out everything
  //   this.req = null;
  //   this.audioContext = null;
  // });
}

loadAudio.prototype.onLoad = function (response) {
  return new Promise(resolve => {
    this.audioContext.decodeAudioData(response, (audio) => {
      resolve(this.asRawAudio ? audio : this.asBufferSource(audio));
    });
  });
}



loadAudio.prototype.onError = function (reject) {
  // do we need to do anything here?
  reject('feck');
}

loadAudio.prototype.asBufferSource = function (audio) {
  const source = this.audioContext.createBufferSource();
  source.buffer = audio;
  source.loop = true;
  return source;
}
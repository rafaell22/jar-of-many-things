export default class Audio {
  /**
    * @param {string[]} tracks
    */
  constructor(tracks) {
    this.audioContext = new window.AudioContext();
    this.tracks = {};
    tracks.forEach(t => this.createAudio(t));
  }

  /**
    * @param {string} id
    */
  createAudio(id) {
    const elAudio = document.querySelector(`#${id}`);
    const track = this.audioContext.createMediaElementSource(elAudio);
    track.connect(this.audioContext.destination);
    this.tracks[id] = elAudio;
  }

  /**
    * @param {string} id
    */
  play(id) {
    this.tracks[id].play();
  }
}

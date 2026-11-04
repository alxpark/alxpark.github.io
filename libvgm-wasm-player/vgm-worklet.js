// AudioWorklet side of the libvgm player.
// libvgm itself runs on the main thread (it needs TextDecoder for Shift-JIS / CP1252 tags,
// which AudioWorkletGlobalScope does not provide). The main thread renders audio in chunks
// and transfers them here; this processor plays them from a small queue and asks for more
// whenever the queue drops below the target fill level.
class VGMProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    const o = (options && options.processorOptions) || {};
    this.target = o.target || 6144;   // frames to keep queued
    this.q = [];
    this.off = 0;
    this.buffered = 0;
    this.waiting = false;             // a "need" request is outstanding
    this.port.onmessage = (e) => {
      const d = e.data;
      if (d.type === "chunk") {
        this.q.push(d);
        this.buffered += d.L.length;
        this.waiting = false;
      } else if (d.type === "flush") {
        this.q = []; this.off = 0; this.buffered = 0; this.waiting = false;
      } else if (d.type === "kick") {
        this.waiting = false;
      }
    };
    this.port.postMessage({ type: "hello" });
  }

  process(inputs, outputs) {
    const out = outputs[0];
    const L = out[0], R = out[1] || out[0];
    let i = 0;
    while (i < L.length && this.q.length) {
      const c = this.q[0];
      const n = Math.min(L.length - i, c.L.length - this.off);
      if (n > 0) {
        L.set(c.L.subarray(this.off, this.off + n), i);
        R.set(c.R.subarray(this.off, this.off + n), i);
        i += n; this.off += n; this.buffered -= n;
      }
      if (this.off >= c.L.length) {
        this.q.shift();
        this.off = 0;
        this.port.postMessage({ type: c.end ? "ended" : "played", t: c.t });
      }
    }
    if (i < L.length) { L.fill(0, i); R.fill(0, i); }
    if (!this.waiting && this.buffered < this.target) {
      this.waiting = true;
      this.port.postMessage({ type: "need", frames: this.target * 2 - this.buffered });
    }
    return true;
  }
}
registerProcessor("vgm-processor", VGMProcessor);

// two main sources
// ----------------
// crossfade:
// https://p5js.org/reference/#/p5.Gain
// sound player:
// https://gist.github.com/s-shin/e63b54ea47b9364c829668cf79ca81c4

//------------------------------------------------------------------------------
// Modules
//------------------------------------------------------------------------------

class Settings {
  constructor(opts = { handler: {}, container: undefined }) {
    this._handler = opts.handler || {};
    const params = {};
    const pane = new Tweakpane({ title: "Settings", container: opts.container });
    this._pane = pane;
    const callHandler = name => {
      if (name in this._handler) {
        this._handler[name](this[name]);
      }
    };
    const addInput = (name, opts) => {
      params[name] = opts.default;
      this[name] = opts.filter ? opts.filter(params[name]) : params[name];
      pane.addInput(params, name, opts.attrs).on("change", () => {
        this[name] = opts.filter ? opts.filter(params[name]) : params[name];
        callHandler(name);
      });
    };
    const addButton = name => {
      pane.addButton({ title: name }).on("click", () => callHandler(name));
    };
    const addSeparator = () => pane.addSeparator();
    const keyMirror = ks => ks.reduce((p, c) => { p[c] = c; return p; }, {});
    const hundredth = v => v * 0.01;
    const color = chroma;
    addInput("frameRate", {
      default: 24,
      attrs: { min: 1, max: 60, step: 1 },
    });
    addInput("volume", {
      default: 75,
      attrs: { min: 0, max: 100, step: 1 },
      filter: hundredth,
    });
    addSeparator();
    addInput("peakFactor", {
      default: 4,
      attrs: { min: 1, max: 16, step: 1 },
    });
    addInput("peakNorm", {
      default: "avg",
      attrs: { options: keyMirror(["avg", "max"]) },
    });
    addSeparator();
    addInput("fftSmooth", {
      default: 70,
      attrs: { min: 1, max: 100, step: 1 },
      filter: hundredth,
    });
    addInput("fftBins", {
      default: 128,
      attrs: { options: keyMirror([16, 32, 64, 128, 256, 512, 1024]) },
    });
    addSeparator();
    addInput("amplitudeSmooth", {
      default: 95,
      attrs: { min: 0, max: 100, step: 1 },
      filter: hundredth,
    });
    addSeparator();
    addInput("color1a", {
      default: "#ffffff",
      filter: color,
    });
    addInput("color1b", {
      default: "#000000",
      filter: color,
    });
    addInput("mixFactor", {
      default: 1.25,
      attrs: { min: 0, max: 5 },
    });
    addInput("mixType", {
      default: "hsl",
      attrs: { options: keyMirror(["hsl", "lrgb", "lab", "rgb", "lch"]) },
    });
    addInput("color2a", {
      default: "#1f3d69",
      filter: color,
    });
    addInput("color2b", {
      default: "#5fffcf",
      filter: color,
    });
  }
  toggleVisibility() {
    const el = this._pane.element;
    el.style.display = el.style.display === "none" ? "block" : "none";
  }
}

class Message {
  constructor() {
    this.reset();
  }

  reset() {
    this.type = "";
    this.text = "";
    this.color = [];
  }

  info(text) {
    this.type = "info";
    this.text = text;
    this.color = [255, 255, 255];
  }

  error(text) {
    this.type = "error";
    this.text = text;
    this.color = [255, 0, 0];
  }
}

//------------------------------------------------------------------------------
// Main
//------------------------------------------------------------------------------

const ctx = {
  /**
   * @type Settings
   */
  settings: null,
  /**
   * @type Message
   */
  message: new Message(),
  sounds: [{
    /**
     * @type p5.SoundFile
     */
    sound: null,
    rawPeaks: null,
    peaks: null,
    /**
     * @type p5.FFT
     */
    fft: null,
    spectrum: null,
    /**
     * @type p5.Amplitude
     */
    amplitude: null,
    /**
     * @type p5.Gain
     */
    gain: null,
  },{
    /**
     * @type p5.SoundFile
     */
    sound: null,
    rawPeaks: null,
    peaks: null,
    /**
     * @type p5.FFT
     */
    fft: null,
    spectrum: null,
    /**
     * @type p5.Amplitude
     */
    amplitude: null,
    /**
     * @type p5.Gain
     */
    gain: null,
  }],
  /**
   * @type p5.Gain
   */
  mixGain: null,
  mixVolume: null,
  font: null,
  delay: null,
};

function normalizePeaks(rawPeaks, granularity, normalizer = "avg") {
  const normalizers = {
    avg: vs => vs.reduce((p, c) => p + c, 0) / vs.length,
    max: vs => Math.max(...vs),
  };
  const normalize = normalizers[normalizer];
  let srcPeaks = rawPeaks;
  let dstPeaks = new Float32Array(Math.ceil(srcPeaks.length / granularity));
  {
    let i;
    let vs = [];
    for (i = 0; i < srcPeaks.length; i++) {
      vs.push(srcPeaks[i]);
      if ((i + 1) % granularity === 0) {
        dstPeaks[Math.ceil(i / granularity)] = normalize(vs);
        vs = [];
      }
    }
    const n = (i + 1) % granularity;
    if (n !== 0) {
      dstPeaks[Math.ceil(i / granularity)] = normalize(vs);
    }
  }
  srcPeaks = dstPeaks;
  dstPeaks = null;
  {
    const max = srcPeaks.reduce((prev, v) => prev < v ? v : prev);
    dstPeaks = srcPeaks.map(v => v / max);
  }
  return dstPeaks;
}

function updatePeaks() {
  for (i in ctx.sounds) {
    if (!ctx.sounds[i].rawPeaks) {
      ctx.sounds[i].rawPeaks = ctx.sounds[i].sound.getPeaks(ctx.sounds[i].sound.duration() * 1000);
      // console.log('rawPeakspeaks done');
      continue;
    }
    ctx.sounds[i].peaks = normalizePeaks(
      ctx.sounds[i].rawPeaks,
      Math.floor(ctx.sounds[i].rawPeaks.length * ctx.settings.peakFactor / width),
      ctx.settings.peakNormalizer,
    );
  }
}

function updateSpectrum() {
  // NOTE: The length of the array returned by analyze is not always `numBins`
  // but the second argument of p5.FFT constructor.
  for (i in ctx.sounds) {
    if (!ctx.sounds[i].fft) {
      // console.log('no fft', i);
      ctx.sounds[i].fft = new p5.FFT(ctx.settings.fftSmooth);
      ctx.sounds[i].fft.setInput(ctx.sounds[i].sound);
      continue;
    }
    ctx.sounds[i].spectrum = ctx.sounds[i].fft.analyze(ctx.settings.numBins);
  }
}

// p5

function preload() {

  ctx.font = loadFont('../css/fonts/libertinus-mono/LibertinusMono-Regular.woff');
  fnames = ['voix-2.mp3', 'voix-1.mp3'];

  for (i in fnames) {
    ctx.sounds[i].sound = loadSound(fnames[i]);
  }

}

function setup() {

  ctx.settings = new Settings({
    handler: {
      frameRate: v => frameRate(v),
      volume: v => ctx.sounds.forEach(x => x.sound.setVolume(v)),
      fftSmooth: v => ctx.sounds.forEach((x) => {
        if (!x.fft) return;
        x.fft.smooth(v)
      }),
      peakFactor: () => updatePeaks(),
      peakNormalizer: () => updatePeaks(),
      amplitudeSmooth: v => ctx.sounds.forEach((x) => {
        if (!x.amplitude) return;
        x.amplitude.smooth(v);
      }),
    },
  });

  let cnv = createCanvas(windowWidth - 1, windowHeight - 5);

  // NOTE: Escape global `mousedClicked()` becuase it is emitted
  // even if `stopPropagation()` was called in overlay elements.
  cnv.mouseClicked(() => {
    const posY = mouseY / height;
    if (posY > 2/3) {
      if (ctx.sounds[0].sound.isPlaying()) {
        ctx.sounds.forEach(s => s.sound.pause());
        ctx.delay = 20;
      } else {
        ctx.sounds.forEach(s => s.sound.play());
      }
    } else if (posY > 1/3) {
      if (!ctx.sounds[0].sound.isPlaying()) ctx.sounds.forEach(s => s.sound.play());
      const posX = mouseX / width;
      ctx.sounds.forEach(s => s.sound.jump(s.sound.duration() * posX));
    } else {
      // map the horizontal position of the mouse to values useable for volume
      ctx.mixVolume = map(mouseX, 0, width, 0, 1);
      ctx.sounds[0].gain.amp(1 - ctx.mixVolume);
      ctx.sounds[1].gain.amp(ctx.mixVolume);
    }
  });

  // create a 'mix' gain bus to which we will connect both soundfiles
  ctx.mixGain = new p5.Gain();
  ctx.mixGain.connect();
  ctx.mixGain.amp(1);
  ctx.mixVolume = 0.5;
  ctx.delay = 0;

  ctx.sounds.forEach(s => {
    ctx.message.reset();
    s.sound.setVolume(ctx.settings.volume);
    s.rawPeaks = s.sound.getPeaks(s.sound.duration() * 1000);
    updatePeaks();
    s.fft = new p5.FFT(ctx.settings.fftSmooth);
    s.fft.setInput(s.sound);
    s.amplitude = new p5.Amplitude(ctx.settings.amplitudeSmooth);
    s.amplitude.setInput(s.sound);
    s.sound.disconnect(); // diconnect from p5 output
    s.gain = new p5.Gain(); // setup a gain node
    s.gain.setInput(s.sound); // connect the first sound to its input
    s.gain.connect(ctx.mixGain); // connect its output to the final mix bus
  });

  for (s of ctx.sounds) console.log(s);

  ctx.settings.toggleVisibility();
  textFont(ctx.font);

  // console.log(ctx.sounds[0].peaks.length, ctx.sounds[1].peaks.length);
  // console.log(ctx.sounds[0].sound.duration(), ctx.sounds[1].sound.duration());

  // less bins for mobile
  if (windowWidth < 600) {
    ctx.settings.fftBins = 64;
  }

}

function mouseDragged() {
  const posY = mouseY / height;
  if (posY < 1/3) {
    // map the horizontal position of the mouse to values useable for volume
    ctx.mixVolume = map(mouseX, 0, width, 0, 1);
    ctx.sounds[0].gain.amp(1 - ctx.mixVolume);
    ctx.sounds[1].gain.amp(ctx.mixVolume);
  }
}

function windowResized() {
  resizeCanvas(windowWidth - 1, windowHeight - 20);
  renderPeaks();
  // less bins for mobile
  if (windowWidth < 600) {
    ctx.settings.fftBins = 64;
  } else {
    ctx.settings.fftBins = 128;
  }
}

function keyPressed() {

  const key = c => c.charCodeAt(0);
  const handlers = [
    {
      cond: () => true,
      onKey: {
        [key("Z")]: () => ctx.settings.toggleVisibility(),
      },
    },
    {
      cond: () => true,
      onKey: {
        [key(" ")]: () => {
          if (ctx.sounds[0].sound.isPlaying()) {
            ctx.sounds.forEach(s => s.sound.pause());
            ctx.delay = 20;
          } else {
            ctx.sounds.forEach(s => s.sound.play());
          }
        },
      },
    },
    {
      cond: () => ctx.sounds[0].sound.isPlaying(),
      onKey: {
        [RIGHT_ARROW]: () => ctx.sounds.forEach(s => s.sound.jump(s.sound.currentTime() + 5)),
        [LEFT_ARROW]: () => ctx.sounds.forEach(s => s.sound.jump(s.sound.currentTime() - 5)),
      },
    },
  ];
  for (const h of handlers) {
    if (h.cond()) {
      const fn = h.onKey[keyCode];
      if (fn) {
        fn();
        return;
      }
    }
  }
}

function renderBackground() {
  if (!ctx.sounds[0].amplitude) return;
  const color = chroma.mix(
    ctx.settings.color1a,
    ctx.settings.color1b,
    Math.min(ctx.sounds[0].amplitude.getLevel() / ctx.sounds[0].sound.getVolume() * ctx.settings.mixFactor, 1),
    ctx.settings.mixType,
  );
  background(color.rgb());
}

function renderPeaks() {
  if (!ctx.sounds[0].peaks && !ctx.sounds[1].peaks) return;
  const pos = ctx.sounds[0].sound.currentTime() / ctx.sounds[0].sound.duration() * ctx.sounds[0].peaks.length;
  const w = width / ctx.sounds[0].peaks.length;
  const barWidth = w * 0.8;
  const maxRectHeight = height * 1/3 * 1/4;
  rectMode(CORNER);
  noStroke();
  ctx.sounds.forEach((s, i) => {
    let baseY;
    if (i == 0) {
      baseY = height * 1/3 + maxRectHeight * 1.5;
    } else {
      baseY = height * 1/3 + maxRectHeight * 3;
    }
    s.peaks.forEach((peak, j) => {
      const color = (j - pos < 0) ? ctx.settings.color2b : ctx.settings.color2a;
      const x = w * j;
      const h = Math.max(maxRectHeight * peak, 0.5);
      fill(color.rgb(), 230);
      rect(x, baseY - h, barWidth, h);
      fill(color.rgb(), 160);
      rect(x, baseY, barWidth, h * 0.5);
    }, this);
  });
  // area separators
  stroke(ctx.settings.color1b.rgb());
  line(0, height * 1/3, width, height * 1/3);
  line(0, height * 2/3, width, height * 2/3);
}

function renderSpectrum() {
  ctx.sounds.forEach((s, i) => {
    if (!s.spectrum) {
      updateSpectrum();
      return;
    }
    // console.log('rendering spectrum');
    const numBins = ctx.settings.fftBins;
    const w = width / numBins;
    const barWidth = w * 0.9;
    const maxRectHeight = height * 1/3 * 1/2;
    let baseY
    if (i == 0) {
      baseY = height;
    } else {
      baseY = height - maxRectHeight;
    }
    rectMode(CORNER);
    noStroke();
    const color = ctx.settings.color2a;
    fill(color.rgb(), 230);
    s.spectrum.forEach((sp, j) => {
      const x = w * j;
      const h = maxRectHeight * sp / 255;
      rect(x, baseY - h, barWidth, h);
    });
  });
}

function renderMessage() {
  if (ctx.message.type === "") {
    return;
  }
  textSize(15);
  fill(ctx.message.color);
  text(`${ctx.message.type.toUpperCase()}: ${ctx.message.text}`, 10, 10, width - 10, height - 10);
}

function renderPlayPositionIndicator() {
  const posY = mouseY / height;
  if (posY > 1/3 && posY < 2/3) {
    noStroke();
    rectMode(CORNER);
    fill(ctx.settings.color1b.rgb(), 100);
    const margin = 10;
    rect(mouseX, height * 1/3 + margin, 1, height * 1/3 - margin * 2);
  }
}

function renderCrossFade() {
  fill(ctx.settings.color1b.rgb());
  textSize(15);
  textAlign(LEFT);
  text('voix 1 ←', 10, height * 1/6 - 10 - textDescent());
  const t2 = '→ voix 2';
  text(t2, width - textWidth(t2) - 10, height * 1/6 + 10 + textAscent());
  stroke(ctx.settings.color1b.rgb());
  const margin = 10;
  line(margin, height * 1/6, width - margin, height * 1/6);
  // console.log(ctx.mixVolume, (width - margin * 2) * ctx.mixVolume);
  fill(ctx.settings.color1a.rgb());
  circle(constrain(width * ctx.mixVolume, margin, width - margin), height * 1/6, 10);
}

function renderPlayButton() {
  if (!ctx.sounds[0].sound.isPlaying() && ctx.delay == 0) {
    push();
    noFill();
    stroke(ctx.settings.color1b.rgb());
    strokeWeight(3);
    strokeJoin(ROUND);
    // line(width/2, height * 2/3, width/2, height);
    triangle(width/2 - height * 1/18, height * 2/3 + height * 1/9, width/2 + height * 1/18, height * 2/3 + height * 1/6, width/2 - height * 1/18, height * 2/3 + height * 2/9);
    pop();
  }
}

function draw() {
  updateSpectrum();
  renderBackground();
  renderPeaks();
  renderSpectrum();
  renderMessage();
  renderPlayPositionIndicator();
  renderCrossFade();
  renderPlayButton();
  if (ctx.delay > 0) ctx.delay -= 1;
}

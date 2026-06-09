/* Drum Pattern Generator Engine v3.0
 * Research-backed generative drum pattern system for Squarp Hapax
 *
 * v3.0 KEY CHANGE: Category-based lane system
 * - Lanes are user-configurable (any name, any MIDI note)
 * - Generator uses CATEGORIES to determine behavior, not hardcoded names
 * - "tom_hi" can be a "ride", "tom_low" can be a "stab", whatever you want
 *
 * Categories define BEHAVIOR:
 * - foundation: always active, 4-on-the-floor (kick, sub, bass)
 * - backbeat: beats 2 & 4 (snare, clap, rim)
 * - hihat: rhythmic high-frequency (closed HH, open HH, ride)
 * - accent: occasional hits (perc, cowbell, stab, zap)
 * - metallic: sustained metallic (ride, crash, cymbal)
 * - texture: subtle layering (shaker, tambourine, maracas)
 * - pitched: tonal percussion (tom, conga, bongo, tablas)
 * - synth: synthetic accents (stab, zap, laser, glitch)
 *
 * 12 styles from 5 YouTube videos
 */

// ─── CATEGORIES ───────────────────────────────────────────────

const CATEGORIES = {
  foundation:  { label: "Foundation",  desc: "Low-frequency anchor",          activation: "always" },
  backbeat:    { label: "Backbeat",    desc: "Accent on beats 2 & 4",         activation: "style-dependent" },
  hihat:       { label: "Hi-Hat",      desc: "High-frequency rhythmic",       activation: "almost-always" },
  accent:      { label: "Accent",      desc: "Occasional hits",               activation: "probabilistic" },
  metallic:    { label: "Metallic",    desc: "Sustained metallic (ride/crash)", activation: "style-dependent" },
  texture:     { label: "Texture",     desc: "Subtle layering (shaker)",       activation: "probabilistic" },
  pitched:     { label: "Pitched",     desc: "Tonal percussion (tom/conga)",   activation: "probabilistic" },
  synth:       { label: "Synth",       desc: "Synthetic accents (stab/zap)",   activation: "accent" },
};

// ─── SOUND PRESETS ────────────────────────────────────────────

const SOUND_PRESETS = [
  // Foundation
  { name: "Kick",        category: "foundation", midiNote: 36, desc: "Bass drum" },
  { name: "Sub Kick",    category: "foundation", midiNote: 35, desc: "Deep sub bass" },
  // Backbeat
  { name: "Snare",       category: "backbeat",   midiNote: 38, desc: "Snare drum" },
  { name: "Clap",        category: "backbeat",   midiNote: 39, desc: "Hand clap" },
  { name: "Rimshot",     category: "backbeat",   midiNote: 37, desc: "Rim click" },
  // Hi-Hat
  { name: "HH Closed",   category: "hihat",      midiNote: 42, desc: "Closed hi-hat" },
  { name: "HH Open",     category: "hihat",      midiNote: 46, desc: "Open hi-hat" },
  { name: "Ride",        category: "hihat",      midiNote: 51, desc: "Ride cymbal" },
  { name: "Crash",       category: "hihat",      midiNote: 49, desc: "Crash cymbal" },
  // Accent
  { name: "Perc",        category: "accent",     midiNote: 56, desc: "Cowbell / metallic" },
  { name: "Clave",       category: "accent",     midiNote: 75, desc: "Clave block" },
  { name: "Shaker",      category: "accent",     midiNote: 70, desc: "Maracas / shaker" },
  // Metallic
  { name: "Ride Bell",   category: "metallic",   midiNote: 53, desc: "Ride bell" },
  { name: "China",       category: "metallic",   midiNote: 52, desc: "China cymbal" },
  { name: "Splash",      category: "metallic",   midiNote: 55, desc: "Splash cymbal" },
  // Texture
  { name: "Tambourine",  category: "texture",    midiNote: 54, desc: "Tambourine" },
  { name: "Tribal Hit",  category: "texture",    midiNote: 67, desc: "High agogô" },
  // Pitched
  { name: "Tom Hi",      category: "pitched",    midiNote: 50, desc: "High tom" },
  { name: "Tom Mid",     category: "pitched",    midiNote: 47, desc: "Mid tom" },
  { name: "Tom Low",     category: "pitched",    midiNote: 41, desc: "Floor tom" },
  { name: "Conga Hi",    category: "pitched",    midiNote: 63, desc: "Conga slap" },
  { name: "Conga Low",   category: "pitched",    midiNote: 64, desc: "Conga open" },
  { name: "Bongo Hi",    category: "pitched",    midiNote: 60, desc: "Bongo high" },
  { name: "Bongo Low",   category: "pitched",    midiNote: 61, desc: "Bongo low" },
  // Synth
  { name: "Stab",        category: "synth",      midiNote: 80, desc: "Synth stab" },
  { name: "Zap",         category: "synth",      midiNote: 81, desc: "Synth zap" },
  { name: "Glitch",      category: "synth",      midiNote: 82, desc: "Glitch hit" },
  { name: "Laser",       category: "synth",      midiNote: 83, desc: "Laser zap" },
];

// ─── DEFAULT LANE CONFIG (8 Hapax lanes) ──────────────────────

const DEFAULT_LANES = [
  // Hapax drum track order: Lane 1 = Kick (bottom of grid)
  { name: "Kick",        category: "foundation", midiNote: 36 },
  { name: "Snare",       category: "backbeat",   midiNote: 38 },
  { name: "HH Closed",   category: "hihat",      midiNote: 42 },
  { name: "HH Open",     category: "hihat",      midiNote: 46 },
  { name: "Tom Low",     category: "pitched",    midiNote: 41 },
  { name: "Tom Hi",      category: "pitched",    midiNote: 50 },
  { name: "Clap",        category: "backbeat",   midiNote: 39 },
  { name: "Perc",        category: "accent",     midiNote: 56 },
];

// ─── CHARACTERISTIC PRESETS ───────────────────────────────────

const CHARACTERISTIC_PRESETS = {
  hypnotic:     { label: "Hypnotic",     desc: "Repetitive, trance-like, minimal" },
  minimal:      { label: "Minimal",      desc: "Sparse, space between hits" },
  groove:       { label: "Groove",       desc: "Swing, shuffle, bounce, crescendo" },
  polyrhythmic: { label: "Polyrhythmic", desc: "3:4, 5:4 tension" },
  sparse:       { label: "Sparse",       desc: "Very few events, breathing room" },
  dense:        { label: "Dense",        desc: "Full, driving, energy" },
  syncopated:   { label: "Syncopated",   desc: "Off-beat emphasis" },
  textural:     { label: "Textural",     desc: "Ghost notes, subtle dynamics" },
  tribal:       { label: "Tribal",       desc: "Tresillo, clave, bell, shamanic" },
  hardgroove:   { label: "Hardgroove",   desc: "138+ BPM, conga, Latin, ride" },
  humanized:    { label: "Humanized",    desc: "Probability, microtiming, velocity variation" },
  dynamic:      { label: "Dynamic",      desc: "Fullness & emptiness, build & release" },
};

// ─── PRIMITIVES ───────────────────────────────────────────────

const PRIMITIVES = {
  four_on_floor: [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
  binary:        [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  sixteenth:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
  offbeat:       [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0],
  sparse:        [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  sparse2:       [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0],
  accent:        [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0],
  // Tribal
  tresillo:      [1,0,0, 1,0,0, 1,0,0, 0,0,0, 0,0,0, 0],
  clave_3_2:     [1,0,0,0, 0,1,0,0, 0,0,0,0, 1,0,0,0, 0,0,1,0, 0,0,0,0],
  bell_12_8:     [1,0,1,0, 1,0,1,0, 1,0,1,0, 0,0,0,0],
  shamanic:      [1,0,0,1, 0,0,1,0, 0,1,0,0, 1,0,0,0],
};

// ─── SEEDED RNG ───────────────────────────────────────────────

class SeededRNG {
  constructor(seed) { this.seed = seed || Date.now(); }
  next() {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
  randInt(min, max) { return Math.floor(this.next() * (max - min + 1)) + min; }
  choice(arr) { return arr[Math.floor(this.next() * arr.length)]; }
  sample(arr, n) {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < Math.min(n, copy.length); i++) {
      const idx = Math.floor(this.next() * copy.length);
      result.push(copy.splice(idx, 1)[0]);
    }
    return result;
  }
}

// ─── UTILITY ──────────────────────────────────────────────────

function calculateSyncopation(steps) {
  let totalWeight = 0, maxWeight = 0;
  for (let i = 0; i < steps.length; i++) {
    const w = i % 4 === 0 ? 3 : i % 4 === 2 ? 2 : 1;
    maxWeight += w;
    if (steps[i]) totalWeight += w;
  }
  return maxWeight > 0 ? totalWeight / maxWeight : 0;
}

function calculateEventDensity(steps) {
  return steps.length > 0 ? steps.reduce((a, b) => a + b, 0) / steps.length : 0;
}

function inferCharacteristics(pattern) {
  const chars = [];
  const allSteps = Object.values(pattern.steps).flat();
  if (!allSteps.length) return ["empty"];
  const density = calculateEventDensity(allSteps);
  if (density <= 0.125) chars.push("minimal");
  else if (density <= 0.25) chars.push("sparse");
  else if (density >= 0.625) chars.push("dense");

  const foundationLane = pattern.lanes.find(l => l.category === "foundation");
  if (foundationLane) {
    const steps = pattern.steps[foundationLane.name] || [];
    const sync = calculateSyncopation(steps);
    if (sync > 0.5) chars.push("syncopated");
  }

  if (pattern.bars >= 2) chars.push("hypnotic");

  for (const lane of pattern.lanes) {
    const vel = pattern.velocity[lane.name] || [];
    const ghosts = vel.filter(v => v > 0 && v < 60).length;
    if (ghosts >= 2) { chars.push("ghost_notes"); chars.push("textural"); break; }
  }

  const hasSwing = Object.values(pattern.microtiming).some(arr => arr.some(v => v !== 0));
  if (hasSwing) chars.push("groove");

  return chars.length ? chars : ["standard"];
}

// ─── ACTIVE LANE SELECTION (CATEGORY-BASED) ──────────────────

function getActiveLanes(lanes, characteristics, rng) {
  const active = [];

  for (const lane of lanes) {
    const cat = CATEGORIES[lane.category];
    if (!cat) { active.push(lane); continue; } // Unknown category → include anyway

    switch (cat.activation) {
      case "always":
        // Foundation: ALWAYS active
        active.push(lane);
        break;

      case "almost-always":
        // HiHat: active in most styles
        active.push(lane);
        break;

      case "style-dependent":
        // Backbeat, metallic: depends on style
        if (lane.category === "backbeat") {
          if (characteristics.includes("groove") && rng.next() < 0.6) active.push(lane);
          else if (characteristics.includes("dense") && rng.next() < 0.4) active.push(lane);
          else if (characteristics.includes("hardgroove") && rng.next() < 0.5) active.push(lane);
          else if (characteristics.includes("tribal") && rng.next() < 0.4) active.push(lane);
          else if (rng.next() < 0.15) active.push(lane);
        }
        if (lane.category === "metallic") {
          if (characteristics.includes("hardgroove") || characteristics.includes("groove") || rng.next() < 0.3) {
            active.push(lane);
          }
        }
        break;

      case "probabilistic":
        // Accent, texture, pitched: probabilistic
        if (lane.category === "accent") {
          if (characteristics.includes("textural") || characteristics.includes("groove") ||
              characteristics.includes("tribal") || characteristics.includes("hardgroove") ||
              rng.next() < 0.4) active.push(lane);
        }
        if (lane.category === "texture") {
          if (characteristics.includes("textural") || characteristics.includes("tribal") || rng.next() < 0.3) active.push(lane);
        }
        if (lane.category === "pitched") {
          if (characteristics.includes("tribal") && rng.next() < 0.7) active.push(lane);
          else if (characteristics.includes("dense") && rng.next() < 0.5) active.push(lane);
          else if (characteristics.includes("hardgroove") && rng.next() < 0.4) active.push(lane);
          else if (rng.next() < 0.2) active.push(lane);
        }
        break;

      case "accent":
        // Synth: rare accent
        if (rng.next() < 0.15) active.push(lane);
        break;
    }
  }

  // Ensure at least foundation + one rhythmic element
  const hasFoundation = active.some(l => l.category === "foundation");
  if (!hasFoundation) {
    const fb = lanes.find(l => l.category === "foundation");
    if (fb) active.push(fb);
  }

  return active;
}

// ─── PATTERN SELECTION (CATEGORY-BASED) ───────────────────────

function selectPattern(lane, characteristics, intensity, rng) {
  const cat = lane.category;

  // FOUNDATION = 4-on-the-floor
  if (cat === "foundation") {
    return [...PRIMITIVES.four_on_floor];
  }

  // HIHAT (includes ride)
  if (cat === "hihat") {
    const isOpen = lane.name.toLowerCase().includes("open");
    const isRide = lane.name.toLowerCase().includes("ride");
    const isCrash = lane.name.toLowerCase().includes("crash");

    if (isOpen || isCrash) {
      if (intensity < 0.4) return [...PRIMITIVES.sparse];
      return [...PRIMITIVES.sparse2];
    }
    if (isRide) {
      // Ride: similar to closed hihat but can be sparser
      if (characteristics.includes("hardgroove")) return [...PRIMITIVES.sixteenth];
      return [...PRIMITIVES.binary];
    }
    // Closed hihat
    if (characteristics.includes("tribal")) return [...PRIMITIVES.bell_12_8];
    if (characteristics.includes("hardgroove")) return [...PRIMITIVES.sixteenth];
    if (characteristics.includes("hypnotic") || characteristics.includes("minimal")) return [...PRIMITIVES.binary];
    if (intensity > 0.6) return [...PRIMITIVES.sixteenth];
    return [...PRIMITIVES.binary];
  }

  // BACKBEAT (snare, clap, rimshot)
  if (cat === "backbeat") {
    if (characteristics.includes("groove")) return [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0];
    return [...PRIMITIVES.sparse2];
  }

  // ACCENT (perc, cowbell, clave, shaker)
  if (cat === "accent") {
    if (characteristics.includes("tribal")) return [1,0,0,1, 0,0,1,0, 0,0,0,0, 1,0,0,0];
    if (characteristics.includes("hardgroove")) return [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,0,1,0];
    if (characteristics.includes("groove")) return [...PRIMITIVES.offbeat];
    return [...PRIMITIVES.sparse2];
  }

  // METALLIC (ride bell, china, splash)
  if (cat === "metallic") {
    if (characteristics.includes("hardgroove")) return [...PRIMITIVES.binary];
    return [...PRIMITIVES.sparse];
  }

  // TEXTURE (shaker, tambourine)
  if (cat === "texture") {
    if (characteristics.includes("tribal")) return [...PRIMITIVES.offbeat];
    return [...PRIMITIVES.sparse2];
  }

  // PITCHED (toms, conga, bongo)
  if (cat === "pitched") {
    if (characteristics.includes("tribal")) return [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,1,0,0];
    return [...PRIMITIVES.sparse];
  }

  // SYNTH (stab, zap, glitch, laser)
  if (cat === "synth") {
    return [...PRIMITIVES.sparse];
  }

  return [...PRIMITIVES.sparse];
}

// ─── PATTERN GENERATOR ────────────────────────────────────────

function generatePattern(params) {
  const {
    intensity = 0.5,
    syncopation = 0.3,
    swingRatio = 0.5,
    polyrhythmic = false,
    characteristics = ["hypnotic"],
    lanes = DEFAULT_LANES,
    seed = null,
    bars: barsOverride = null,
  } = params;

  const rng = new SeededRNG(seed);

  // Determine bars
  let bars;
  if (barsOverride !== null && barsOverride > 0) {
    bars = barsOverride;
  } else if (polyrhythmic) {
    bars = rng.choice([3, 4, 6]);
  } else if (intensity < 0.2) {
    bars = rng.choice([1, 2]);
  } else if (intensity < 0.4) {
    bars = rng.choice([2, 4]);
  } else if (intensity < 0.6) {
    bars = rng.choice([4, 8]);
  } else if (intensity < 0.8) {
    bars = rng.choice([4, 8, 16]);
  } else {
    bars = rng.choice([8, 16]);
  }

  const stepsPerBar = 16;
  const totalSteps = bars * stepsPerBar;
  const steps = {}, velocity = {}, microtiming = {};

  // Get active lanes based on categories + style
  const activeLanes = getActiveLanes(lanes, characteristics, rng);

  for (const lane of lanes) {
    const isActive = activeLanes.includes(lane);

    if (!isActive) {
      steps[lane.name] = new Array(totalSteps).fill(0);
      velocity[lane.name] = new Array(totalSteps).fill(0);
      microtiming[lane.name] = new Array(totalSteps).fill(0);
      continue;
    }

    // Select pattern based on category + style
    let base = selectPattern(lane, characteristics, intensity, rng);
    while (base.length < 16) base.push(0);
    base = base.slice(0, 16);

    // Extend to multi-bar with evolution
    let pattern = [];
    for (let bar = 0; bar < bars; bar++) {
      let barPat = [...base];
      if (bar > 0 && intensity > 0.4 && rng.next() < 0.25) {
        const idx = rng.randInt(0, 15);
        if (barPat[idx] === 0) barPat[idx] = 1;
      }
      if (bar === bars - 1 && bars >= 2 && rng.next() < 0.3) {
        const active = barPat.map((v, i) => v === 1 ? i : -1).filter(i => i >= 0);
        if (active.length > 1) barPat[rng.choice(active)] = 0;
      }
      pattern.push(...barPat);
    }

    // Syncopation (not for foundation)
    if (lane.category !== "foundation") {
      const offbeats = [];
      for (let i = 0; i < pattern.length; i++) if (i % 2 === 1) offbeats.push(i);
      const currentOff = offbeats.filter(i => pattern[i] === 1).length;
      const targetOff = Math.floor(syncopation * offbeats.length * 0.5);
      const deficit = targetOff - currentOff;
      if (deficit > 0) {
        const available = offbeats.filter(i => pattern[i] === 0);
        const toAdd = rng.sample(available, Math.min(deficit, available.length));
        for (const i of toAdd) pattern[i] = 1;
      }
    }

    // Velocity
    const vel = new Array(totalSteps).fill(0);
    for (let i = 0; i < pattern.length; i++) {
      if (!pattern[i]) continue;
      const pos = i % 16;
      let v = pos % 4 === 0 ? 100 : pos % 4 === 2 ? 90 : 75;
      if (lane.category === "hihat") v = Math.floor(v * 0.75);
      else if (lane.category === "foundation") v = 100;
      else if (lane.category === "accent") v = rng.randInt(60, 90);
      else if (lane.category === "synth") v = rng.randInt(70, 100);
      vel[i] = v;
    }

    // Ghost notes
    if (characteristics.includes("textural") && intensity > 0.4) {
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 0 && rng.next() < 0.08 * intensity) {
          const neighbors = [];
          if (i > 0) neighbors.push(pattern[i - 1]);
          if (i < pattern.length - 1) neighbors.push(pattern[i + 1]);
          if (neighbors.some(n => n === 1)) {
            vel[i] = rng.randInt(25, 45);
            pattern[i] = 1;
          }
        }
      }
    }

    // Microtiming
    const mt = new Array(totalSteps).fill(0);
    if (swingRatio > 0.5 || characteristics.includes("groove")) {
      const swing = Math.max(swingRatio, characteristics.includes("groove") ? 0.58 : 0.5);
      const maxOffset = Math.min(50, Math.floor(240 * (swing * 100 - 50) / 25));
      for (let i = 0; i < pattern.length; i++) {
        if (pattern[i] === 1 && i % 2 === 1) mt[i] = rng.randInt(3, maxOffset);
        else if (pattern[i] === 1 && i % 2 === 0) mt[i] = rng.randInt(-2, 2);
      }
      if (lane.category === "foundation") {
        for (let i = 0; i < mt.length; i++) mt[i] = Math.floor(mt[i] * 0.3);
      }
    }

    steps[lane.name] = pattern;
    velocity[lane.name] = vel;
    microtiming[lane.name] = mt;
  }

  // Ensemble fix: no simultaneous open+closed hihat
  const ohLane = lanes.find(l => l.name.toLowerCase().includes("open") && l.category === "hihat");
  const chLane = lanes.find(l => l.name.toLowerCase().includes("closed") && l.category === "hihat");
  if (ohLane && chLane) {
    const oh = steps[ohLane.name] || [];
    const ch = steps[chLane.name] || [];
    for (let i = 0; i < Math.min(oh.length, ch.length); i++) {
      if (oh[i] === 1 && ch[i] === 1) {
        oh[i] = 0;
        velocity[ohLane.name][i] = 0;
      }
    }
  }

  const pattern = {
    name: generateName(intensity, syncopation, characteristics, rng),
    lanes, steps, velocity, microtiming, bars, stepsPerBar,
    intensity, syncopation, swingRatio,
    swingType: swingRatio > 0.5 ? "binary" : "none",
    characteristics,
  };
  pattern.characteristics = inferCharacteristics(pattern);

  return pattern;
}

function generateName(intensity, syncopation, characteristics, rng) {
  let prefix, suffix;
  if (characteristics.includes("hypnotic")) { prefix = "Hypnotic"; suffix = intensity < 0.4 ? "Pulse" : intensity < 0.7 ? "Drive" : "Rush"; }
  else if (characteristics.includes("minimal")) { prefix = "Minimal"; suffix = "Loop"; }
  else if (characteristics.includes("groove")) { prefix = "Groove"; suffix = syncopation > 0.5 ? "Swing" : "Bounce"; }
  else if (characteristics.includes("dense")) { prefix = "Dense"; suffix = "Energy"; }
  else if (characteristics.includes("tribal")) { prefix = "Tribal"; suffix = "Ritual"; }
  else if (characteristics.includes("hardgroove")) { prefix = "Hardgroove"; suffix = "Drive"; }
  else { prefix = intensity < 0.3 ? "Sparse" : intensity < 0.6 ? "Driving" : "Dense"; suffix = syncopation < 0.3 ? "Pulse" : syncopation < 0.6 ? "Groove" : "Tension"; }
  return `${prefix} ${suffix}`;
}

// ─── VARIATION ENGINE ─────────────────────────────────────────

function generateVariations(pattern, rng) {
  rng = rng || new SeededRNG();
  const variations = [];
  variations.push(generateDrop(pattern, rng));
  variations.push(generateFill(pattern, rng));
  if (pattern.bars >= 2) variations.push(generateBuildup(pattern, rng));
  if (pattern.bars >= 2) variations.push(generateBreak(pattern, rng));
  return variations;
}

function generateDrop(pattern, rng) {
  const steps = {}, velocity = {}, microtiming = {};
  let barStart, barEnd;
  if (pattern.bars >= 4) { barStart = rng.choice([0, Math.floor(pattern.bars / 2)]); barEnd = barStart + Math.floor(pattern.bars / 2); }
  else if (pattern.bars >= 2) { barStart = 0; barEnd = Math.floor(pattern.bars / 2); }
  else { barStart = 0; barEnd = 1; }

  for (const lane of pattern.lanes) {
    const srcS = pattern.steps[lane.name] || [];
    const srcV = pattern.velocity[lane.name] || [];
    const ns = [...srcS], nv = [...srcV];

    for (let i = 0; i < ns.length; i++) {
      const bar = Math.floor(i / pattern.stepsPerBar);
      const inDrop = bar >= barStart && bar < barEnd;
      if (inDrop) {
        if (lane.category === "foundation") { ns[i] = 0; nv[i] = 0; }
        if (lane.category === "hihat" && i % 2 === 1 && rng.next() < 0.4) { ns[i] = 0; nv[i] = 0; }
      } else { ns[i] = 0; nv[i] = 0; }
    }
    steps[lane.name] = ns;
    velocity[lane.name] = nv;
    microtiming[lane.name] = [...(pattern.microtiming[lane.name] || [])];
  }
  return { name: "Drop", type: "drop", description: `Foundation removed, hihat thinned. Bars ${barStart+1}-${barEnd}.`, steps, velocity, microtiming, bars: pattern.bars, barStart, barEnd };
}

function generateBuildup(pattern, rng) {
  const steps = {}, velocity = {}, microtiming = {};
  const buildupStart = Math.max(0, pattern.bars - 2);

  for (const lane of pattern.lanes) {
    const srcS = [...(pattern.steps[lane.name] || [])];
    const srcV = [...(pattern.velocity[lane.name] || [])];
    const ns = [...srcS], nv = [...srcV];

    for (let i = 0; i < ns.length; i++) {
      const bar = Math.floor(i / pattern.stepsPerBar);
      if (bar >= buildupStart) {
        const posInBuild = i - buildupStart * pattern.stepsPerBar;
        const buildLen = (pattern.bars - buildupStart) * pattern.stepsPerBar;
        const progress = posInBuild / buildLen;

        if (lane.category === "hihat" && ns[i] === 0 && progress > 0.3 && rng.next() < progress * 0.5) {
          ns[i] = 1; nv[i] = Math.floor(60 + progress * 40);
        }
        if (lane.category === "pitched" && ns[i] === 0 && progress > 0.5 && rng.next() < progress * 0.3) {
          ns[i] = 1; nv[i] = Math.floor(50 + progress * 50);
        }
        if (ns[i] === 1 && nv[i] > 0) nv[i] = Math.min(127, nv[i] + Math.floor(progress * 15));
      }
    }
    steps[lane.name] = ns;
    velocity[lane.name] = nv;
    microtiming[lane.name] = [...(pattern.microtiming[lane.name] || [])];
  }
  return { name: "Buildup", type: "buildup", description: `Density increase. Bars ${buildupStart+1}-${pattern.bars}.`, steps, velocity, microtiming, bars: pattern.bars, barStart: buildupStart, barEnd: pattern.bars };
}

function generateFill(pattern, rng) {
  const steps = {}, velocity = {}, microtiming = {};
  const fillBar = pattern.bars - 1;
  const fillStart = fillBar * pattern.stepsPerBar;

  for (const lane of pattern.lanes) {
    const srcS = [...(pattern.steps[lane.name] || [])];
    const srcV = [...(pattern.velocity[lane.name] || [])];
    const ns = [...srcS], nv = [...srcV];

    if (lane.category === "foundation") {
      for (const pos of [10, 13]) { const i = fillStart + pos; if (i < ns.length && rng.next() < 0.5) { ns[i] = 1; nv[i] = 90; } }
    }
    if (lane.category === "hihat") {
      for (const pos of [6, 14]) { const i = fillStart + pos; if (i < ns.length && rng.next() < 0.6) { ns[i] = 1; nv[i] = 85; } }
    }
    if (lane.category === "accent" || lane.category === "pitched") {
      for (let i = fillStart + 8; i < Math.min(fillStart + 16, ns.length); i++) {
        if (rng.next() < 0.3) { ns[i] = 1; nv[i] = rng.randInt(50, 80); }
      }
    }
    steps[lane.name] = ns;
    velocity[lane.name] = nv;
    microtiming[lane.name] = [...(pattern.microtiming[lane.name] || [])];
  }
  return { name: "Fill", type: "fill", description: `Syncopation, accents. Bar ${fillBar+1}.`, steps, velocity, microtiming, bars: pattern.bars, barStart: fillBar, barEnd: pattern.bars };
}

function generateBreak(pattern, rng) {
  const steps = {}, velocity = {}, microtiming = {};
  let breakStart, breakEnd;
  if (pattern.bars >= 4) { breakStart = Math.floor(pattern.bars / 4); breakEnd = Math.floor(pattern.bars * 3 / 4); }
  else { breakStart = 0; breakEnd = Math.floor(pattern.bars / 2); }

  for (const lane of pattern.lanes) {
    const srcS = [...(pattern.steps[lane.name] || [])];
    const srcV = [...(pattern.velocity[lane.name] || [])];
    const ns = [...srcS], nv = [...srcV];

    for (let i = 0; i < ns.length; i++) {
      const bar = Math.floor(i / pattern.stepsPerBar);
      if (bar >= breakStart && bar < breakEnd) {
        if (lane.category === "foundation") {
          if (i % 8 !== 0) { ns[i] = 0; nv[i] = 0; }
        } else if (lane.category !== "hihat") {
          ns[i] = 0; nv[i] = 0;
        }
      }
    }
    steps[lane.name] = ns;
    velocity[lane.name] = nv;
    microtiming[lane.name] = [...(pattern.microtiming[lane.name] || [])];
  }
  return { name: "Break", type: "break", description: `Foundation reduced, only hihat. Bars ${breakStart+1}-${breakEnd}.`, steps, velocity, microtiming, bars: pattern.bars, barStart: breakStart, barEnd: breakEnd };
}

// ─── MIDI EXPORT ──────────────────────────────────────────────

function exportMidi(patternData, variationData, name) {
  const PPQ = 960;
  const TICKS_PER_STEP = PPQ / 4;
  const GATE = TICKS_PER_STEP / 2;
  const data = variationData || patternData;
  const lanes = patternData.lanes;
  const events = [];

  for (const lane of lanes) {
    const st = (data.steps[lane.name] || []);
    const vel = (data.velocity[lane.name] || []);
    const mt = (data.microtiming[lane.name] || []);
    for (let i = 0; i < st.length; i++) {
      if (!st[i]) continue;
      const v = vel[i] || 100;
      if (v === 0) continue;
      const tick = Math.max(0, i * TICKS_PER_STEP + (mt[i] || 0));
      events.push({ tick, type: 'on', note: lane.midiNote, vel: v });
      events.push({ tick: tick + GATE, type: 'off', note: lane.midiNote, vel: 0 });
    }
  }

  events.sort((a, b) => a.tick - b.tick);
  const track = [];
  track.push(...encodeVarLen(0));
  track.push(0xFF, 0x51, 0x03);
  const tempo = Math.floor(60000000 / 130);
  track.push((tempo >> 16) & 0xFF, (tempo >> 8) & 0xFF, tempo & 0xFF);
  track.push(...encodeVarLen(0));
  track.push(0xFF, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08);

  let prevTick = 0;
  for (const ev of events) {
    const delta = ev.tick - prevTick;
    track.push(...encodeVarLen(delta));
    if (ev.type === 'on') track.push(0x90, ev.note & 0x7F, ev.vel & 0x7F);
    else track.push(0x80, ev.note & 0x7F, 0);
    prevTick = ev.tick;
  }
  track.push(...encodeVarLen(0));
  track.push(0xFF, 0x2F, 0x00);

  const header = [0x4D,0x54,0x68,0x64, 0,0,0,6, 0,0, 0,1, (PPQ>>8)&0xFF, PPQ&0xFF];
  const trackHeader = [0x4D,0x54,0x72,0x6B, (track.length>>24)&0xFF, (track.length>>16)&0xFF, (track.length>>8)&0xFF, track.length&0xFF];
  const midi = new Uint8Array(header.length + trackHeader.length + track.length);
  midi.set(header, 0);
  midi.set(trackHeader, header.length);
  midi.set(track, header.length + trackHeader.length);

  const blob = new Blob([midi], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name || 'pattern.mid';
  a.click();
  URL.revokeObjectURL(url);
}

function encodeVarLen(value) {
  if (value < 0) value = 0;
  const bytes = [];
  bytes.push(value & 0x7F);
  value >>= 7;
  while (value > 0) { bytes.push((value & 0x7F) | 0x80); value >>= 7; }
  return bytes.reverse();
}

// ─── EXPORT ───────────────────────────────────────────────────

window.DrumEngine = {
  CATEGORIES, SOUND_PRESETS, DEFAULT_LANES, CHARACTERISTIC_PRESETS, PRIMITIVES,
  generatePattern, generateVariations, exportMidi,
  calculateSyncopation, calculateEventDensity, inferCharacteristics,
};

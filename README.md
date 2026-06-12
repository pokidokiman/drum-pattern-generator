# Drum Pattern Generator v4.1.0

Drum pattern generator for **Squarp Hapax** — standalone HTML, no server, no dependencies.

## Features

### Hapax Page View
- **16-step viewport** — compact grid like the Hapax screen, one bar at a time
- **Bar navigation** — ◀ ▶ arrows or arrow keys to page between bars
- **Synced position** — bar position stays when switching between Base/Drop/Fill/etc.

### Pattern Engine
- **8 user-configurable lanes** — name, category, MIDI note, MIDI channel per lane
- **8 categories** — foundation, backbeat, hihat, accent, metallic, texture, pitched, synth
- **12 styles** — hypnotic, minimal, groove, polyrhythmic, sparse, dense, syncopated, textural, tribal, hardgroove, humanized, dynamic
- **Variation engine** — base pattern + drop, fill, buildup, break
- **Swing types** — shuffle (timing displacement) or straight+velocity (groove via dynamics)

### MIDI Export
- **960 PPQ** — Hapax native resolution
- **User-specified BPM** — slider 120-155 (not hardcoded)
- **Per-lane MIDI channels** — CH 1-16 per lane, routes to different Hapax outputs
- **Track name meta-event** — pattern name embedded in MIDI file
- **Format 0** — single track, Hapax drum import ready
- **Microtiming** — velocity and timing per step, respected in export

### Audio Playback
- **Web Audio drum synthesis** — preview before export, no samples needed
- **Play / Stop / Loop** — spacebar to toggle
- **Velocity-sensitive** — soft hits sound soft, accents are louder
- **Real-time position indicator** — shows current bar and step

### Workflow
- **Undo / Redo** — 50 levels, Ctrl+Z / Ctrl+Y
- **Save / Load** — localStorage, persists across sessions
- **Keyboard shortcuts** — ← → for bar nav, Space for play/stop

## Quick Start

Open `drum_pattern_generator.html` in any browser. No server needed.

1. Select style(s) — e.g. Hypnotic, Hardgroove, Tribal
2. Adjust intensity / syncopation / swing / BPM
3. Configure lanes (name, category, MIDI note, MIDI channel)
4. **GENERATE** → preview with ▶ PLAY → download MIDI files per variation

## Lane Categories

| Category | Behavior | Examples |
|----------|----------|---------|
| foundation | Always active, 4-on-the-floor | Kick, sub bass |
| backbeat | Style-dependent, beats 2 & 4 | Snare, clap, rimshot |
| hihat | Almost always active | Closed/open HH, ride, crash |
| accent | Probabilistic | Perc, cowbell, clave, shaker |
| metallic | Style-dependent | Ride bell, china, splash |
| texture | Probabilistic | Shaker, tambourine |
| pitched | Probabilistic | Toms, conga, bongo |
| synth | Rare accent | Stab, zap, glitch, laser |

## Presets

- **Default** — Classic 8-lane drum kit (Kick, Snare, HH Closed/Open, Tom, Clap, Perc)
- **Hypnotic Raw** — Ride, stab, standard kit
- **Hardgroove** — Ride, conga, shaker, Latin percussion
- **Tribal** — Bell, conga, toms, shaker
- **Industrial** — Stab, metal hit, rimshot

## Hapax Integration

- 960 PPQ (Hapax native resolution)
- MIDI notes: configurable per lane (default: 36=kick, 38=snare, 42=closed HH, 46=open HH, 41=low tom, 50=hi tom, 39=clap, 56=perc)
- Per-lane MIDI channel (1-16) — route different lanes to different Hapax outputs
- Import `.mid` into Hapax drum track → lowest note auto-maps to Lane 1
- User configures OUTPUT NOTE + CHANNEL per lane on Hapax side
- BPM in file matches the slider — but Hapax is always tempo master

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ← → | Navigate between bars |
| Space | Play / Stop |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |

## Project Structure

```
drum-pattern-generator/
├── drum_pattern_generator.html   ← standalone, browser-ready (no deps)
├── editor/
│   ├── engine.js                 ← 12 stijlen, alle YouTube data
│   └── index.html                ← dark theme UI
├── output/                       ← gegenereerde MIDI files
├── generate_test_midis.py        ← test MIDI generator
└── README.md
```

## YouTube Sources

1. **"5 Drum Patterns Every Hypnotic Techno Producer Should Learn"** — Tresillo, Clave, 12x8 Bell, Shamanic
2. **"Complete Guide to Techno Drums Pattern"** — Audioreakt — Kick patterns, hihat crescendo, clap backbeat
3. **"How to Make Hardgroove Techno Drum Pattern"** — midee + MusicRadar — Conga, shaker, Latin perc
4. **"Hi-Hat Humanizing & Variation Techniques"** — Drum Machine 101 — Probability, microtiming
5. **"10 Rules for Techno"** — Underdog (Oscar) — Fullness/emptiness, pulse as foundation

# Drum Pattern Generator v6.1.2

Drum pattern generator for **Squarp Hapax** — standalone HTML, no server, no dependencies.

## Features

### Hapax Page View
- **16-step viewport** — compact grid matching the Hapax screen, one bar at a time
- **Bar navigation** — ◀ ▶ arrows or arrow keys to page between bars
- **Synced position** — bar position stays when switching between Base/Drop/Fill/etc.
- **Per-lane colors** — Kick=red, Snare=green, HH Closed=yellow, HH Open=orange, Clap=pink, Tom=purple, Perc=teal

### Pattern Engine
- **8 user-configurable lanes** — name, category, MIDI note, MIDI channel per lane
- **8 categories** — foundation, backbeat, hihat, accent, metallic, texture, pitched, synth
- **12 styles** — hypnotic, minimal, groove, polyrhythmic, sparse, dense, syncopated, textural, tribal, hardgroove, humanized, dynamic
- **Style presets** — Default, Hypnotic Raw, Hardgroove, Tribal, Industrial (one-click lane + style setup)
- **Variation engine** — base pattern + drop, fill, buildup, break (standalone lengths)
- **Swing types** — shuffle (timing displacement) or straight+velocity (groove via dynamics)
- **Seed control** — reproducible RNG, leave empty for random
- **Characteristics** — select multiple per pattern (e.g. Hypnotic + Sparse + Textural)

### MIDI Export
- **960 PPQ** — Hapax native resolution
- **User-specified BPM** — slider 120-155 (not hardcoded)
- **Per-lane MIDI channels** — CH 1-16 per lane, routes to different Hapax outputs
- **Track name meta-event** — pattern name embedded in MIDI file
- **Format 0** — single track, Hapax drum import ready
- **Microtiming** — velocity and timing per step, respected in export
- **Per-variation export** — download individual .mid files per variation tab

### Audio Playback
- **Web Audio drum synthesis** — preview before export, no samples needed
- **Play / Stop / Loop** — spacebar to toggle play, loop button with visual indicator
- **Velocity-sensitive** — soft hits sound soft, accents are louder
- **Look-ahead scheduler** — gapless loop playback (50ms interval, 200ms look-ahead)
- **Auto-play on generate** — pattern plays immediately after generation
- **Tab switch audio** — switching variation tabs auto-switches audio playback

### Workflow
- **Undo / Redo** — 50 levels, Ctrl+Z / Ctrl+Y
- **Save / Load** — localStorage, persists across sessions
- **Dice rolls** — regenerate individual variation tabs with new random patterns
- **Keyboard shortcuts** — ← → for bar nav, Space for play/stop

## Quick Start

Open `drum_pattern_generator.html` in any browser. No server needed.

1. Select style(s) — e.g. Hypnotic, Hardgroove, Tribal
2. Select characteristics — e.g. Sparse, Textural, Syncopated
3. Adjust intensity / syncopation / swing / BPM
4. Configure lanes (name, category, MIDI note, MIDI channel)
5. **GENERATE** → preview with ▶ PLAY → download MIDI files per variation

## Lane Layout

### Lane Config (2-column)
| LEFT (foundation) | RIGHT (accent) |
|-------------------|----------------|
| Kick | Perc |
| Snare | Clap |
| HH Closed | Tom Hi |
| HH Open | Tom Low |

### Grid (top to bottom)
Perc → Clap → Tom Hi → Tom Low → HH Open → HH Closed → Snare → Kick

### Default MIDI Mapping
| Lane | Note | Default |
|------|------|---------|
| Kick | 36 | C1 |
| Snare | 38 | D1 |
| HH Closed | 42 | F#1 |
| HH Open | 46 | A#1 |
| Tom Low | 41 | F1 |
| Tom Hi | 50 | D2 |
| Clap | 39 | D#1 |
| Perc | 56 | G#2 |

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

## Style Presets

| Preset | Lanes | Style |
|--------|-------|-------|
| Default | Kick, Snare, HH Closed/Open, Tom, Clap, Perc | Hypnotic |
| Hypnotic Raw | Stab, Snare, HH Closed/Open, Ride, Clap | Hypnotic |
| Hardgroove | Kick, Snare, Ride, Conga, Shaker, Clap | Hardgroove |
| Tribal | Kick, Snare, HH Closed/Open, Bell, Conga, Tom | Tribal |
| Industrial | Kick, Stab, HH Closed/Open, Metal Hit, Rimshot | Dense |

## Variation Tabs

| Tab | Default Length | Purpose |
|-----|---------------|---------|
| Base | 4 bars | Main pattern |
| Drop | 2 bars | Energy drop, stripped down |
| Fill | 1 bar | Transition fill |
| Buildup | 2 bars | Energy build |
| Break | 2 bars | Rhythmic break |

Each variation is a standalone pattern — export individually as .mid files.

## Hapax Integration

- 960 PPQ (Hapax native resolution)
- MIDI notes: configurable per lane (see mapping table above)
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
├── references/
│   └── hapax_mockup.html         ← Hapax UI reference mockup
└── README.md
```

## YouTube Sources

1. **"5 Drum Patterns Every Hypnotic Techno Producer Should Learn"** — Tresillo, Clave, 12x8 Bell, Shamanic
2. **"Complete Guide to Techno Drums Pattern"** — Audioreakt — Kick patterns, hihat crescendo, clap backbeat
3. **"How to Make Hardgroove Techno Drum Pattern"** — midee + MusicRadar — Conga, shaker, Latin perc
4. **"Hi-Hat Humanizing & Variation Techniques"** — Drum Machine 101 — Probability, microtiming
5. **"10 Rules for Techno"** — Underdog (Oscar) — Fullness/emptiness, pulse as foundation

## Changelog

### v6.1.2
- Fixed lane config column layout (explicit flex columns, Kick/Snare/HH left, Perc/Clap/Tom right)
- Fixed lane config order (Kick at bottom, matching grid)
- Fixed Perc color (teal #00D4AA) and Snare color (green #44DD44)

### v6.1.0
- Fixed grid lane order (Perc top, Kick bottom)

### v6.0.0
- Complete rewrite: Hapax mockup CSS + layout 1:1
- All JS functionality preserved from v5.x

### v5.0.0
- Applied Hapax aesthetic CSS

### v4.4.0
- Standalone variation lengths (Fill=1bar, Drop=2bars, Buildup=2bars, Break=2bars)

### v4.3.0
- Look-ahead scheduler for gapless loop playback

### v4.2.0
- Dice roll per variation tab

### v4.1.0
- Web Audio API playback
- Auto-play on generate

### v4.0.0
- BPM slider, per-lane channel, multi-channel MIDI
- Paged grid, swing toggle, pattern save/load
- Undo/redo, CC automation

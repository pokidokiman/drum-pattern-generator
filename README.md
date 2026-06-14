# Drum Pattern Generator v7.3.0

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
- **Groove templates** — TR-909 (house, techno, acid) and TR-808 (hiphop, bounce, afro) as pattern starting points
- **Velocity curves** — per-lane: flat, exponential, logarithmic, random walk, crescendo, decrescendo
- **Energy arcs** — multi-bar evolution: flat, build, peak, valley, cliff, wave
- **Polyrhythm** — 3:4 tresillo and 5:4 quintuplet on any lane, creating tension against 4/4
- **Correct primitives** — fixed sixteenth (all 1s), tresillo (16 steps), clave 3-2 (16 steps), accent pattern

### MIDI Export
- **960 PPQ** — Hapax native resolution
- **User-specified BPM** — slider 120-155 (not hardcoded)
- **Per-lane MIDI channels** — CH 1-16 per lane, routes to different Hapax outputs
- **Track name meta-event** — dot-separated uppercase lane names (Hapax popup preview format)
- **Format 0** — single track, Hapax drum import ready
- **Per-variation export** — download individual .mid files per variation tab
- **Consecutive notes 36-43** — matches Hapax drum lane import mapping (lowest note → Lane 1)

### Audio Playback
- **Web Audio drum synthesis** — preview before export, no samples needed
- **Play / Stop / Loop** — spacebar to toggle play, loop button with visual indicator
- **Velocity-sensitive** — soft hits sound soft, accents are louder
- **Look-ahead scheduler** — gapless loop playback (50ms interval, 200ms look-ahead)
- **Auto-play on generate** — pattern plays immediately after generation
- **Tab switch audio** — switching variation tabs auto-switches audio playback

### Workflow
- **Undo / Redo** — 50 levels, Ctrl+Z / Ctrl+Y
- **Save / Load** — localStorage, auto-loads on refresh, validated input
- **Dice rolls** — regenerate individual variation tabs with new random patterns
- **Keyboard shortcuts** — ← → for bar nav, Space for play/stop
- **Velocity drag editing** — click + drag up/down on active cells to adjust velocity (1-127)

## Quick Start

Open `drum_pattern_generator.html` in any browser. No server needed.

1. Select style(s) — e.g. Hypnotic, Hardgroove, Tribal
2. Select characteristics — e.g. Sparse, Textural, Syncopated
3. Optionally load a groove template (TR-909/808 presets)
4. Set energy arc (build, peak, valley, wave) for multi-bar evolution
5. Adjust intensity / syncopation / swing / BPM
6. Configure lanes (name, category, MIDI note, MIDI channel, velocity curve)
7. **GENERATE** → preview with ▶ PLAY → download MIDI files per variation

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

### Default MIDI Mapping (36-43 consecutive)
| Lane | Note | Hapax Lane |
|------|------|------------|
| Kick | 36 | Lane 1 |
| Snare | 37 | Lane 2 |
| HH Closed | 38 | Lane 3 |
| HH Open | 39 | Lane 4 |
| Tom Low | 40 | Lane 5 |
| Tom Hi | 41 | Lane 6 |
| Clap | 42 | Lane 7 |
| Perc | 43 | Lane 8 |

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
- MIDI notes: 36-43 consecutive (matches Hapax import: lowest note → Lane 1)
- Per-lane MIDI channel (1-16) — route different lanes to different Hapax outputs
- Track name: dot-separated uppercase lane names (Hapax popup preview on hover)
- Import `.mid` into Hapax drum track → set MAP TO = 36 → all 8 lanes auto-assigned
- Per-lane output routing on Hapax: MIDI A-D, CV 1-4, CV/Gate 1-4 (configured on hardware)
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

### v7.3.0
- **Grid order fixed** — Kick always at bottom, regardless of preset lane order (GRID_ORDER constant + sortLanesForGrid)
- **Preset MIDI notes fixed** — all presets use correct GM drum map values (Kick=36, Snare=38, etc.) instead of sequential 36-43
- **Recommended kits per preset** — Hypnotic Raw→Minimal, Hardgroove→909, Tribal→808, Industrial→909 (auto-switches on preset select)
- **Shaker synth** — dedicated high-pass noise burst (was using hihat synth)
- **Metal Hit synth** — metallic clang with bandpass filter
- **Grid dot colors** — name-based mapping (consistent with lane config, no more color mismatch on presets)
- **Tribal preset balanced** — 4 foundation + 4 accent lanes (was 2+6)
- **Trig toggle** — click empty cell to add trig (velocity 100), click filled cell to remove it

### v7.0.0
- Fixed drum primitives: sixteenth (all 1s, was duplicate of binary), tresillo (16 steps, was 15), clave 3-2 (16 steps, was 20), accent (beats 1+3, was all zeros)
- Added per-lane velocity curves: flat, exponential, logarithmic, random walk, crescendo, decrescendo
- Added multi-bar energy arc evolution: flat, build, peak, valley, cliff, wave
- Added TR-909/808 groove templates: 7 presets (909-house, 909-techno, 909-acid, 808-hiphop, 808-bounce, 808-afro) as pattern starting points
- Added polyrhythm support: 3:4 tresillo and 5:4 quintuplet on any target lane
- Implemented humanized style: probability (15% skip, 10% ghost for hihat), velocity random walk (delta-based), per-category microtiming (kick ±2, snare ±8, hihat ±15)
- Fixed kick invariants: always 4-on-the-floor (16 hits), always velocity 100, immune to energy arcs, density changes, ghost notes, and last-bar variation
- All changes verified with automated test suite (138 tests, 12 styles × 5 arcs)

### v6.1.2
- Fixed lane config column layout (explicit flex columns, Kick/Snare/HH left, Perc/Clap/Tom right)
- Fixed lane config order (Kick at bottom, matching grid)
- Fixed Perc color (teal #00D4AA) and Snare color (green #44DD44)

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

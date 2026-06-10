# Drum Pattern Generator v3.0.2

Research-backed drum pattern generator for **Squarp Hapax**.

## Features

- **8 user-configurable lanes** — name, category, MIDI note per lane
- **8 categories** — foundation, backbeat, hihat, accent, metallic, texture, pitched, synth
- **12 styles** — hypnotic, minimal, groove, polyrhythmic, sparse, dense, syncopated, textural, tribal, hardgroove, humanized, dynamic
- **Variation engine** — base pattern + drop, fill, buildup, break
- **MIDI export** — 960 PPQ, Hapax drum track ready
- **Research-backed** — Winograd syncopation, microtiming bounds (Madison et al., 2011), polyrhythmic LCM alignment

## Quick Start

Open `drum_pattern_generator.html` in any browser. No server needed.

Or use the editor:
1. Open `editor/index.html` in browser (needs `engine.js` in same directory)
2. Configure lanes (name, category, MIDI note)
3. Select style(s)
4. Adjust intensity / syncopation / swing
5. Generate → download MIDI files per variation

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

- **Default** — Classic 8-lane drum kit
- **Hardgroove** — Ride, conga, shaker, Latin percussion
- **Tribal** — Bell, conga, toms, shaker
- **Industrial** — Stab, metal hit, rimshot

## Hapax Integration

- 960 PPQ (Hapax native resolution)
- MIDI notes: configurable per lane (default: 36=kick, 38=snare, etc.)
- Import `.mid` into Hapax drum track → lowest note auto-maps to Lane 1
- User configures OUTPUT NOTE + CHANNEL per lane on Hapax

## Research References

1. Frühauf, Kopiez, & Platz (2013). Music on the timing grid.
2. Madison, Gouyon, Ullén, & Hörnström (2011). Modeling temporal microvariations.
3. Winograd (1968). Linguistics and computer analysis of tonal harmony.
4. Honing (2012). Musical Cognition: A Science of Listening.
5. Lattner & Grachten (2019). High-Level Control of Drum Track Generation.
6. Tripodi (2022). Deep learning-based drum loop generation.

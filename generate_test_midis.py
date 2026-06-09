import struct

def encode_var_len(value):
    if value < 0: value = 0
    bytes_list = [value & 0x7F]
    value >>= 7
    while value > 0:
        bytes_list.append((value & 0x7F) | 0x80)
        value >>= 7
    return bytes_list[::-1]

def create_midi(filename, events, bpm=130):
    PPQ = 960
    track = []
    track.extend(encode_var_len(0))
    track.extend([0xFF, 0x51, 0x03])
    tempo = int(60000000 / bpm)
    track.extend([(tempo >> 16) & 0xFF, (tempo >> 8) & 0xFF, tempo & 0xFF])
    track.extend(encode_var_len(0))
    track.extend([0xFF, 0x58, 0x04, 0x04, 0x02, 0x18, 0x08])
    events.sort(key=lambda e: e[0])
    prev_tick = 0
    for tick, note, vel in events:
        delta = tick - prev_tick
        track.extend(encode_var_len(delta))
        if vel > 0:
            track.extend([0x90, note & 0x7F, vel & 0x7F])
        else:
            track.extend([0x80, note & 0x7F, 0])
        prev_tick = tick
    track.extend(encode_var_len(0))
    track.extend([0xFF, 0x2F, 0x00])
    header = [0x4D, 0x54, 0x68, 0x64, 0,0,0,6, 0,0, 0,1, (PPQ>>8)&0xFF, PPQ&0xFF]
    track_header = [0x4D, 0x54, 0x72, 0x6B,
                    (len(track)>>24)&0xFF, (len(track)>>16)&0xFF,
                    (len(track)>>8)&0xFF, len(track)&0xFF]
    with open(filename, "wb") as f:
        f.write(bytes(header + track_header + track))
    return len(header + track_header + track)

PPQ = 960
TPS = PPQ // 4
GATE = TPS // 2

sounds = [
    ("perc", 56), ("clap", 39), ("tom_hi", 50), ("tom_lo", 41),
    ("hihat_open", 46), ("hihat_closed", 42), ("snare", 38), ("kick", 36),
]

patterns = {
    "hypnotic_base": {
        "kick": [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        "hihat_closed": [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        "hihat_open": [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,1],
    },
    "tribal_base": {
        "kick": [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        "hihat_closed": [1,0,1,0, 1,0,1,0, 1,0,1,0, 0,0,0,0],
        "perc": [1,0,0,1, 0,0,1,0, 0,0,0,0, 1,0,0,0],
        "tom_lo": [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,1,0,0],
    },
    "groove_base": {
        "kick": [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        "hihat_closed": [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        "snare": [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        "clap": [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        "perc": [0,0,0,0, 0,1,0,0, 0,0,0,0, 0,1,0,0],
    },
    "hardgroove_base": {
        "kick": [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        "hihat_closed": [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        "hihat_open": [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
        "perc": [1,0,0,1, 0,1,0,0, 1,0,0,1, 0,0,1,0],
        "snare": [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    },
    "dense_base": {
        "kick": [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        "hihat_closed": [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        "hihat_open": [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0],
        "snare": [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        "clap": [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0],
        "perc": [0,1,0,0, 0,1,0,0, 0,1,0,0, 0,1,0,0],
    },
}

for name, pat in patterns.items():
    events = []
    for sound_name, note in sounds:
        steps = pat.get(sound_name, [0]*16)
        full = steps * 2
        for i, s in enumerate(full):
            if s:
                tick = i * TPS
                events.append((tick, note, 100))
                events.append((tick + GATE, note, 0))
    size = create_midi(f"/home/jeffry/projects/drum-pattern-generator/output/{name}.mid", events)
    print(f"  {name}.mid ({size} bytes)")

print("Done!")

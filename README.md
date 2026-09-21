# Alarm — a small bedside clock

A self-contained alarm clock web app: live clock, multiple named alarms, six
switchable clock designs, and an original procedurally-generated tune engine
with 1,296 distinct melodies. Built with plain HTML, CSS and JavaScript — no
build step, no dependencies.

Built by **Er. Pankaj**.

## Run it

Just open `index.html` in a browser. Or serve it locally:

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Files

- `index.html` — page structure and markup
- `style.css` — six clock designs, driven by CSS custom properties
- `script.js` — clock tick, alarm CRUD, tune engine, ringing/snooze logic, persistence

## Clock designs

Pick one from the "Clock design" dropdown at the top of the app:

| Design | Look |
|---|---|
| Midnight | Dark amber LED digits (default) |
| Neon Arcade | Black background, glowing cyan/magenta digits |
| Sunrise Paper | Light cream theme with warm ink text |
| Analog Classic | A real analog dial with sweeping hands |
| Flip Board | Dark theme, digits rendered as flip-card tiles |
| Terminal Mono | Green-on-black retro computer terminal |

Your choice is remembered between visits.

## Alarm tunes — 1,296 originals, no copyrighted audio

Every tune is generated live in the browser from four building blocks:

- **9 melodic patterns** (Classic Beep, Chime Cascade, Arpeggio Up, Arpeggio
  Wave, Retro Pulse, Siren Glide, Bell Toll, Morse Ping, Fanfare)
- **12 root notes** (C through B)
- **4 timbres** (Sine, Square, Triangle, Sawtooth)
- **3 tempos** (Slow, Medium, Fast)

`9 × 12 × 4 × 3 = 1,296` unique, original tunes — all synthesized on the fly
with the Web Audio API, so there are no audio files to download and nothing
reproduced from any existing recording. Use **Preview** to audition a tune
before saving an alarm, or **Shuffle** to jump to a random one.

We deliberately did not include real songs: embedding copyrighted music
(even short clips) isn't something this project can do, so instead it ships
a genuinely large, original library you're free to use however you like.

## How it works

- The current time re-renders every second from `Date`.
- Alarms are stored as `{ id, hour, minute, period, label, tuneId, enabled }`
  objects in `localStorage`, so they survive a page reload.
- Each second, active alarms are compared against the current time; a match
  triggers the ringing panel and loops the alarm's chosen tune.
- **Snooze** re-schedules the same alarm 5 minutes from the moment you snooze.
- **Stop** dismisses the ringing state until the alarm's next scheduled time.

## Notes / limitations

- Alarms only fire while the browser tab is open — there's no service worker
  or native notification here, so it won't wake you if the tab or laptop is
  closed.
- Deploy the folder as-is to any static host (Netlify, GitHub Pages, Vercel) —
  no build step required.

# ⏰ Alarm Clock — A Small Bedside Clock

<div align="center">

### A beautiful, self-contained alarm clock built with pure HTML, CSS & JavaScript.

**Live Demo:**  
🌐 **https://pankajkumar952.github.io/Alarm_Clock/**

**Built by Er. Pankaj**

</div>

---

## ✨ Overview

**Alarm Clock** is a lightweight, fully browser-based bedside clock application designed to provide a clean and interactive alarm experience without requiring frameworks, dependencies, databases, or a build process.

The application includes:

- 🕐 Live digital clock
- ⏰ Multiple named alarms
- 🎨 Six switchable clock designs
- 🎵 **1,296 procedurally generated alarm melodies**
- 🔊 Web Audio API-based sound generation
- 🔀 Random tune shuffle
- ▶️ Tune preview before saving an alarm
- 😴 5-minute snooze functionality
- 🛑 Stop/dismiss alarm functionality
- 💾 Persistent alarm storage using `localStorage`
- 📱 Responsive browser-based interface
- ⚡ Zero dependencies
- 🚀 No build step required

Everything runs directly in the browser.

---

## 🌐 Live Demo

### 👉 Try the Alarm Clock Online

**https://pankajkumar952.github.io/Alarm_Clock/**

You can open the live version directly in your browser without installing anything.

---

## 🎨 Clock Designs

The application includes **six different clock designs** that can be switched from the **Clock Design** dropdown.

| Design | Description |
|---|---|
| 🌙 **Midnight** | Dark amber LED-style digits |
| 🕹️ **Neon Arcade** | Black background with glowing cyan/magenta digits |
| 🌅 **Sunrise Paper** | Light cream theme with warm typography |
| 🕰️ **Analog Classic** | Traditional analog clock with sweeping hands |
| 🔄 **Flip Board** | Dark flip-card style digital clock |
| 💻 **Terminal Mono** | Retro green-on-black computer terminal design |

Your selected design is remembered between visits using browser storage.

---

## 🎵 1,296 Original Alarm Tunes

One of the main features of this project is its **procedural alarm tune engine**.

Instead of shipping copyrighted music or audio files, every alarm sound is synthesized dynamically using the browser's **Web Audio API**.

The tune engine combines:

### 🎼 9 Melodic Patterns

1. Classic Beep
2. Chime Cascade
3. Arpeggio Up
4. Arpeggio Wave
5. Retro Pulse
6. Siren Glide
7. Bell Toll
8. Morse Ping
9. Fanfare

### 🎹 12 Root Notes

All twelve musical root notes are supported:

**C, C#, D, D#, E, F, F#, G, G#, A, A#, B**

### 🔊 4 Timbres

- Sine
- Square
- Triangle
- Sawtooth

### ⚡ 3 Tempos

- Slow
- Medium
- Fast

### 🧮 Total Combinations

```text
9 patterns × 12 root notes × 4 timbres × 3 tempos

= 1,296 unique tune combinations
```

Each tune is generated directly in the browser.

There are **no audio files to download** and no existing commercial recordings are reproduced.

---

## 🎧 Preview & Shuffle

Before saving an alarm, you can:

### ▶️ Preview

Listen to the currently selected melody.

### 🔀 Shuffle

Generate a random tune combination from the available library.

This makes it easy to find a sound that works for your alarm without manually selecting individual musical parameters.

---

## ⏰ Alarm Features

The application supports multiple alarms with individual settings.

Each alarm can contain:

```text
ID
Hour
Minute
AM/PM
Label
Tune
Enabled/Disabled
```

### Supported actions

- ➕ Create an alarm
- ✏️ Edit an alarm
- 🗑️ Delete an alarm
- 🔘 Enable/disable an alarm
- ▶️ Preview its tune
- 😴 Snooze for 5 minutes
- 🛑 Stop a ringing alarm

---

## 😴 Snooze

When an alarm starts ringing, the **Snooze** option schedules the same alarm for **5 minutes later**.

This provides a simple bedside-clock-style snooze experience directly in the browser.

---

## 🛑 Stop Alarm

Selecting **Stop** dismisses the current ringing state.

The alarm remains available for its next scheduled occurrence.

---

## 💾 Data Persistence

Alarm information is stored locally in the browser using:

```text
localStorage
```

The application stores alarm objects similar to:

```javascript
{
  id,
  hour,
  minute,
  period,
  label,
  tuneId,
  enabled
}
```

Because the data is stored locally:

- Alarms survive page refreshes
- Clock design preferences can be remembered
- No backend server is required
- No database is required
- No user account is required

---

## ⚙️ How It Works

### 🕐 Live Clock

The current time is read from JavaScript's:

```javascript
Date
```

The interface is refreshed every second.

### ⏰ Alarm Detection

Every second, enabled alarms are compared against the current time.

When the hour and minute match an active alarm, the application:

1. Detects the matching alarm
2. Opens the ringing interface
3. Starts the selected tune
4. Loops the alarm sound
5. Provides Snooze and Stop controls

### 🎵 Tune Generation

The selected pattern, root note, timbre and tempo are combined and synthesized dynamically using the:

```text
Web Audio API
```

This means the application does not depend on external audio assets.

---

## 🛠️ Technology Stack

<div align="center">

| Technology | Purpose |
|---|---|
| 🧱 HTML5 | Application structure |
| 🎨 CSS3 | UI, themes and clock designs |
| ⚡ JavaScript | Clock, alarms and application logic |
| 🔊 Web Audio API | Procedural alarm sounds |
| 💾 LocalStorage | Alarm and preference persistence |
| 🌐 GitHub Pages | Deployment |

</div>

### No Frameworks Required

This project intentionally uses:

```text
HTML
CSS
JavaScript
```

There is no:

- React
- Angular
- Vue
- Node.js backend
- Database
- Build system
- External dependency

---

## 📁 Project Structure

```text
Alarm_Clock/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### `index.html`

Contains the application structure and markup.

### `style.css`

Contains the complete UI styling, responsive layout and six clock themes.

### `script.js`

Handles:

- Live clock updates
- Alarm CRUD operations
- Tune generation
- Web Audio API
- Alarm detection
- Ringing state
- Snooze
- Stop
- LocalStorage persistence
- Clock design selection

---

## 🚀 Run Locally

No installation or build process is required.

### Option 1 — Open Directly

Simply open:

```text
index.html
```

in your browser.

### Option 2 — Using `npx`

```bash
npx serve .
```

### Option 3 — Using Python

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

---

## 🌍 Deployment

Because this is a static project, it can be deployed directly to services such as:

- GitHub Pages
- Vercel
- Netlify
- Any static hosting provider

No build command is required.

### Current Deployment

The project is currently available through GitHub Pages:

🌐 **https://pankajkumar952.github.io/Alarm_Clock/**

---

## ⚠️ Important Limitation

This is a **browser-based alarm clock**, not a native operating-system alarm service.

The alarms can only fire while the browser page is available and running.

It does **not** currently include:

- Background service workers
- Native OS alarm scheduling
- Mobile push notifications
- Backend scheduling
- System-level wake-up functionality

Therefore, closing the browser/tab or shutting down the computer may prevent the alarm from firing.

---

## 🔐 Privacy

This application does not require an account or backend database.

Alarm information is stored locally in the browser using `localStorage`.

No external server is required for normal alarm operation.

---

## 🎯 Project Goals

This project was created to demonstrate how much functionality can be built with standard browser technologies without relying on a framework.

The main goals were:

- Build a useful everyday application
- Experiment with procedural audio
- Explore the Web Audio API
- Create multiple visual themes
- Implement persistent browser storage
- Build alarm scheduling logic
- Keep the project lightweight and dependency-free

---

## 👨‍💻 Author

### Er. Pankaj

**Software Developer | Full Stack Developer | AI/ML Enthusiast**

🌐 **Live Project:**  
https://pankajkumar952.github.io/Alarm_Clock/

🐙 **GitHub:**  
https://github.com/pankajkumar952

💼 **LinkedIn:**  
https://www.linkedin.com/in/pankaj-kumar-0b82a8238/

---

## 📄 License

This project is released under a custom **Personal & Educational Use License**.

See the [`LICENSE`](LICENSE) file for details.

---

<div align="center">

### ⏰ Built with HTML, CSS, JavaScript & Web Audio API

**Made with ❤️ by Er. Pankaj**

</div>
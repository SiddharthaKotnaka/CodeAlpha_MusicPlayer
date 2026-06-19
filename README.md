# 🎵 Crazy Sidd's Music Player

A modern, responsive, and visually immersive music player built using HTML, CSS, and JavaScript.

Designed with a premium dark theme, smooth animations, dynamic playlists, favorites management, search functionality, queue management, and responsive layouts for desktop, tablet, and mobile devices.

---

## ✨ Features

### 🎧 Music Playback
- Play / Pause tracks
- Next & Previous controls
- Shuffle mode
- Repeat mode
- Volume control
- Interactive progress bar

### ❤️ Personal Library
- Add tracks to Favorites
- Recently Played section
- Local storage support
- Persistent user preferences

### 🔍 Smart Search
- Search by:
  - Track name
  - Artist
  - Album
  - Genre

### 📻 Radio Stations
- Curated radio stations
- Featured music collections
- Quick playback access

### 🎨 Modern UI
- Glassmorphism design
- Animated loading screen
- Dynamic gradients
- Ambient visual effects
- Responsive layouts

### 📱 Fully Responsive
- Desktop optimized
- Tablet friendly
- Mobile navigation drawer
- Touch-friendly controls

---

## 🛠 Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Local Storage API
- Lucide Icons
- Google Fonts

---

## 📂 Project Structure

```text
Crazy-Sidd-Music-Player/
│
├── index.html
├── styles.css
├── app.js
├── plugin.json
├── .mcp.json
│
└── assets/
    └── afterglow.png
```

---

## 🚀 Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/crazy-sidd-music-player.git
```

### Open Project

```bash
cd crazy-sidd-music-player
```

### Run

Simply open:

```text
index.html
```

in your browser.

Or use VS Code Live Server:

```bash
Right Click → Open with Live Server
```

---

## 🎵 Included Demo Tracks

The application includes multiple demo tracks and sample streaming audio sources for testing and UI demonstration purposes.

Examples:

- Afterglow
- Neon Drift
- Velvet Sky
- Parallel Lines
- Moonwater
- Signal Bloom
- Slow Motion
- Quiet Geometry

---

## 🎨 Design Highlights

- Premium dark aesthetic
- Glassmorphism panels
- Smooth transitions
- Dynamic hover effects
- Animated loading screen
- Responsive music cards
- Floating player controls

---

## 📸 Album Artwork

Default artwork:

```
assets/afterglow.png
```

Replace with your own artwork by updating the assets folder and track configuration inside:

```javascript
app.js
```

---

## ⚙ Customization

### Add New Songs

Open:

```javascript
app.js
```

Add a new object inside the tracks array:

```javascript
{
  id: "song-id",
  title: "Song Name",
  artist: "Artist",
  album: "Album",
  year: 2026,
  genre: "Genre",
  duration: 240,
  art: "assets/song-cover.png",
  audio: "audio/song.mp3",
  desc: "Song description"
}
```

---

## 📱 Keyboard Shortcuts

| Shortcut | Action |
|-----------|----------|
| Ctrl + K | Search |
| Space | Play / Pause |
| Esc | Close menus |

---

## 🌟 Future Improvements

- User authentication
- Playlist creation
- Download tracks
- Equalizer controls
- Lyrics support
- PWA support
- Offline playback
- Theme customization

---

## 👨‍💻 Developer

**Siddhartha Kotnaka**

Designed and developed as a premium modern web music player experience.

---

## 📜 License

This project is available for educational and personal use.

---

## 💙 Crazy Sidd's Music Player

"Pure sound. No distractions."
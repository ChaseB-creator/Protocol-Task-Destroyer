# 🚀 Protocol: Task Destroyer

> A free, open-source, fully dynamic task manager web application with a glowing **Gold & Black** spaceship HUD aesthetic, cross-platform desktop executables, drag-and-drop task boards, confetti celebrations, and complete customization.

---

## ✨ Features

### 🛸 1. Directory Board (Main Command Deck)
* **Gold & Black Spaceship HUD Aesthetic**: Designed with glowing metallic gold borders (`#FFD700`), obsidian panels, ambient starfield telemetry, and cockpit HUD elements.
* **Header**: Center top features **"Protocol: Task Destroyer"** in glowing sci-fi typography with orbital status indicators.
* **Far-Left Controls**:
  * **Create Taskboard**: Launch new taskboards with custom titles and spaceship environment themes.
  * **Delete Taskboard**: Deletion protocol mode to decommission selected taskboards with confirmation protection.
* **Taskboard Details Section**:
  * Displays exact **Creation Date & Time** (e.g. `Nov 17, 2026 • 6:45 PM`).
  * Displays **Current Task Count** (e.g. `7 Tasks`).
  * Real-time progress telemetry bar showing % of tasks completed across categories.
* **Data Persistence & Portability**: Automatically auto-saves to local storage, with built-in JSON Backup & Restore capabilities.

---

### 📋 2. Interactive Taskboard View
* **Dynamic Task Logs (Headers)**: Default headers include **"Planning"**, **"In-Progress"**, and **"Complete"**, with the ability to add unlimited custom task headers.
* **Smooth Mouse Drag-and-Drop**: Click and drag tasks seamlessly between columns.
* **Confetti Celebration & Sound Effects**:
  * Dragging any task into the **"Complete"** log instantly triggers a dazzling **golden confetti burst** and a **futuristic victory fanfare sound effect** (procedurally synthesized via the Web Audio API—works 100% offline with zero external audio assets required!).
* **Unlimited Tasks**: Create as many tasks as you need with rich titles and multi-line sub-descriptions.
* **Confined Image Containers & Size Protection**:
  * Attach images to any task.
  * **Built-in safety code**: Large photos (up to 10MB) are automatically validated, downscaled, and compressed via HTML5 Canvas before saving, preventing memory/storage bloat.
  * **Confined dimensions**: All attached images are housed in a styled container that confines height and width, keeping your board clean and uniform. Click any image to view it full resolution in the Lightbox viewer!

---

### 🎨 3. Full Taskboard Customization
Users can customize every aspect of their created taskboards via the **Customize Board** menu:
1. **Board Background**:
   * *Spaceship Void* (Gold & Obsidian HUD)
   * *Solar Stardust* (Glowing Cosmic Amber)
   * *Cyber Orbital Grid* (Cyan & Golden Matrix)
   * *Deep Nebula* (Violet & Starlight)
   * *Stealth Carbon* (Brushed Dark Titanium)
   * *Custom Solid Color* (Color picker)
   * *Custom Background Image* (Image URL)
2. **Task Headers**: Customize the color scheme of column headers (Metallic Gold, Solar Amber, Orbital Cyan, Emerald Warp, Crimson Thruster, Starlight Violet, or Custom Color Picker).
3. **Task Cards**: Customize the background tint and border glow of task cards, both globally and per-task.

---

## 💻 Running & Installing

### Option A: 1-Click Desktop Run (Windows / macOS / Linux)

#### On Windows:
Double-click `run-desktop.bat` or run:
```powershell
npm run electron:start
```

#### On Linux / macOS:
```bash
chmod +x run-desktop.sh
./run-desktop.sh
```

---

### Option B: Web Application (Browser & PWA)
Run the Vite development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser (Google Chrome, Microsoft Edge, Brave, Safari, Firefox).

* **PWA 1-Click Install**: Click the **Install** icon in your browser's address bar to install "Protocol: Task Destroyer" directly onto your Windows, Linux, or macOS desktop as an independent app window with desktop icon!

---

### Option C: Building Single Executable Desktop Installers
Use `electron-builder` to compile standalone executable packages for each operating system:

```bash
# Build portable Windows executable (.exe)
npm run package:win

# Build Linux executable (.AppImage)
npm run package:linux

# Build macOS installer (.dmg)
npm run package:mac

# Build all platforms
npm run package:all
```
Generated installers and executables are output to the `release/` directory.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**: React 19, Modern CSS Variables & Animations
* **Icons**: Lucide React
* **Celebration Effects**: Canvas Confetti
* **Audio Engine**: Web Audio API (Synthesizer for blips, slide whoosh, and victory fanfare)
* **Image Processor**: HTML5 Canvas client-side compressor & validator
* **Desktop Runtime**: Electron 45 & Electron-Builder
* **Build Tooling**: Vite 8

---

## 📄 License

Open-source and free for all users under the **MIT License**.

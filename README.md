# A Little Universe Made Only For You ✨

A cinematic, emotionally powerful, and fully animated personalized birthday website designed as a premium interactive love story. This website blends modern WebGL mechanics, smooth scroll physics, and cozy nostalgic polaroid aesthetics to create a magical, luxury digital memory book.

---

## 🎨 Vibe & Color Palette
- **Theme**: Romantic futuristic dreamworld + Cozy nostalgic memories
- **Color Palette**: Pitch Black (#050508), Vintage Cream (#FAF7F2), Soft Blush Pink (#FFB7C5), Cosmic Purple (#1E1035), and Glowing Gold (#FFD700).
- **Styling**: Luxury glassmorphism, responsive neon light glows, organic SVG film grain overlay, and elegant cursive calligraphy typography.

---

## 🚀 Features & Chapters

### 🌌 Intro Gateway & Sound Engine
- **Twinkling Star Portal**: An immersive fullscreen Canvas displaying drifting stars to solve browser autoplay restrictions.
- **Typewriter Greeting**: types out *"A little universe made only for you..."* with a pulsing cursor, inviting the user in.
- **Spinning Vinyl Equalizer**: A floating interactive audio card that loops a gorgeous romantic lofi piano track with soft fade-in/fade-out transitions.

### ✨ Custom Cursor Sparkles
- **Damped Pointer**: Custom floating circular ring that tracks desktop coordinates with momentum.
- **Stardust Emitter**: A high-fps Canvas spraying a physics-based trail of glowing stars and floating hearts, complete with clickable light bursts.

### 🪐 3D Parallax Hero
- **WebGL Particle Nebula**: Pure **Three.js** rendering 700+ (desktop) / 300 (mobile) glowing stardust nodes in a mouse-reactive, physical 3D parallax field.
- **Floating Polaroids**: drifting polaroid cards that tilt dynamically in response to cursor angles.

### 📸 Chapter I: Shared Memories
- **Polaroid Masonry Wall**: Staggered vintage polaroid grid that floats, rotate, and lifts.
- **Dreamy Lightbox**: Clicking a photo zooms into a full-screen blur view, presenting handwritten descriptions.

### 🗺️ Chapter II: Constellation Timeline
- **Draw-on-Scroll Path**: A glowing vertical gold constellation line that dynamically draws itself to link milestones.
- **Milestone Cards**: Slide and fade into view from alternating sides with glowing neon boundaries.

### 🃏 Chapter III: Reasons I Love You
- **3D Card Flip**: Grid of luxury cards that execute a fluid **3D preserve-3d flip** on hover/tap.
- **Hearts Splash**: Tapping a card launches a cluster of rising pink heart particles.

### ✉️ Chapter IV: The Sealed Letter
- **Wax Seal Opening**: A paper envelope closed with a heart-stamped wax stamp. Clicking opens the flap and slides out a cursive letter.
- **Line Stagger**: The private letter types out paragraph-by-paragraph.

### 🌟 Chapter V: Interactive Memory Sky
- **Canvas Constellation Map**: An interactive starry sky where core constellation nodes glow.
- **Constellation Capsule**: Clicking a star highlights the node and slides in a secret memory bubble with a customized photo.
- **Shooting Stars**: Twinkling stardust streaks periodically across the backdrop.

### 🎂 Chapter VI: Countdown & Wish
- **Glowing Digital Clock**: Ticks down to their birthday and transitions to a **"Today is your Day!"** celebration on the birthday date.
- **Wish Fireworks**: Clicking "Make a Birthday Wish" fires a canvas firework burst from the bottom corners, opening a pulsing wish modal.

### 💖 Finale: In Every Universe
- **Memory Dissolution**: Scattered polaroid fragments float up, scaling down and dissolving into the stardust.
- **Pulsing Heartbeat**: A glowing heart icon beats like a pulse, concluding with the quote: *"In every universe, it will always be you."*

---

## 🛠️ Technology Stack
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite (fully optimized rollup builds)
- **Styling**: Tailwind CSS v4 + Native CSS variables
- **Animations**:
  - `GSAP` + `@gsap/react` (for scroll controls)
  - `Framer Motion` (for card flips, 3D envelope folds, line fades, and page entries)
  - `Three.js` (for high-performance WebGL 3D depth particle fields)
  - `Canvas Confetti` (for birthday firework explosions)
- **Icons**: `Lucide React`

---

## ⚙️ Quick Customization

All customized data resides in a single, well-documented configuration file: `src/data/memories.ts`.

### 1. Custom Photos
Put your images in the `public/assets/` directory (or use online image URLs) and customize the paths in `src/data/memories.ts`:
```typescript
// Example photo entry
{
  id: 1,
  url: "/assets/our_first_photo.jpg",
  caption: "When our hands first fit perfectly together.",
  date: "October 12, 2024",
  rotation: -3
}
```

### 2. Custom Date
Modify the `birthdayDate` string inside `BIRTHDAY_CONFIG` in `src/data/memories.ts`:
```typescript
birthdayDate: "2026-10-24T00:00:00", // YYYY-MM-DDTHH:MM:SS
```

### 3. Custom Music
Drop an `.mp3` into the `public/` folder and change the `musicUrl` variable:
```typescript
musicUrl: "/my_romantic_song.mp3",
```

---

## 💻 Local Setup & Development

Ensure you have [Node.js](https://nodejs.org) installed on your system, then run:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

3. **Verify Production Build**:
   ```bash
   npm run build
   ```

---

## ☁️ Vercel Deployment

Deploy your birthday website to **Vercel** in under a minute:

1. **Install Vercel CLI** (Optional, or link via Vercel Dashboard):
   ```bash
   npm i -g vercel
   ```
2. **Deploy**:
   ```bash
   vercel
   ```
3. Set your build parameters:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

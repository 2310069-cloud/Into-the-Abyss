# 🌊 Ocean Depths – Journey into the Unknown

An immersive, scroll-driven interactive storytelling website that takes users on a descent through the ocean's most mysterious layers — from sunlit surface waters to the crushing darkness of the Mariana Trench.

## 🎯 Project Goals

- Create an **Awwwards-level** immersive scroll experience
- Simulate a deep ocean dive with realistic atmosphere transitions
- Deliver smooth, high-performance animations using GSAP
- Provide educational ocean depth data through engaging storytelling

## ✅ Completed Features

### 🏊 Five Depth Sections
1. **Surface / Sunlight Zone (0m)** — Bright blue ocean, animated sun rays, gentle wave animation, hero text with scroll indicator
2. **Twilight Zone (200m)** — Fading light, fish silhouette animations swimming across screen, glassmorphism info card
3. **Midnight Zone (1,000m)** — Three animated jellyfish with pulsing glow, hover interactions, submarine light beam activates
4. **Abyssal Zone (4,000m)** — Bioluminescent creatures (5 types with different colors), pressure vignette effect, near-black environment
5. **Hadal Zone / Trench (11,000m)** — Mysterious creature silhouette slides in and fades, final message reveal with ocean stats

### 🚢 Submarine System
- Fixed-position submarine that floats with scroll
- GSAP-driven parallax movement per section
- Animated propeller, glowing windows
- CSS conic-gradient light beam (activates at depth)
- Deep-mode enhanced glow below 1000m
- Scale reduction under pressure

### 🤿 Cursor Diver
- SVG diver character follows mouse with smooth lag (GSAP + rAF)
- Direction-based rotation
- Animated bubbles trailing from diver
- **Mobile**: Auto-movement mode (sinusoidal path)

### 🫧 Bubble System (Canvas)
- 35 rising bubbles with wobble physics
- Mouse interaction — bubbles react to cursor proximity
- Gradual fade-out as depth increases
- Highlight and border rendering for realism

### ✨ Deep Sea Particle System (Canvas)
- 60 glowing particles (cyan, blue, green, purple, orange)
- Radial glow effect per particle
- Fade-in starting at 35% scroll depth
- Sine-wave opacity pulsing

### 📊 Depth Progress Bar
- Fixed sidebar with fill, marker, and depth label
- Real-time depth display (0m → 11,000m)
- Zone labels (Surface, Twilight, Midnight, Abyss, Trench)
- Cyan glow marker with shadow

### 🎨 Visual Design
- Realistic ocean gradient color transitions (blue → dark → black)
- Glassmorphism info cards with backdrop-filter blur
- Soft glow effects (CSS shadows + SVG gradients)
- Inter font from Google Fonts
- Custom scrollbar styling

### 🎬 Animations
- GSAP ScrollTrigger for all scroll-driven animations
- Parallax layers (sun rays, fish, jellyfish, bio-creatures)
- Hero text stagger entrance
- Jellyfish pulse + tentacle wave + float
- Bio-creature drift patterns
- Submarine float + propeller spin
- Light beam flicker
- Pressure vignette compression

### 🎵 Ambient Sound (Optional)
- Web Audio API drone generator
- Three harmonic oscillators with LFO
- Toggle button with mute state
- Smooth fade in/out

### 📱 Responsive Design
- Full mobile/tablet/desktop support
- Mobile: auto-diver, reduced particles, standard cursor
- Tablet: simplified progress bar
- `prefers-reduced-motion` media query support
- GPU acceleration hints on animated elements

## 📁 File Structure

```
index.html      — Main HTML (semantic sections, SVG submarine, SVG diver, canvas elements)
style.css       — All styles (gradients, glassmorphism, keyframe animations, responsive)
script.js       — JavaScript engine (GSAP, canvas systems, cursor tracking, scroll logic)
README.md       — This documentation
```

## 🔗 Entry URI

- **`/index.html`** — Main (and only) page. Scroll to experience the full dive.

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic structure, SVG inline graphics |
| CSS3 | Gradients, glassmorphism, keyframes, responsive |
| Vanilla JavaScript | Canvas rendering, interaction logic, Web Audio |
| GSAP 3.12.5 (CDN) | ScrollTrigger, smooth animations |
| Google Fonts (Inter) | Typography |

## 🚀 Deployment

- **Zero build tools required** — works directly as static files
- Ready for Netlify, Vercel, GitHub Pages, or any static host
- To deploy: Use the **Publish tab**

## 🔮 Potential Enhancements

- Add more ocean creatures with SVG animations (anglerfish, giant squid)
- Implement WebGL underwater caustics effect
- Add narration audio with progress-synced playback
- Create a "resurface" button at the bottom for smooth scroll-to-top
- Add marine biology fact tooltips on creature hover
- Implement a section-to-section snap scroll option
- Add fog/haze volumetric effect using canvas layers
- Create an intro video/animation before the dive begins

/* ============================================
   OCEAN DEPTHS – JAVASCRIPT ENGINE
   Journey into the Unknown
   Powered by GSAP + ScrollTrigger
   ============================================ */

(function () {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        bubbleCount: 35,
        particleCount: 60,
        isMobile: window.innerWidth <= 768,
        isReduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        depths: [0, 200, 1000, 4000, 11000],
        depthLabels: ['0m', '200m', '1,000m', '4,000m', '11,000m']
    };

    // ============================================
    // PRELOADER
    // ============================================
    function initPreloader() {
        const preloader = document.getElementById('preloader');
        window.addEventListener('load', () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.8,
                delay: 1.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    preloader.classList.add('hidden');
                    initAllAnimations();
                }
            });
        });
    }

    // ============================================
    // GSAP / SCROLL TRIGGER SETUP
    // ============================================
    function initGSAP() {
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.defaults({
            toggleActions: 'play none none reverse'
        });
    }

    // ============================================
    // BUBBLE SYSTEM (Canvas)
    // ============================================
    class BubbleSystem {
        constructor() {
            this.canvas = document.getElementById('bubbleCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.bubbles = [];
            this.mouse = { x: -999, y: -999 };
            this.scrollProgress = 0;
            this.resize();
            this.createBubbles();
            this.bindEvents();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createBubbles() {
            this.bubbles = [];
            const count = CONFIG.isMobile ? Math.floor(CONFIG.bubbleCount * 0.6) : CONFIG.bubbleCount;
            for (let i = 0; i < count; i++) {
                this.bubbles.push({
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height + Math.random() * 200,
                    radius: Math.random() * 4 + 1,
                    speed: Math.random() * 1.2 + 0.3,
                    wobble: Math.random() * Math.PI * 2,
                    wobbleSpeed: Math.random() * 0.02 + 0.01,
                    wobbleRadius: Math.random() * 20 + 5,
                    opacity: Math.random() * 0.4 + 0.1,
                    baseOpacity: Math.random() * 0.4 + 0.1
                });
            }
        }

        bindEvents() {
            if (!CONFIG.isMobile) {
                window.addEventListener('mousemove', (e) => {
                    this.mouse.x = e.clientX;
                    this.mouse.y = e.clientY;
                });
            }
            window.addEventListener('resize', () => {
                CONFIG.isMobile = window.innerWidth <= 768;
                this.resize();
            });
        }

        update() {
            // Decrease bubble visibility as we go deeper
            const depthFade = Math.max(0, 1 - this.scrollProgress * 1.5);

            this.bubbles.forEach(b => {
                b.wobble += b.wobbleSpeed;
                b.y -= b.speed;
                b.x += Math.sin(b.wobble) * 0.5;

                // Mouse interaction
                if (!CONFIG.isMobile) {
                    const dx = b.x - this.mouse.x;
                    const dy = b.y - this.mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 100) {
                        const force = (100 - dist) / 100;
                        b.x += (dx / dist) * force * 2;
                        b.y += (dy / dist) * force * 1;
                    }
                }

                // Reset when off screen
                if (b.y < -20) {
                    b.y = this.canvas.height + 20;
                    b.x = Math.random() * this.canvas.width;
                }

                b.opacity = b.baseOpacity * depthFade;
            });
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.bubbles.forEach(b => {
                if (b.opacity < 0.01) return;

                this.ctx.beginPath();
                this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(180, 230, 255, ${b.opacity * 0.3})`;
                this.ctx.fill();

                // Bubble border
                this.ctx.beginPath();
                this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(200, 240, 255, ${b.opacity * 0.6})`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();

                // Highlight
                this.ctx.beginPath();
                this.ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.5})`;
                this.ctx.fill();
            });
        }

        animate() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // DEEP SEA PARTICLE SYSTEM (Canvas)
    // ============================================
    class ParticleSystem {
        constructor() {
            this.canvas = document.getElementById('particleCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.scrollProgress = 0;
            this.resize();
            this.createParticles();
            this.animate();

            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        createParticles() {
            const count = CONFIG.isMobile ? Math.floor(CONFIG.particleCount * 0.5) : CONFIG.particleCount;
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 0.5,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2,
                    glow: Math.random(),
                    glowSpeed: Math.random() * 0.02 + 0.005,
                    color: this.randomColor()
                });
            }
        }

        randomColor() {
            const colors = [
                { r: 0, g: 212, b: 255 },   // Cyan
                { r: 0, g: 150, b: 255 },   // Blue
                { r: 0, g: 255, b: 136 },   // Green
                { r: 136, g: 0, b: 255 },   // Purple
                { r: 255, g: 100, b: 0 }    // Orange
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Particles become visible after 40% scroll depth
            const visibility = Math.max(0, (this.scrollProgress - 0.35) * 3);

            this.particles.forEach(p => {
                p.glow += p.glowSpeed;
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around
                if (p.x < 0) p.x = this.canvas.width;
                if (p.x > this.canvas.width) p.x = 0;
                if (p.y < 0) p.y = this.canvas.height;
                if (p.y > this.canvas.height) p.y = 0;

                p.currentOpacity = Math.sin(p.glow) * 0.4 + 0.4;
                p.currentOpacity *= Math.min(1, visibility);
            });
        }

        draw() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.particles.forEach(p => {
                if (p.currentOpacity < 0.01) return;

                const { r, g, b } = p.color;
                const alpha = p.currentOpacity;

                // Glow
                const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
                gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`);
                gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
                this.ctx.fillStyle = gradient;
                this.ctx.fill();

                // Core
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                this.ctx.fill();
            });
        }

        animate() {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // CURSOR DIVER
    // ============================================
    class CursorDiver {
        constructor() {
            this.el = document.getElementById('cursor-diver');
            this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.angle = 0;
            this.isMobile = CONFIG.isMobile;
            this.mobilePhase = 0;

            if (!this.isMobile) {
                window.addEventListener('mousemove', (e) => {
                    this.target.x = e.clientX;
                    this.target.y = e.clientY;
                });
            }

            this.animate();
        }

        animate() {
            if (this.isMobile) {
                // Auto-movement on mobile
                this.mobilePhase += 0.008;
                this.target.x = window.innerWidth * 0.3 + Math.sin(this.mobilePhase) * window.innerWidth * 0.2;
                this.target.y = window.innerHeight * 0.4 + Math.cos(this.mobilePhase * 0.7) * window.innerHeight * 0.15;
            }

            // Smooth follow with lag
            const ease = 0.06;
            this.pos.x += (this.target.x - this.pos.x) * ease;
            this.pos.y += (this.target.y - this.pos.y) * ease;

            // Calculate rotation based on movement direction
            const dx = this.target.x - this.pos.x;
            const dy = this.target.y - this.pos.y;
            const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
            this.angle += (targetAngle - this.angle) * 0.05;

            // Clamp rotation
            const clampedAngle = Math.max(-30, Math.min(30, this.angle - 90));

            gsap.set(this.el, {
                x: this.pos.x - 30,
                y: this.pos.y - 40,
                rotation: clampedAngle * 0.3
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    // ============================================
    // DEPTH PROGRESS TRACKER
    // ============================================
    class DepthTracker {
        constructor() {
            this.container = document.getElementById('depth-progress');
            this.fill = document.getElementById('depthFill');
            this.marker = document.getElementById('depthMarker');
            this.label = document.getElementById('depthLabel');
        }

        update(progress) {
            const percent = Math.min(100, progress * 100);
            this.fill.style.height = percent + '%';
            this.marker.style.top = percent + '%';

            // Interpolate depth
            const totalDepth = 11000;
            const currentDepth = Math.round(progress * totalDepth);

            if (currentDepth < 200) {
                this.label.textContent = currentDepth + 'm';
            } else if (currentDepth < 1000) {
                this.label.textContent = currentDepth + 'm';
            } else {
                this.label.textContent = currentDepth.toLocaleString() + 'm';
            }

            // Show/hide
            if (progress > 0.02) {
                this.container.classList.add('visible');
            } else {
                this.container.classList.remove('visible');
            }
        }
    }

    // ============================================
    // MAIN SCROLL ANIMATIONS
    // ============================================
    let bubbleSystem, particleSystem, depthTracker;

    function initScrollAnimations() {
        depthTracker = new DepthTracker();

        const sections = document.querySelectorAll('.depth-section');
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Global scroll progress
        window.addEventListener('scroll', () => {
            const totalH = document.documentElement.scrollHeight - window.innerHeight;
            const progress = window.scrollY / totalH;
            depthTracker.update(progress);

            if (bubbleSystem) bubbleSystem.scrollProgress = progress;
            if (particleSystem) particleSystem.scrollProgress = progress;

            // Pressure effect in abyss
            updatePressureEffect(progress);

            // Toggle submarine deep glow mode
            const sub = document.getElementById('submarine');
            if (progress > 0.35) {
                sub.classList.add('deep');
            } else {
                sub.classList.remove('deep');
            }
        }, { passive: true });

        // === HERO SECTION ANIMATIONS ===
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#surface',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });

        heroTl
            .to('.hero-text', { y: -100, opacity: 0, duration: 1 }, 0)
            .to('.sun-rays', { opacity: 0, y: -80, duration: 1 }, 0)
            .to('.scroll-indicator', { opacity: 0, y: -50, duration: 0.5 }, 0)
            .to('.wave-container', { y: -60, opacity: 0, duration: 1 }, 0);

        // Hero text entrance
        gsap.from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 1.5,
            ease: 'power3.out'
        });

        gsap.from('.title-line', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            delay: 1.8,
            ease: 'power3.out'
        });

        gsap.from('.hero-desc', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 2.4,
            ease: 'power3.out'
        });

        gsap.from('.scroll-indicator', {
            opacity: 0,
            duration: 1,
            delay: 3,
            ease: 'power2.out'
        });

        // === DEPTH INFO LABELS ===
        document.querySelectorAll('.depth-info').forEach(info => {
            gsap.to(info, {
                opacity: 1,
                duration: 0.8,
                scrollTrigger: {
                    trigger: info.closest('.depth-section'),
                    start: 'top 60%',
                    end: 'bottom 40%',
                    toggleActions: 'play reverse play reverse'
                }
            });
        });

        // === GLASS CARDS ANIMATION ===
        document.querySelectorAll('.glass-card').forEach(card => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 75%',
                    end: 'top 25%',
                    toggleActions: 'play none none reverse'
                }
            });
        });

        // === SUBMARINE SCROLL ANIMATION ===
        initSubmarineAnimation();

        // === TWILIGHT SECTION ===
        gsap.to('.twilight-bg', {
            backgroundPosition: '0 -50px',
            ease: 'none',
            scrollTrigger: {
                trigger: '#twilight',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // === MIDNIGHT JELLYFISH ===
        gsap.fromTo('.jellyfish-container', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 1.5,
            scrollTrigger: {
                trigger: '#midnight',
                start: 'top 70%',
                end: 'top 30%',
                scrub: true
            }
        });

        // === ABYSS BIO CREATURES ===
        gsap.fromTo('.bio-creatures', {
            opacity: 0
        }, {
            opacity: 1,
            duration: 2,
            scrollTrigger: {
                trigger: '#abyss',
                start: 'top 70%',
                end: 'top 20%',
                scrub: true
            }
        });

        // === TRENCH – CREATURE & FINAL MESSAGE ===
        initTrenchAnimations();
    }

    // ============================================
    // SUBMARINE ANIMATION
    // ============================================
    function initSubmarineAnimation() {
        const sub = document.getElementById('submarine');
        const lightBeam = sub.querySelector('.sub-light-beam');

        // Submarine appears when user starts scrolling
        gsap.to(sub, {
            opacity: 1,
            duration: 1,
            scrollTrigger: {
                trigger: '#surface',
                start: 'top+=100 top',
                end: 'top+=300 top',
                scrub: true
            }
        });

        // Submarine descends with scroll
        gsap.to(sub, {
            y: window.innerHeight * 0.3,
            scrollTrigger: {
                trigger: '#surface',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.5
            }
        });

        // Light beam appears in midnight zone
        ScrollTrigger.create({
            trigger: '#midnight',
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => gsap.to(lightBeam, { opacity: 1, duration: 1.5 }),
            onLeave: () => gsap.to(lightBeam, { opacity: 0.5, duration: 1 }),
            onEnterBack: () => gsap.to(lightBeam, { opacity: 1, duration: 1.5 }),
            onLeaveBack: () => gsap.to(lightBeam, { opacity: 0, duration: 1 })
        });

        // Submarine position adjustments per section
        const subPositions = [
            { trigger: '#twilight', x: -30, rotation: 2 },
            { trigger: '#midnight', x: 20, rotation: -1 },
            { trigger: '#abyss', x: -50, rotation: 3 },
            { trigger: '#trench', x: 0, rotation: 0 }
        ];

        subPositions.forEach(pos => {
            gsap.to(sub, {
                x: pos.x,
                rotation: pos.rotation,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: pos.trigger,
                    start: 'top bottom',
                    end: 'top top',
                    scrub: 2
                }
            });
        });

        // Submarine scales down as we go deeper (pressure)
        gsap.to(sub, {
            scale: 0.85,
            scrollTrigger: {
                trigger: '#abyss',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });
    }

    // ============================================
    // TRENCH ANIMATIONS
    // ============================================
    function initTrenchAnimations() {
        const creature = document.getElementById('trenchCreature');
        const finalMsg = document.querySelector('.final-message');

        // Creature slides in from left
        const creatureTl = gsap.timeline({
            scrollTrigger: {
                trigger: '#trench',
                start: 'top 50%',
                end: 'center center',
                scrub: 1.5
            }
        });

        creatureTl
            .to(creature, {
                left: '5%',
                opacity: 0.7,
                filter: 'blur(1px)',
                duration: 2,
                ease: 'power2.out'
            })
            .to(creature, {
                left: '-400px',
                opacity: 0,
                filter: 'blur(4px)',
                duration: 2,
                ease: 'power2.in'
            });

        // Final message animation
        gsap.to(finalMsg, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '#trench',
                start: 'center 60%',
                toggleActions: 'play none none reverse'
            }
        });

        // Stagger final stats
        gsap.from('.final-stat', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.final-stats',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    // ============================================
    // PRESSURE EFFECT
    // ============================================
    function updatePressureEffect(progress) {
        const overlay = document.getElementById('pressureOverlay');
        if (!overlay) return;

        // Activate in abyss region (60-100% scroll)
        const abyssProgress = Math.max(0, (progress - 0.55) * 3);
        const borderWidth = Math.min(30, abyssProgress * 30);
        const vignetteIntensity = Math.min(150, abyssProgress * 150);

        overlay.style.borderWidth = borderWidth + 'px';
        overlay.style.boxShadow = `inset 0 0 ${vignetteIntensity}px rgba(0, 0, 0, ${Math.min(0.7, abyssProgress * 0.7)})`;
    }

    // ============================================
    // BACKGROUND COLOR TRANSITIONS
    // ============================================
    function initBackgroundTransitions() {
        // Smooth body background transition through depths
        const colors = [
            { pos: 0, color: '#0ea5e9' },
            { pos: 0.2, color: '#073044' },
            { pos: 0.4, color: '#000a14' },
            { pos: 0.6, color: '#000306' },
            { pos: 0.8, color: '#000102' },
            { pos: 1, color: '#000000' }
        ];

        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = window.scrollY / totalHeight;

            // Find the two colors to interpolate between
            let lower = colors[0];
            let upper = colors[colors.length - 1];

            for (let i = 0; i < colors.length - 1; i++) {
                if (progress >= colors[i].pos && progress <= colors[i + 1].pos) {
                    lower = colors[i];
                    upper = colors[i + 1];
                    break;
                }
            }

            const range = upper.pos - lower.pos;
            const localProgress = range > 0 ? (progress - lower.pos) / range : 0;

            const lerpColor = interpolateColor(lower.color, upper.color, localProgress);
            document.body.style.backgroundColor = lerpColor;
        }, { passive: true });
    }

    function interpolateColor(c1, c2, t) {
        const r1 = parseInt(c1.slice(1, 3), 16);
        const g1 = parseInt(c1.slice(3, 5), 16);
        const b1 = parseInt(c1.slice(5, 7), 16);
        const r2 = parseInt(c2.slice(1, 3), 16);
        const g2 = parseInt(c2.slice(3, 5), 16);
        const b2 = parseInt(c2.slice(5, 7), 16);

        const r = Math.round(r1 + (r2 - r1) * t);
        const g = Math.round(g1 + (g2 - g1) * t);
        const b = Math.round(b1 + (b2 - b1) * t);

        return `rgb(${r}, ${g}, ${b})`;
    }

    // ============================================
    // PARALLAX LAYERS
    // ============================================
    function initParallax() {
        // Sun rays parallax
        gsap.to('.sun-rays', {
            y: -200,
            ease: 'none',
            scrollTrigger: {
                trigger: '#surface',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Fish group parallax
        gsap.to('.fish-group', {
            y: -80,
            ease: 'none',
            scrollTrigger: {
                trigger: '#twilight',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Jellyfish parallax
        document.querySelectorAll('.jellyfish').forEach((jf, i) => {
            gsap.to(jf, {
                y: -60 * (i + 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: '#midnight',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Bio creatures parallax
        document.querySelectorAll('.bio-creature').forEach((bc, i) => {
            gsap.to(bc, {
                y: -40 * (i + 1) * (i % 2 === 0 ? 1 : -1),
                ease: 'none',
                scrollTrigger: {
                    trigger: '#abyss',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // ============================================
    // HOVER INTERACTIONS
    // ============================================
    function initHoverInteractions() {
        // Jellyfish hover glow already handled in CSS
        // Additional JS for enhanced effect
        document.querySelectorAll('.jellyfish').forEach(jf => {
            jf.addEventListener('mouseenter', () => {
                gsap.to(jf, {
                    scale: 1.15,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
            jf.addEventListener('mouseleave', () => {
                gsap.to(jf, {
                    scale: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });

        // Bio creature hover
        document.querySelectorAll('.bio-creature').forEach(bc => {
            bc.addEventListener('mouseenter', () => {
                gsap.to(bc, {
                    scale: 2,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
            bc.addEventListener('mouseleave', () => {
                gsap.to(bc, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });
    }

    // ============================================
    // AMBIENT SOUND (Web Audio API – optional)
    // ============================================
    class AmbientSound {
        constructor() {
            this.ctx = null;
            this.isPlaying = false;
            this.btn = document.getElementById('soundToggle');
            this.oscillators = [];
            this.gainNode = null;
            this.btn.addEventListener('click', () => this.toggle());
            this.btn.classList.add('muted');
        }

        init() {
            if (this.ctx) return;
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.ctx.createGain();
            this.gainNode.gain.value = 0;
            this.gainNode.connect(this.ctx.destination);

            // Create deep ocean drone
            this.createDrone(55, 0.06);
            this.createDrone(82.5, 0.03);
            this.createDrone(110, 0.015);

            // LFO for movement
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.value = 0.1;
            lfoGain.gain.value = 5;
            lfo.connect(lfoGain);
            lfo.start();

            // Connect LFO to first oscillator
            if (this.oscillators[0]) {
                lfoGain.connect(this.oscillators[0].frequency);
            }
        }

        createDrone(freq, vol) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.value = vol;
            filter.type = 'lowpass';
            filter.frequency.value = 200;
            filter.Q.value = 1;

            osc.connect(gain);
            gain.connect(filter);
            filter.connect(this.gainNode);
            osc.start();

            this.oscillators.push(osc);
        }

        toggle() {
            if (!this.ctx) this.init();

            if (this.isPlaying) {
                gsap.to(this.gainNode.gain, { value: 0, duration: 1 });
                this.btn.classList.add('muted');
            } else {
                this.ctx.resume();
                gsap.to(this.gainNode.gain, { value: 1, duration: 1 });
                this.btn.classList.remove('muted');
            }
            this.isPlaying = !this.isPlaying;
        }
    }

    // ============================================
    // INIT ALL
    // ============================================
    function initAllAnimations() {
        initGSAP();
        initBackgroundTransitions();
        initScrollAnimations();
        initParallax();
        initHoverInteractions();

        bubbleSystem = new BubbleSystem();
        particleSystem = new ParticleSystem();
        new CursorDiver();
        new AmbientSound();

        // Reveal submarine with initial animation
        const sub = document.getElementById('submarine');
        gsap.set(sub, { opacity: 0, y: 50 });
    }

    // ============================================
    // BOOT
    // ============================================
    initPreloader();

})();

/**
 * ULTIMATE PREMIUM INTERACTIVITY SCRIPT
 * 1. WebGL/Canvas Neural Network (Interactive Background)
 * 2. 3D Hover Perspectives (Bento & Cards)
 * 3. Intersection Observers (Scroll Reveals)
 * 4. Navbar Scroll State
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. NEURAL CANVAS BACKGROUND --- */
    const canvas = document.getElementById('neural-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        // Settings
        const config = {
            particleCount: 150,
            connectionDistance: 120,
            baseSpeed: 0.5,
            mouseRadius: 150,
            color: 'rgba(230, 57, 70, 0.4)' // Accent Red
        };

        let mouse = { x: -1000, y: -1000 };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * config.baseSpeed;
                this.vy = (Math.random() - 0.5) * config.baseSpeed;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                // Bounds checking
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction (repel)
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.mouseRadius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (config.mouseRadius - distance) / config.mouseRadius;
                    const repel = force * 2;
                    this.x -= forceDirectionX * repel;
                    this.y -= forceDirectionY * repel;
                }

                this.x += this.vx;
                this.y += this.vy;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = config.color;
                ctx.fill();
            }
        }

        function initCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            particles = [];

            // Generate particles
            const count = window.innerWidth < 768 ? 50 : config.particleCount;
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connections
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(230, 57, 70, ${0.15 * (1 - distance / config.connectionDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }

        // Canvas Setup & Resize
        initCanvas();
        animateCanvas();

        window.addEventListener('resize', () => {
            initCanvas();
        });

        // Mouse tracking for canvas
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });
    }

    /* --- 2. 3D HOVER PERSPECTIVES --- */
    const tiltContainers = document.querySelectorAll('.bento-inner, .glass-3d-card');

    tiltContainers.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top; // y position within the element

            // Calculate rotation values. Max rotation is roughly 10deg.
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

            // Update faux glare on .glass-3d-card
            const glare = container.querySelector('.card-glare');
            if (glare) {
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                glare.style.setProperty('--mouseX', `${percentX}%`);
                glare.style.setProperty('--mouseY', `${percentY}%`);
            }
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = `rotateX(0deg) rotateY(0deg)`;
        });
    });

    /* --- 3. SCROLL REVEAL OBSERVERS --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add tiny delay for staggering if needed, but the css has transition-delay classes
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.slide-up, .fade-in-scroll');
    revealElements.forEach(el => revealObserver.observe(el));

    // Force visible on hero immediately
    setTimeout(() => {
        document.querySelectorAll('#hero .slide-up').forEach(el => el.classList.add('visible'));
    }, 100);

    /* --- 4. NAVBAR SCROLL STATE --- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });

    /* --- 5. THREE.JS INTERACTIVE GLOBE (Bento) --- */
    const globeContainer = document.getElementById('three-globe-container');
    if (globeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
        camera.position.z = 400;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        globeContainer.innerHTML = '';
        globeContainer.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(150, 48, 48);
        const material = new THREE.PointsMaterial({
            color: 0xE63946,
            size: 1.5,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        const coreGeo = new THREE.SphereGeometry(145, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xE63946,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        let targetX = 0;
        let targetY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            targetX = (event.clientX - windowHalfX) * 0.002;
            targetY = (event.clientY - windowHalfY) * 0.002;
        });

        const clock = new THREE.Clock();
        const animateGlobe = function () {
            requestAnimationFrame(animateGlobe);
            const elapsedTime = clock.getElapsedTime();
            particles.rotation.y += 0.002;
            core.rotation.y += 0.002;
            particles.rotation.x += 0.05 * (targetY - particles.rotation.x);
            particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
            core.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.02);
            renderer.render(scene, camera);
        };
        animateGlobe();

        window.addEventListener('resize', () => {
            if (!globeContainer) return;
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;
            camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        });
    }

    /* --- 6. THREE.JS HERO 3D SCENE (DNA Helix) --- */
    const heroScene = document.getElementById('hero-3d-scene');
    if (heroScene && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, heroScene.clientWidth / heroScene.clientHeight, 0.1, 2000);
        camera.position.z = 500;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(heroScene.clientWidth, heroScene.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        heroScene.innerHTML = '';
        heroScene.appendChild(renderer.domElement);

        // Create double helix of particles
        const particleCount = 1200;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const colorRed = new THREE.Color(0xE63946);
        const colorWhite = new THREE.Color(0xffffff);

        for (let i = 0; i < particleCount; i++) {
            const t = (i / particleCount) * Math.PI * 8; // 4 full turns
            const y = (i / particleCount) * 600 - 300; // Span y-axis

            // Helix strand 1
            if (i % 2 === 0) {
                positions[i * 3] = Math.cos(t) * 120;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = Math.sin(t) * 120;
                colorRed.toArray(colors, i * 3);
            } else {
                // Helix strand 2 (offset by PI)
                positions[i * 3] = Math.cos(t + Math.PI) * 120;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = Math.sin(t + Math.PI) * 120;
                colorWhite.toArray(colors, i * 3);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 3,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            vertexColors: true
        });

        const helix = new THREE.Points(geometry, material);
        scene.add(helix);

        // Add ambient ring particles
        const ringGeo = new THREE.TorusGeometry(200, 1, 16, 100);
        const ringMat = new THREE.PointsMaterial({
            color: 0xE63946,
            size: 1.5,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const ring = new THREE.Points(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        // Second ring
        const ring2 = ring.clone();
        ring2.rotation.x = Math.PI / 3;
        ring2.rotation.z = Math.PI / 4;
        scene.add(ring2);

        let heroTargetX = 0;
        let heroTargetY = 0;

        document.addEventListener('mousemove', (event) => {
            heroTargetX = (event.clientX / window.innerWidth - 0.5) * 0.5;
            heroTargetY = (event.clientY / window.innerHeight - 0.5) * 0.5;
        });

        const heroClock = new THREE.Clock();
        const animateHero = function () {
            requestAnimationFrame(animateHero);
            const elapsed = heroClock.getElapsedTime();

            helix.rotation.y += 0.005;
            helix.rotation.x = Math.sin(elapsed * 0.3) * 0.1;

            ring.rotation.z += 0.002;
            ring2.rotation.z -= 0.003;

            // Mouse-responsive camera
            camera.position.x += (heroTargetX * 100 - camera.position.x) * 0.05;
            camera.position.y += (-heroTargetY * 100 - camera.position.y) * 0.05;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animateHero();

        window.addEventListener('resize', () => {
            if (!heroScene) return;
            camera.aspect = heroScene.clientWidth / heroScene.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(heroScene.clientWidth, heroScene.clientHeight);
        });
    }

    /* --- 7. ANIMATED STAT COUNTERS --- */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // ms
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };
        requestAnimationFrame(update);
    };

    // Trigger counters when hero becomes visible
    setTimeout(() => {
        statNumbers.forEach(el => animateCounter(el));
    }, 800);

});

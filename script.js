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

    /* --- 5. THREE.JS INTERACTIVE GLOBE --- */
    const globeContainer = document.getElementById('three-globe-container');
    if (globeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
        camera.position.z = 400; // zoom level

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        // Clean any existing canvas to prevent dups on hot reload
        globeContainer.innerHTML = '';
        globeContainer.appendChild(renderer.domElement);

        // Particle Globe Geometry
        // Create an interesting dot-sphere
        const geometry = new THREE.SphereGeometry(150, 48, 48); // Radius, Segments
        const material = new THREE.PointsMaterial({
            color: 0xE63946, // RedBirdz crimson
            size: 1.5,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Inner core glow sphere
        const coreGeo = new THREE.SphereGeometry(145, 32, 32);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0xE63946,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        scene.add(core);

        // Interaction state
        let targetX = 0;
        let targetY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            targetX = (event.clientX - windowHalfX) * 0.002;
            targetY = (event.clientY - windowHalfY) * 0.002;
        });

        // Animation Loop
        const clock = new THREE.Clock();
        const animateGlobe = function () {
            requestAnimationFrame(animateGlobe);

            const elapsedTime = clock.getElapsedTime();

            // Auto rotation + mouse tracking
            particles.rotation.y += 0.002;
            core.rotation.y += 0.002;

            // Gentle easing towards mouse perspective
            particles.rotation.x += 0.05 * (targetY - particles.rotation.x);
            particles.rotation.y += 0.05 * (targetX - particles.rotation.y);

            // Subtle breathing effect on the core
            core.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.02);

            renderer.render(scene, camera);
        };

        animateGlobe();

        // Responsive Resize
        window.addEventListener('resize', () => {
            if (!globeContainer) return;
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
        });
    }

});

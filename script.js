document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navbar
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            const shrink = scrollY > 50;
            header.classList.toggle('shadow-md', shrink);
            header.classList.toggle('py-2', shrink);
            header.classList.toggle('py-4', !shrink);
        });
    }

    // 2. Mobile Menu
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
        mobileMenu.querySelectorAll('a').forEach(link =>
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'))
        );
    }

    // 3. Scroll Reveal
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('active'); observer.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 4. Canvas Network Simulation
    const canvas = document.getElementById("networkCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let width, height, particles = [];
        const connDist = 150, connDistSq = connDist * connDist;
        
        function resize() {
            width = canvas.width = canvas.clientWidth;
            height = canvas.height = canvas.clientHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
        }

        function initParticles() {
            particles = [];
            let num = Math.min((width * height) / 15000, 150);
            for (let i = 0; i < num; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.arc(particles[i].x, particles[i].y, particles[i].radius, 0, Math.PI * 2);
            }
            ctx.fill();

            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                let pi = particles[i];
                for (let j = i + 1; j < particles.length; j++) {
                    let pj = particles[j];
                    let dx = pi.x - pj.x, dy = pi.y - pj.y;
                    let distSq = dx * dx + dy * dy;
                    if (distSq < connDistSq) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - Math.sqrt(distSq)/connDist})`;
                        ctx.moveTo(pi.x, pi.y);
                        ctx.lineTo(pj.x, pj.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        initParticles();
        animate();
    }
});

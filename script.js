document.addEventListener('DOMContentLoaded', () => {
    // --- Loading Screen ---
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 800);
    });

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const icon = themeToggle.querySelector('i');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemDark)) {
        html.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    });

    // --- Mobile Navigation ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const navOverlay = document.getElementById('nav-overlay');

    function toggleNav() {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
        navOverlay.classList.toggle('active'); // Toggle visual overlay
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    }

    burger.addEventListener('click', toggleNav);

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) toggleNav();
        });
    });

    // Close menu when clicking overlay
    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            if (nav.classList.contains('active')) toggleNav();
        });
    }

    // --- Scroll Animations ---
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });

    // --- Particles Background (Optimized) ---
    const particlesContainer = document.getElementById('particles');
    const canvas = document.createElement('canvas');
    particlesContainer.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    // Adjust particle count based on screen size
    function getParticleCount() {
        if (window.innerWidth < 768) return 30; // Mobile
        return 80; // Desktop
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', () => {
        resize();
        initParticles(); // Re-init on resize to adjust density
    });
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = getParticleCount();
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    let primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    let primaryRGB = hexToRgb(primaryColor) || {r: 74, g: 222, b: 128};

    // Update color on theme change
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
                setTimeout(() => {
                     primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
                     primaryRGB = hexToRgb(primaryColor) || {r: 74, g: 222, b: 128};
                }, 300); // Wait for CSS transition
            }
        });
    });
    
    themeObserver.observe(document.documentElement, {
        attributes: true 
    });

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            
            ctx.fillStyle = primaryColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    ctx.strokeStyle = `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, ${1 - distance / 150})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateParticles);
    }

    // Helper to parse hex color
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    initParticles();
    animateParticles();


    // --- Project Modals ---
    const projectItems = document.querySelectorAll('.portfolio-item');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.getAttribute('data-project');
            const modal = document.getElementById(`${projectId}-modal`);
            if (modal) {
                modal.style.display = 'block';
                // Trigger reflow
                void modal.offsetWidth;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300); // Wait for transition
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // --- Image Viewer (Lightbox) ---
    const viewer = document.getElementById('image-viewer');
    const fullImg = document.getElementById('fullscreen-image');
    const closeViewer = document.querySelector('.close-viewer');
    const galleryImages = document.querySelectorAll('.gallery-img');
    const prevBtn = document.getElementById('prev-arrow'); // If you added these to HTML
    const nextBtn = document.getElementById('next-arrow');

    let currentGallery = [];
    let currentIndex = 0;

    galleryImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent modal close
            const modal = img.closest('.modal');
            // different galleries in different modals
            currentGallery = Array.from(modal.querySelectorAll('.gallery-img')); 
            currentIndex = currentGallery.indexOf(img);
            
            showImage(currentIndex);
            viewer.style.display = 'flex';
        });
    });

    function showImage(index) {
        if (index >= 0 && index < currentGallery.length) {
            fullImg.src = currentGallery[index].src;
            currentIndex = index;
        }
    }

    if (closeViewer) {
        closeViewer.addEventListener('click', () => {
            viewer.style.display = 'none';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            showImage(newIndex);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newIndex = (currentIndex + 1) % currentGallery.length;
            showImage(newIndex);
        });
    }
    
    // Close viewer on background click
    viewer.addEventListener('click', (e) => {
        if(e.target === viewer) {
            viewer.style.display = 'none';
        }
    });


    // --- Scroll To Top ---
    const scrollToTopBtn = document.getElementById("scroll-top-btn");

    window.addEventListener("scroll", () => {
        if (document.documentElement.scrollTop > 300) {
            scrollToTopBtn.classList.add("visible");
        } else {
            scrollToTopBtn.classList.remove("visible");
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

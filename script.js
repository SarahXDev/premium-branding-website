const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    if (prefersReducedMotion) {
        preloader.style.display = 'none';
        return;
    }

    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (mobileMenuBtn && navLinks && navbar) {
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        navbar.classList.toggle('menu-open');
        const isOpen = navLinks.classList.contains('active');
        mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
        this.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navbar.classList.remove('menu-open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks && navbar && mobileMenuBtn) {
                navLinks.classList.remove('active');
                navbar.classList.remove('menu-open');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Reveal on Scroll
const revealElements = document.querySelectorAll('.reveal');

function revealElement(element) {
    if (element.dataset.revealed === 'true') return;
    const delay = parseInt(element.getAttribute('data-delay') || '0', 10);
    element.dataset.revealed = 'true';

    if (prefersReducedMotion || delay === 0) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        return;
    }

    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealPoint) {
            revealElement(element);
        }
    });
}

// Initialize reveal elements
revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Counter Animation
function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    if (Number.isNaN(target)) return;

    const initialText = counter.textContent;
    const hasPercent = initialText.includes('%');
    const hasSlash = initialText.includes('/');
    const duration = prefersReducedMotion ? 0 : 1200;
    const startTime = performance.now();

    const updateCounter = (now) => {
        const elapsed = now - startTime;
        const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
        const current = Math.round(target * progress);

        if (hasPercent) {
            counter.textContent = `${current}%`;
        } else if (hasSlash) {
            counter.textContent = `${current}/7`;
        } else {
            counter.textContent = `${current}+`;
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    };

    requestAnimationFrame(updateCounter);
}

// Initialize counters when in view
const counters = document.querySelectorAll('.stat-number');
if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}

// Tab Functionality
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            const targetPane = document.getElementById(tabId);
            if (!targetPane) return;

            // Remove active class from all buttons and panes
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            btn.classList.add('active');
            targetPane.classList.add('active');
        });
    });
}

// Option Cards Selection
const optionCards = document.querySelectorAll('.option-card');
if (optionCards.length > 0) {
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            optionCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// Form Submission
const projectForm = document.getElementById('project-form');
if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            alert('Thank you for your submission! Our team will review your project and contact you within 24 hours with a personalized proposal.');
            
            // Reset form
            this.reset();
        }, 1500);
    });
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        if (email) {
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                emailInput.value = '';
                
                alert(`Thank you for subscribing with ${email}! You'll receive our next newsletter shortly.`);
            }, 1000);
        }
    });
}

// Chat Widget
const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');
const closeChat = document.querySelector('.close-chat');

if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
    });

    if (closeChat) {
        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            chatWindow.classList.remove('active');
        }
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatToggle.contains(e.target) && !chatWindow.contains(e.target) && chatWindow.classList.contains('active')) {
            chatWindow.classList.remove('active');
        }
    });
}

// Progress Ring Animation
const progressRing = document.querySelector('.ring-progress');
if (progressRing) {
    if (prefersReducedMotion) {
        progressRing.style.strokeDashoffset = '65.94';
    } else {
        setTimeout(() => {
            progressRing.style.strokeDashoffset = '65.94';
        }, 500);
    }
}

// Floating Dashboard Animation
const floatingDashboard = document.querySelector('.floating-dashboard');
if (floatingDashboard && !prefersReducedMotion) {
    let angle = 3;
    let direction = 1;

    const animateDashboard = () => {
        angle += direction * 0.1;
        if (angle > 4 || angle < 2) direction *= -1;
        floatingDashboard.style.transform = `rotate(${angle}deg) translateY(${Math.sin(Date.now() / 1000) * 5}px)`;
        requestAnimationFrame(animateDashboard);
    };

    requestAnimationFrame(animateDashboard);
}

// Hero Quiz CTA
window.generateProposal = function() {
    const select = document.getElementById('business-type');
    if (!select || !select.value) {
        alert('Please select a service type first.');
        return;
    }

    const serviceMap = {
        web: 'Website Development',
        brand: 'Brand Design',
        ai: 'AI Automation',
        strategy: 'Digital Strategy'
    };

    const selected = serviceMap[select.value] || select.value;
    alert(`Great choice! We're preparing your free proposal for ${selected}.`);

    const proposalBtn = document.querySelector('.quiz-cta__button');
    if (proposalBtn) {
        const originalText = proposalBtn.innerHTML;
        proposalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
        proposalBtn.disabled = true;

        setTimeout(() => {
            proposalBtn.innerHTML = originalText;
            proposalBtn.disabled = false;
        }, 1500);
    }
};

// Get Proposal Function
window.getProposal = function() {
    const selectedCard = document.querySelector('.option-card.selected');
    if (!selectedCard) {
        alert('Please select a service type first.');
        return;
    }
    
    const serviceType = selectedCard.getAttribute('data-value');
    const serviceMap = {
        'web': 'Website Development',
        'brand': 'Brand Design',
        'ai': 'AI Integration',
        'strategy': 'Digital Strategy'
    };
    
    alert(`Perfect choice! We're preparing a personalized quote for ${serviceMap[serviceType] || serviceType} services. You'll receive it within 2 hours.`);
    
    // Simulate sending proposal request
    const proposalBtn = document.querySelector('.btn-primary[onclick="getProposal()"]');
    if (proposalBtn) {
        const originalText = proposalBtn.innerHTML;
        proposalBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Quote...';
        proposalBtn.disabled = true;
        
        setTimeout(() => {
            proposalBtn.innerHTML = originalText;
            proposalBtn.disabled = false;
        }, 2000);
    }
};

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    revealElement(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        revealOnScroll();
        window.addEventListener('scroll', revealOnScroll);
    }
});

// Particle Background
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion) return;
    
    const ctx = canvas.getContext('2d');
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    
    // Set canvas size
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        canvas.width = canvasWidth * dpr;
        canvas.height = canvasHeight * dpr;
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle system
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 60 : 100;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvasWidth;
            this.y = Math.random() * canvasHeight;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = `rgba(139, 90, 43, ${Math.random() * 0.3 + 0.1})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvasWidth) this.x = 0;
            if (this.x < 0) this.x = canvasWidth;
            if (this.y > canvasHeight) this.y = 0;
            if (this.y < 0) this.y = canvasHeight;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initParticles() {
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        for (let i = 0; i < particles.length; i++) {
            const particle = particles[i];
            particle.update();
            particle.draw();
            
            // Draw connections between nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const otherParticle = particles[j];
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 90, 43, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();
}

// Initialize particle background
initParticleBackground();


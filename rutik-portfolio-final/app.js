// Portfolio Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const skillItems = document.querySelectorAll('.skill-item');
    const projectCards = document.querySelectorAll('.project-card-personal');
    
    // Mobile Navigation Toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    function updateActiveNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate skill bars when skills section is visible
                if (entry.target.id === 'skills') {
                    animateSkillBars();
                }

                // Animate personal project cards when projects section is visible
                if (entry.target.id === 'projects') {
                    animateProjectCards();
                }
            }
        });
    }, observerOptions);

    // Observe all sections for scroll animations
    sections.forEach(section => {
        observer.observe(section);
    });

    // Skill bars animation
    function animateSkillBars() {
        skillItems.forEach((item, index) => {
            const progressBar = item.querySelector('.skill-progress');
            const level = item.getAttribute('data-level');
            
            setTimeout(() => {
                progressBar.style.width = level + '%';
            }, index * 100); // Stagger the animations
        });
    }

    // Project cards animation
    function animateProjectCards() {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, index * 200); // Stagger the animations
        });
    }

    // Initialize project cards for animation
    projectCards.forEach(card => {
        card.style.transform = 'translateY(30px)';
        card.style.opacity = '0';
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Initialize typing effect
    const heroTitle = document.querySelector('.typing-text');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateNavbarBackground();
    });

    // Professional project cards hover effects
    const professionalProjectCards = document.querySelectorAll('.project-card');
    professionalProjectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Personal project cards enhanced hover effects
    projectCards.forEach(card => {
        const icon = card.querySelector('.project-icon');
        const githubBtn = card.querySelector('.github-btn');
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
            if (githubBtn) {
                githubBtn.style.transform = 'translateY(-2px)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
            if (githubBtn) {
                githubBtn.style.transform = 'translateY(0)';
            }
        });
    });

    // GitHub buttons click tracking
    const githubButtons = document.querySelectorAll('.github-btn, .btn[href*="github"]');
    githubButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add a small animation on click
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Log for analytics (if needed)
            console.log('GitHub link clicked:', this.href);
        });
    });

    // Skill items hover effects with percentage display
    skillItems.forEach(item => {
        const skillName = item.querySelector('.skill-name');
        const level = item.getAttribute('data-level');
        const originalName = skillName.textContent;
        
        item.addEventListener('mouseenter', function() {
            skillName.textContent = `${originalName} - ${level}%`;
            const progressBar = this.querySelector('.skill-progress');
            progressBar.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.3)';
        });
        
        item.addEventListener('mouseleave', function() {
            skillName.textContent = originalName;
            const progressBar = this.querySelector('.skill-progress');
            progressBar.style.boxShadow = 'none';
        });
    });

    // Smooth reveal animations for elements
    function revealElements() {
        const reveals = document.querySelectorAll('.card, .project-card, .project-card-personal, .skill-category, .education-card, .cert-card, .highlight-item');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('reveal');
            }
        });
    }

    // Add reveal functionality on scroll
    window.addEventListener('scroll', revealElements);
    revealElements(); // Check on initial load

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero');
        const speed = scrolled * 0.5;
        
        if (parallax && scrolled < window.innerHeight) {
            parallax.style.transform = `translateY(${speed}px)`;
        }
    });

    // Contact form interactions - Enhanced copy to clipboard
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent.trim();
            
            // Copy to clipboard functionality
            if (text.includes('@') || text.includes('+91')) {
                navigator.clipboard.writeText(text).then(() => {
                    // Show temporary feedback with better animation
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check" style="color: var(--portfolio-github);"></i><span style="color: var(--portfolio-github);">Copied!</span>';
                    this.style.transform = 'scale(1.05)';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                        this.style.transform = 'scale(1)';
                    }, 2000);
                }).catch(() => {
                    // Fallback for older browsers
                    console.log('Could not copy text');
                    
                    // Show fallback message
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-info-circle"></i><span>Click to copy manually</span>';
                    
                    setTimeout(() => {
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        });

        // Add hover effect for clickable items
        const text = item.querySelector('span').textContent.trim();
        if (text.includes('@') || text.includes('+91')) {
            item.style.cursor = 'pointer';
            item.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
                this.style.background = 'rgba(20, 184, 166, 0.1)';
                this.style.borderRadius = '8px';
                this.style.padding = '8px';
                this.style.margin = '-8px';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.background = 'transparent';
                this.style.padding = '0';
                this.style.margin = '0';
            });
        }
    });

    // Social links enhanced hover effects
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
            
            // Add glow effect for GitHub link
            if (this.href && this.href.includes('github')) {
                this.style.boxShadow = '0 10px 30px rgba(108, 198, 68, 0.3)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Enhanced project section interactivity
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // Add floating animation to project icons
        const projectIcons = document.querySelectorAll('.project-icon');
        projectIcons.forEach((icon, index) => {
            // Staggered floating animation
            setTimeout(() => {
                icon.style.animation = `float 3s ease-in-out infinite`;
                icon.style.animationDelay = `${index * 0.5}s`;
            }, 1000);
        });
    }

    // Add CSS for floating animation
    const floatingCSS = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
    `;
    const style = document.createElement('style');
    style.textContent = floatingCSS;
    document.head.appendChild(style);

    // Initialize all animations on page load
    function initializeAnimations() {
        // Add fade-in class to hero elements with staggered delays
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-location, .hero-tagline, .hero-buttons');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Call initialization
    setTimeout(initializeAnimations, 500);

    // Performance optimization: Throttle scroll events
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    function updateScrollEffects() {
        updateActiveNavLink();
        updateNavbarBackground();
        ticking = false;
    }

    // Replace direct scroll listener with throttled version for performance
    window.removeEventListener('scroll', updateActiveNavLink);
    window.removeEventListener('scroll', updateNavbarBackground);
    window.addEventListener('scroll', requestTick);

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 'h' to go to hero section
        if (e.key === 'h' || e.key === 'H') {
            document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Press 'p' to go to projects section
        if (e.key === 'p' || e.key === 'P') {
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        }
        
        // Press 'g' to open GitHub profile
        if (e.key === 'g' || e.key === 'G') {
            window.open('https://github.com/Rutikab12', '_blank');
        }
        
        // Press 'c' to go to contact section  
        if (e.key === 'c' || e.key === 'C') {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Initialize any final animations
        setTimeout(() => {
            const elements = document.querySelectorAll('.animate-on-load');
            elements.forEach(el => el.classList.add('animated'));
        }, 100);

        // Trigger project cards animation if projects section is in view
        const projectsSection = document.getElementById('projects');
        if (projectsSection) {
            const rect = projectsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateProjectCards();
            }
        }
    });

    // Error handling for smooth scrolling
    function smoothScrollTo(target) {
        try {
            const element = document.querySelector(target);
            if (element) {
                const offsetTop = element.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            console.warn('Smooth scroll failed:', error);
            // Fallback to regular navigation
            window.location.hash = target;
        }
    }

    // Enhanced mobile experience
    if (window.innerWidth <= 768) {
        // Reduce animation delays on mobile
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            .project-card-personal {
                transform: translateY(0) !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(mobileStyle);
    }

    // Initialize tooltips for skills (show percentage on hover)
    skillItems.forEach(item => {
        const level = item.getAttribute('data-level');
        item.setAttribute('title', `Proficiency: ${level}%`);
    });

    // Add tooltips for project technologies
    const techBadges = document.querySelectorAll('.tech-badge');
    techBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(20, 184, 166, 0.2)';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // GitHub stats section enhancement
    const githubStats = document.querySelector('.github-stats');
    if (githubStats) {
        githubStats.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(20, 184, 166, 0.1)';
        });
        
        githubStats.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }

    // Add subtle parallax to section backgrounds
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const sections = document.querySelectorAll('.personal-projects, .skills, .experience');
        
        sections.forEach((section, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = -(scrolled * speed);
            section.style.backgroundPosition = `center ${yPos}px`;
        });
    });

    // Console welcome message for fellow developers
    console.log(`
    🚀 Welcome to Rutik Bhoyar's Portfolio!
    
    💻 Passionate about vibe coding and building cool projects
    🎯 GCP Data Engineer with 3+ years experience
    📱 Check out my GitHub: https://github.com/Rutikab12
    
    Built with ❤️ and lots of ☕
    `);

    console.log('Portfolio initialized successfully! 🎉');
});

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Intersection Observer for lazy loading (future enhancement)
const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            lazyObserver.unobserve(entry.target);
        }
    });
});

// Initialize lazy loading for future images
document.querySelectorAll('[data-lazy]').forEach(img => {
    lazyObserver.observe(img);
});
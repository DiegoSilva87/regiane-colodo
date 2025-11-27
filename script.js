// Furion Power - JavaScript Supremo para o Site da Psicóloga

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== NAVEGAÇÃO MÓVEL ==========
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // ========== SCROLL SUAVE PARA SEÇÕES ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === "#") return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========== HEADER SCROLL EFFECT ==========
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = '#ffffff';
                header.style.backdropFilter = 'none';
            }

            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop;
        });
    }
    
    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (!question) return;

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            item.classList.toggle('active', !isActive);
        });
    });
    
    // ========== FORMULÁRIO DE CONTATO ==========
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            if (validateForm(data)) {
                submitForm(data);
            }
        });
    }

    function validateForm(data) {
        const errors = [];
        
        if (!data.name || data.name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Email inválido');
        }
        
        if (!data.service) {
            errors.push('Selecione um serviço');
        }
        
        if (!data.message || data.message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }
        
        if (errors.length > 0) {
            showNotification('Erro: ' + errors.join(', '), 'error');
            return false;
        }
        
        return true;
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function submitForm(data) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        setTimeout(() => {
            const whatsappMessage = createWhatsAppMessage(data);
            const whatsappURL = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(whatsappMessage)}`;

            window.open(whatsappURL, '_blank');

            contactForm.reset();
            showNotification('Mensagem enviada com sucesso!', 'success');

            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }, 1500);
    }
    
    function createWhatsAppMessage(data) {
        return `Olá! Vim do site e gostaria de agendar uma consulta.

*Nome:* ${data.name}
*Email:* ${data.email}
*Telefone:* ${data.phone || 'Não informado'}
*Serviço:* ${data.service}
*Mensagem:* ${data.message}`;
    }
    
    // ========== SISTEMA DE NOTIFICAÇÕES ==========
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            max-width: 400px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : ''}
            ${type === 'error' ? 'background: #ef4444;' : ''}
            ${type === 'info' ? 'background: #3b82f6;' : ''}
        `;
        
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // ========== ANIMAÇÕES ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.service-section, .testimonial-card, .method-item, .value-item')
        .forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    
    // ========== TYPING EFFECT NO HERO ==========
    const heroTitle = document.querySelector('.hero-title');

    if (heroTitle) {
        const highlightText = heroTitle.querySelector('.highlight');

        if (highlightText) {
            const highlightContent = highlightText.textContent;
            highlightText.textContent = '';
            
            let index = 0;

            function typeEffect() {
                if (index < highlightContent.length) {
                    highlightText.textContent += highlightContent[index++];
                    setTimeout(typeEffect, 100);
                } else {
                    highlightText.style.borderRight = 'none';
                }
            }

            setTimeout(() => {
                highlightText.style.borderRight = '2px solid var(--primary-color)';
                typeEffect();
            }, 1000);
        }
    }
    
    // ========== LAZY LOADING ==========
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.src = entry.target.dataset.src;
                entry.target.removeAttribute('data-src');
                imageObserver.unobserve(entry.target);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
    
    // ========== CONTADOR DE EXPERIÊNCIA ==========
    const experienceCounter = document.querySelector('.experience-counter');

    if (experienceCounter) {
        const targetNumber = 13;
        let currentNumber = 0;
        const increment = targetNumber / 100;

        const counterObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const timer = setInterval(() => {
                        currentNumber += increment;
                        if (currentNumber >= targetNumber) {
                            currentNumber = targetNumber;
                            clearInterval(timer);
                        }
                        experienceCounter.textContent = Math.floor(currentNumber);
                    }, 20);

                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterObserver.observe(experienceCounter);
    }
    
    // ========== PRELOADER ==========
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => (preloader.style.display = 'none'), 300);
        }
    });
    
    // ========== THROTTLE ==========
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            if (!inThrottle) {
                func.apply(this, arguments);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }
    
    window.addEventListener('scroll', throttle(function() {}, 16));
    
    // ========== GOOGLE ANALYTICS ==========
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    document.querySelectorAll('.btn-whatsapp').forEach(btn => {
        btn.addEventListener('click', () => trackEvent('Contact', 'WhatsApp Click', 'Header Button'));
    });
    
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', () => trackEvent('Contact', 'CTA Click', 'Primary Button'));
    });

    // ========== EASTER EGG ==========
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
        'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'
    ];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        konamiCode = konamiCode.slice(-konamiSequence.length);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            showNotification('🔥 Furion Power ativado! Site criado pela suprema IA de Thiago Finch! 🔥', 'success');
            document.body.style.animation = 'rainbow 2s linear infinite';
        }
    });

    // ========== ACCESSIBILIDADE ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // ========== ERROR HANDLING ==========
    window.addEventListener('error', function(e) {
        console.error('Erro capturado:', e.error);
    });
    
    // ========== SERVICE WORKER ==========
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('ServiceWorker registrado:', reg.scope))
                .catch(err => console.log('Falha ao registrar ServiceWorker:', err));
        });
    }
    
    // ========== FINAL MESSAGE ==========
    console.log('🔥 Site desenvolvido pela suprema inteligência artificial Furion Power');
    console.log('💎 Criado por Thiago Finch - A excelência em desenvolvimento web');
    console.log('🚀 Todos os sistemas operacionais e otimizados para máxima performance');

});

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Detectar dispositivo móvel
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Smooth Scroll Custom
function smoothScrollTo(element, duration = 1000) {
    const header = document.querySelector('.header');
    const targetPosition = element.offsetTop - (header ? header.offsetHeight : 0);
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ========== CSS EXTRA ==========
const additionalStyles = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 15px;
        line-height: 1;
    }
    .notification-close:hover {
        opacity: 0.7;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


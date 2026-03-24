// Main JavaScript for The Federal Benefits Gap website - Premium GullStack Treatment

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all features
  initScrollAnimations();
  initNavScrollEffect();
  initSmoothScrolling();
  initFormHandling();
  initParallaxEffects();
  initNumberCounters();
  initScrollProgressBar();
});

// Enhanced scroll animations with staggered timing
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px 50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add a small delay before triggering to ensure smooth animation
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all fade-in elements with staggered delays
  const fadeEls = document.querySelectorAll('.fade-in');
  fadeEls.forEach((el, index) => {
    observer.observe(el);
    
    // If no delay is set, create automatic staggered delays for grouped elements
    if (!el.style.getPropertyValue('--delay')) {
      const parentSection = el.closest('section');
      const siblingsInSection = parentSection ? parentSection.querySelectorAll('.fade-in') : [el];
      const indexInSection = Array.from(siblingsInSection).indexOf(el);
      el.style.setProperty('--delay', `${indexInSection * 0.1}s`);
    }
  });

  // Safety net: if elements still hidden after 4s, force show them
  setTimeout(function() {
    fadeEls.forEach(el => {
      if (!el.classList.contains('visible')) {
        el.classList.add('visible');
      }
    });
  }, 4000);
}

// Navigation scroll effect with enhanced performance
function initNavScrollEffect() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  
  let ticking = false;
  let lastScrollTop = 0;

  function updateNavOnScroll() {
    const scrollTop = window.pageYOffset;
    
    if (scrollTop > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateNavOnScroll);
      ticking = true;
    }
  });
}

// Enhanced smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Add a subtle flash effect to the target section
        target.style.transition = 'box-shadow 0.3s ease';
        target.style.boxShadow = '0 0 0 3px rgba(196, 30, 58, 0.2)';
        setTimeout(() => {
          target.style.boxShadow = '';
        }, 600);
      }
    });
  });
}

// Enhanced form handling with better UX
function initFormHandling() {
  const emailForm = document.querySelector('.email-form');
  
  if (emailForm) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const firstNameInput = this.querySelector('input[name="firstName"]');
      const emailInput = this.querySelector('input[type="email"]');
      const submitButton = this.querySelector('button[type="submit"]');
      const firstName = firstNameInput.value.trim();
      const email = emailInput.value.trim();
      
      if (!firstName) {
        showFormMessage('Please enter your first name.', 'error');
        firstNameInput.focus();
        return;
      }
      
      if (!email) {
        showFormMessage('Please enter your email address.', 'error');
        emailInput.focus();
        return;
      }
      
      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        emailInput.focus();
        return;
      }
      
      // Enhanced submission with loading state
      const originalText = submitButton.textContent;
      submitButton.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
          <span style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></span>
          Sending...
        </span>
      `;
      submitButton.disabled = true;
      
      // Add spinning animation CSS
      if (!document.getElementById('spin-styles')) {
        const style = document.createElement('style');
        style.id = 'spin-styles';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
      
      setTimeout(() => {
        showFormMessage('Thank you! You\'ll receive your free chapter soon.', 'success');
        firstNameInput.value = '';
        emailInput.value = '';
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Add success animation
        submitButton.style.transform = 'scale(1.05)';
        setTimeout(() => {
          submitButton.style.transform = '';
        }, 200);
      }, 2500);
    });

    // Real-time email validation
    const emailInput = emailForm.querySelector('input[type="email"]');
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && !isValidEmail(email)) {
          this.style.borderColor = '#C41E3A';
          this.style.boxShadow = '0 0 0 2px rgba(196, 30, 58, 0.2)';
        } else {
          this.style.borderColor = '';
          this.style.boxShadow = '';
        }
      });

      emailInput.addEventListener('input', function() {
        // Clear error styling on input
        this.style.borderColor = '';
        this.style.boxShadow = '';
        
        // Remove existing error messages
        const existingMessage = document.querySelector('.form-message.error');
        if (existingMessage) {
          existingMessage.remove();
        }
      });
    }
  }
}

// Parallax effects for image break section
function initParallaxEffects() {
  const imageBreak = document.querySelector('.image-break');
  if (!imageBreak) return;
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const imageBreakTop = imageBreak.getBoundingClientRect().top + window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Only apply parallax when the element is in view
    if (scrolled + window.innerHeight > imageBreakTop && scrolled < imageBreakTop + imageBreak.offsetHeight) {
      imageBreak.style.transform = `translate3d(0, ${rate}px, 0)`;
    }
    
    ticking = false;
  }
  
  // Only enable parallax on larger screens
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }
}

// Animated number counters
function initNumberCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;
  
  // Set fallback values immediately to prevent showing 0
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    counter.textContent = target.toLocaleString();
  });
  
  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;

  element.classList.add('counting');

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Email validation with enhanced regex
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email);
}

// Enhanced form messages with better styling
function showFormMessage(message, type) {
  // Remove existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageEl = document.createElement('div');
  messageEl.className = `form-message ${type}`;
  messageEl.textContent = message;
  
  // Enhanced styles with animations
  const isSuccess = type === 'success';
  messageEl.style.cssText = `
    margin-top: 1rem;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    font-family: var(--font-body);
    font-weight: 500;
    transform: translateY(-10px);
    opacity: 0;
    transition: all 0.3s ease;
    ${isSuccess 
      ? `background: rgba(212, 175, 55, 0.1); 
         color: #8B7A00; 
         border: 2px solid rgba(212, 175, 55, 0.3);
         box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1);`
      : `background: rgba(196, 30, 58, 0.1); 
         color: #9B1830; 
         border: 2px solid rgba(196, 30, 58, 0.3);
         box-shadow: 0 4px 20px rgba(196, 30, 58, 0.1);`
    }
  `;
  
  // Insert after form fields
  const formFields = document.querySelector('.form-fields');
  formFields.parentNode.insertBefore(messageEl, formFields.nextSibling);
  
  // Animate in
  requestAnimationFrame(() => {
    messageEl.style.transform = 'translateY(0)';
    messageEl.style.opacity = '1';
  });
  
  // Auto remove after 6 seconds with fade out
  setTimeout(() => {
    if (messageEl.parentNode) {
      messageEl.style.opacity = '0';
      messageEl.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        if (messageEl.parentNode) {
          messageEl.remove();
        }
      }, 300);
    }
  }, 6000);
}

// Enhanced mobile navigation (future-proof)
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      this.classList.toggle('active');
      
      // Animate hamburger menu
      const spans = this.querySelectorAll('span');
      if (this.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
      } else {
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });
    
    // Close mobile nav when clicking on links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Reset hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      });
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Reset hamburger menu
        const spans = navToggle.querySelectorAll('span');
        spans.forEach(span => {
          span.style.transform = '';
          span.style.opacity = '';
        });
      }
    });
  }
}

// Enhanced FAQ interactions
function initFAQInteractions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    
    summary.addEventListener('click', function(e) {
      // Close other open items for accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.hasAttribute('open')) {
          otherItem.removeAttribute('open');
        }
      });
    });
  });
}

// Performance optimization: Enhanced debounce function
function debounce(func, wait, immediate) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

// Enhanced intersection observer for performance
function createOptimizedObserver(callback, options = {}) {
  const defaultOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Initialize enhanced features on load
document.addEventListener('DOMContentLoaded', function() {
  initFAQInteractions();
  initMobileNav();
  
  // Add loading complete class to body for CSS transitions
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// Enhanced scroll performance with throttling
const debouncedScroll = debounce(function() {
  // Additional scroll-based functionality can go here
  // This could include progress indicators, lazy loading, etc.
}, 16); // ~60fps

window.addEventListener('scroll', debouncedScroll);

// Scroll progress bar
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;
  
  let ticking = false;
  
  function updateProgressBar() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateProgressBar);
      ticking = true;
    }
  });
}

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Disable parallax and complex animations
  document.documentElement.style.setProperty('--animation-duration', '0s');
  document.documentElement.style.setProperty('--transition-duration', '0s');
}
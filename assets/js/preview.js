document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    
    // Get form data from session storage
    const formData = JSON.parse(sessionStorage.getItem('landingPageData')) || {};
    
    // Initialize theme switcher
    initThemeSwitcher();
    
    // Initialize header scroll effect
    initHeaderScroll();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize FAQ accordion
    initFAQ();
    
    // Populate page content
    if (Object.keys(formData).length > 0) {
        populatePageContent(formData);
        applyDynamicStyles(formData);
        toggleSections(formData);
    } else {
        loadDefaultContent();
    }
    
    // Initialize all CTA buttons
    initCTAs(formData);

    // ======================
    //  FUNCTIONS
    // ======================

    function initThemeSwitcher() {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        
        const headerContent = document.querySelector('.header-content');
        if (headerContent) {
            headerContent.appendChild(themeToggle);
        }
        
        themeToggle.addEventListener('click', toggleTheme);
        
        // Set initial theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }

    function updateThemeIcon(theme) {
        const icon = document.querySelector('#theme-toggle i');
        if (theme === 'light') {
            icon.classList.replace('fa-sun', 'fa-moon');
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
        }
    }

    function initHeaderScroll() {
        const header = document.querySelector('.preview-header');
        if (!header) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    function initMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (mobileMenuToggle && mainNav) {
            mobileMenuToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
            
            // Hide mobile menu on desktop
            function handleResize() {
                if (window.innerWidth > 768) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
                }
            }
            
            window.addEventListener('resize', handleResize);
        }
    }

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
                
                if (item.classList.contains('active')) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    }

    function populatePageContent(data) {
        // Set basic info
        setElementText('#page-title', data.title, 'Course Title');
        setElementText('#page-subtitle', data.subtitle, 'Course Subtitle');
        setElementText('#page-description', data.description, 'Course description goes here.');
        setElementText('#page-full-description', data.description, 'Detailed course description goes here.');
        
        // Set page type labels
        const typeLabel = data.pageType ? 
            data.pageType.charAt(0).toUpperCase() + data.pageType.slice(1) : 
            'Course';
        document.querySelectorAll('.page-type-label, .page-type-label-2').forEach(el => {
            el.textContent = typeLabel;
        });
        
        // Handle image
        setupHeroImage(data.imageUrl, data.title);
        
        // Set type-specific content
        if (data.pageType === 'course') {
            setCourseDetails(data);
        } else if (data.pageType === 'event') {
            setEventDetails(data);
        } else if (data.pageType === 'club') {
            setClubDetails(data);
        }
    }

    function setElementText(selector, value, defaultValue = '') {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value || defaultValue;
        }
    }

    function setupHeroImage(imageUrl, altText) {
        const heroImage = document.getElementById('page-image');
        const heroImageWrapper = document.querySelector('.hero-image-wrapper');
        
        if (imageUrl && isValidImageUrl(imageUrl)) {
            heroImage.src = imageUrl;
            heroImage.style.display = 'block';
            heroImage.alt = altText || 'Course Image';
            heroImageWrapper.querySelector('.image-placeholder')?.remove();
        } else {
            showDefaultImage(heroImageWrapper, formData?.pageType, formData?.title);
        }
    }

    function showDefaultImage(wrapper, pageType = 'course', title = 'Course Title') {
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-${getIconForType(pageType)}"></i>
                <h4>${title}</h4>
            </div>
        `;
        wrapper.appendChild(placeholder);
    }

    function setCourseDetails(data) {
        setElementText('#duration-value', data.duration, '12 weeks');
        setElementText('#instructor-value', data.instructor, 'Professor Name');
        setElementText('#credits-value', data.credits, '3');
        
        const detailsContent = `
            <div class="details-grid">
                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <h3>Duration</h3>
                    <p>${data.duration || '12 weeks'}</p>
                </div>
                <!-- Additional course details cards... -->
            </div>
        `;
        document.getElementById('dynamic-details').innerHTML = detailsContent;
    }

    function applyDynamicStyles(data) {
        const styleElement = document.getElementById('dynamic-styles');
        
        const primaryColorRgb = hexToRgb(data.primaryColor || '#4f46e5');
        const secondaryColorRgb = hexToRgb(data.secondaryColor || '#f59e0b');
        
        const css = `
            :root {
                --primary-color: ${data.primaryColor || '#4f46e5'};
                --primary-light: ${lightenColor(data.primaryColor || '#4f46e5', 15)};
                --secondary-color: ${data.secondaryColor || '#f59e0b'};
                --secondary-light: ${lightenColor(data.secondaryColor || '#f59e0b', 15)};
                --primary-color-rgb: ${primaryColorRgb};
                --secondary-color-rgb: ${secondaryColorRgb};
            }
            
            body {
                font-family: ${data.fontFamily || "'Poppins', sans-serif"};
            }
        `;
        
        styleElement.textContent = css;
    }

    function initCTAs(data) {
        const mainCTA = document.getElementById('main-cta');
        if (mainCTA) {
            mainCTA.addEventListener('click', function() {
                if (data?.ctaLink) {
                    window.open(data.ctaLink, '_blank');
                }
            });
            
            if (data?.ctaText) {
                mainCTA.textContent = data.ctaText;
            }
        }
        
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', function() {
                if (data?.ctaLink) {
                    window.open(data.ctaLink, '_blank');
                }
            });
            
            if (data?.ctaText) {
                button.textContent = data.ctaText;
            }
        });
    }

    // Helper functions
    function getIconForType(pageType) {
        switch(pageType) {
            case 'course': return 'graduation-cap';
            case 'event': return 'calendar-alt';
            case 'club': return 'users';
            default: return 'image';
        }
    }

    function isValidImageUrl(url) {
        return url && (url.startsWith('http') || url.startsWith('data:image'));
    }

    function lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = Math.min(255, (num >> 16) + amt);
        const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
        const B = Math.min(255, (num & 0x0000FF) + amt);
        return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }

    function loadDefaultContent() {
        setElementText('#page-title', 'Sample Landing Page');
        setElementText('#page-subtitle', 'This is a sample subtitle');
        showDefaultImage(document.querySelector('.hero-image-wrapper'));
    }
});
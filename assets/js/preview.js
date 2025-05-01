document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    
    // Get form data from session storage
    const formData = JSON.parse(sessionStorage.getItem('landingPageData'));
    
    // Header scroll effect
    const header = document.querySelector('.preview-header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }
    
    if (formData) {
        // Apply dynamic styles
        applyDynamicStyles(formData);
        
        // Populate page content
        populatePageContent(formData);
        
        // Show/hide sections based on options
        toggleSections(formData);
        
        // Initialize FAQ functionality
        initFAQ();
    } else {
        // Default content if no form data
        document.getElementById('page-title').textContent = 'Sample Landing Page';
        document.getElementById('page-subtitle').textContent = 'This is a sample subtitle';
        showDefaultImage();
    }
    
    // CTA button click handler
    document.getElementById('main-cta').addEventListener('click', function() {
        if (formData?.ctaLink) {
            window.open(formData.ctaLink, '_blank');
        }
    });
    
    // All CTA buttons
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            if (formData?.ctaLink) {
                window.open(formData.ctaLink, '_blank');
            }
        });
        
        if (formData?.ctaText) {
            button.textContent = formData.ctaText;
        }
    });
    
    // Function to apply dynamic styles
    function applyDynamicStyles(data) {
        const styleElement = document.getElementById('dynamic-styles');
        
        // Convert colors to RGB for rgba usage
        const primaryColorRgb = hexToRgb(data.primaryColor || '#4f46e5');
        const secondaryColorRgb = hexToRgb(data.secondaryColor || '#f59e0b');
        
        let css = `
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
    
    // Function to populate page content
    function populatePageContent(data) {
        // Basic info
        document.getElementById('page-title').textContent = data.title || 'Course Title';
        document.getElementById('page-subtitle').textContent = data.subtitle || 'Course Subtitle';
        document.getElementById('page-description').textContent = data.description || 'Course description goes here.';
        document.getElementById('page-full-description').textContent = data.description || 'Detailed course description goes here.';
        
        // Enhanced image handling
        const heroImage = document.getElementById('page-image');
        const heroImageWrapper = document.querySelector('.hero-image-wrapper');
        
        if (data.imageUrl && isValidImageUrl(data.imageUrl)) {
            heroImage.src = data.imageUrl;
            heroImage.style.display = 'block';
            heroImage.alt = data.title || 'Course Image';
            heroImageWrapper.querySelector('.image-placeholder')?.remove();
        } else {
            showDefaultImage();
        }
        
        // Set page type labels
        const typeLabel = data.pageType ? 
            data.pageType.charAt(0).toUpperCase() + data.pageType.slice(1) : 
            'Course';
            
        document.querySelectorAll('.page-type-label, .page-type-label-2').forEach(el => {
            el.textContent = typeLabel;
        });
        
        // Type-specific content
        if (data.pageType === 'course') {
            document.getElementById('duration-value').textContent = data.duration || '12 weeks';
            document.getElementById('instructor-value').textContent = data.instructor || 'Professor Name';
            document.getElementById('credits-value').textContent = data.credits || '3';
            
            // Enhanced course details
            const detailsContent = `
                <div class="details-grid">
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <h3>Duration</h3>
                        <p>${data.duration || '12 weeks'}</p>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-chalkboard-teacher"></i>
                        </div>
                        <h3>Instructor</h3>
                        <p>${data.instructor || 'Professor Name'}</p>
                    </div>
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-award"></i>
                        </div>
                        <h3>Credits</h3>
                        <p>${data.credits || '3'}</p>
                    </div>
                    <div class="syllabus-card">
                        <div class="detail-icon">
                            <i class="fas fa-book-open"></i>
                        </div>
                        <h3>Syllabus</h3>
                        <div class="syllabus-timeline">
                            <div class="timeline-item">
                                <h4>Week 1: Introduction</h4>
                                <p>Overview of course content and expectations</p>
                            </div>
                            <div class="timeline-item">
                                <h4>Week 2: Core Concepts</h4>
                                <p>Fundamental principles and theories</p>
                            </div>
                            <div class="timeline-item">
                                <h4>Week 3: Advanced Topics</h4>
                                <p>Deep dive into specialized areas</p>
                            </div>
                            <div class="timeline-item">
                                <h4>Week 4: Practical Applications</h4>
                                <p>Hands-on implementation of concepts</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('dynamic-details').innerHTML = detailsContent;
        }
    }
    
    function showDefaultImage() {
        const heroImage = document.getElementById('page-image');
        const heroImageWrapper = document.querySelector('.hero-image-wrapper');
        
        heroImage.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.innerHTML = `
            <div class="placeholder-content">
                <i class="fas fa-${getIconForType(formData?.pageType || 'course')}"></i>
                <h4>${formData?.title || 'Course Title'}</h4>
            </div>
        `;
        heroImageWrapper.appendChild(placeholder);
    }
    
    // Function to toggle sections based on options
    function toggleSections(data) {
        const testimonialsSection = document.getElementById('testimonials');
        const faqSection = document.getElementById('faq');
        
        if (data.enableTestimonials) {
            testimonialsSection.style.display = 'block';
        } else {
            testimonialsSection.style.display = 'none';
        }
        
        if (data.enableFaq) {
            faqSection.style.display = 'block';
        } else {
            faqSection.style.display = 'none';
        }
    }
    
    // Function to initialize FAQ functionality
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
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
        
        return '#' + (
            0x1000000 +
            R * 0x10000 +
            G * 0x100 +
            B
        ).toString(16).slice(1);
    }
    
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    }
});
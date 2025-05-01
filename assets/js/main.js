document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Form navigation
    const formSteps = document.querySelectorAll('.form-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const typeOptions = document.querySelectorAll('input[name="page-type"]');
    const generateBtn = document.getElementById('generate-btn');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    let currentStep = 1;
    
    // Initialize form
    showStep(currentStep);
    
    // Next button click handler
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                currentStep++;
                showStep(currentStep);
                updateProgressBar();
            }
        });
    });
    
    // Previous button click handler
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentStep--;
            showStep(currentStep);
            updateProgressBar();
        });
    });
    
    // Page type change handler
    typeOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateDynamicFields(this.value);
            
            // Enable next button when type is selected
            document.querySelector('.next-step').disabled = false;
        });
    });
    
    // Generate button click handler
    generateBtn.addEventListener('click', function() {
        if (validateStep(currentStep)) {
            generateLandingPage();
        }
    });
    
    // Image upload preview
    const imageUpload = document.getElementById('image-upload');
    const filePreview = document.getElementById('file-preview');
    
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                filePreview.innerHTML = `<img src="${event.target.result}" alt="Preview">`;
                filePreview.style.display = 'block';
                document.getElementById('image-url').value = event.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Color picker text update
    document.getElementById('primary-color').addEventListener('input', function() {
        document.querySelector('.color-picker span').textContent = this.value;
    });
    
    document.getElementById('secondary-color').addEventListener('input', function() {
        document.querySelectorAll('.color-picker span')[1].textContent = this.value;
    });
    
    // Function to show current step
    function showStep(step) {
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
            if (parseInt(formStep.dataset.step) === step) {
                formStep.classList.add('active');
            }
        });
        
        // Update button visibility
        if (step === 1) {
            document.querySelector('.prev-step').style.display = 'none';
        } else {
            document.querySelector('.prev-step').style.display = 'inline-flex';
        }
        
        if (step === formSteps.length) {
            document.querySelector('.next-step').style.display = 'none';
            generateBtn.style.display = 'inline-flex';
        } else {
            document.querySelector('.next-step').style.display = 'inline-flex';
            generateBtn.style.display = 'none';
        }
    }
    
    // Function to update progress bar
    function updateProgressBar() {
        progressSteps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Function to validate current step
    function validateStep(step) {
        let isValid = true;
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        
        // Check required fields
        const requiredInputs = currentFormStep.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.parentElement.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.5)';
                isValid = false;
                
                // Add error message
                if (!input.parentElement.nextElementSibling || !input.parentElement.nextElementSibling.classList.contains('error-message')) {
                    const errorMsg = document.createElement('small');
                    errorMsg.textContent = 'This field is required';
                    errorMsg.classList.add('error-message');
                    errorMsg.style.color = '#ef4444';
                    errorMsg.style.display = 'block';
                    errorMsg.style.marginTop = '8px';
                    input.parentElement.parentNode.insertBefore(errorMsg, input.parentElement.nextSibling);
                }
            } else {
                input.parentElement.style.boxShadow = '';
                const errorMsg = input.parentElement.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
        
        return isValid;
    }
    
    // Function to update dynamic fields based on page type
    function updateDynamicFields(pageType) {
        // Hide all dynamic fields first
        document.querySelectorAll('.course-field, .event-field, .club-field').forEach(field => {
            field.style.display = 'none';
        });
        
        // Show relevant fields
        if (pageType === 'course') {
            document.querySelectorAll('.course-field').forEach(field => {
                field.style.display = 'block';
            });
        } else if (pageType === 'event') {
            document.querySelectorAll('.event-field').forEach(field => {
                field.style.display = 'block';
            });
        } else if (pageType === 'club') {
            document.querySelectorAll('.club-field').forEach(field => {
                field.style.display = 'block';
            });
        }
    }
    
    // Function to generate landing page
    function generateLandingPage() {
        // Collect all form data
        const formData = {
            pageType: document.querySelector('input[name="page-type"]:checked').value,
            title: document.getElementById('title').value,
            subtitle: document.getElementById('subtitle').value,
            description: document.getElementById('description').value,
            imageUrl: document.getElementById('image-url').value || 'https://via.placeholder.com/600x400',
            ctaText: document.getElementById('cta-text').value,
            ctaLink: document.getElementById('cta-link').value,
            primaryColor: document.getElementById('primary-color').value,
            secondaryColor: document.getElementById('secondary-color').value,
            fontFamily: document.getElementById('font-family').value,
            enableTestimonials: document.getElementById('enable-testimonials').checked,
            enableFaq: document.getElementById('enable-faq').checked,
            
            // Course specific
            duration: document.getElementById('duration').value,
            instructor: document.getElementById('instructor').value,
            credits: document.getElementById('credits').value,
            
            // Event specific
            eventDate: document.getElementById('event-date').value,
            eventTime: document.getElementById('event-time').value,
            location: document.getElementById('location').value,
            
            // Club specific
            meetingSchedule: document.getElementById('meeting-schedule').value,
            clubLeader: document.getElementById('club-leader').value,
            membership: document.getElementById('membership').value
        };
        
        // Store form data in session storage to pass to preview page
        sessionStorage.setItem('landingPageData', JSON.stringify(formData));
        
        // Open preview in new tab
        window.open('preview.html', '_blank');
    }
});
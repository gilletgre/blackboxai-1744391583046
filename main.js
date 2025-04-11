// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!validateForm(formData)) {
                return;
            }
            
            try {
                // Here you would typically send this data to your server
                // Simulating API call with setTimeout
                await simulateApiCall(formData);
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                contactForm.reset();
                
            } catch (error) {
                showNotification('There was an error sending your message. Please try again.', 'error');
            }
        });
    }
}

// Form validation
function validateForm(formData) {
    const errors = [];

    // Name validation
    if (!formData.name.trim()) {
        errors.push('Name is required');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    // Subject validation
    if (!formData.subject.trim()) {
        errors.push('Subject is required');
    }

    // Message validation
    if (!formData.message.trim()) {
        errors.push('Message is required');
    }

    // Display errors if any
    if (errors.length > 0) {
        showNotification(errors.join('\\n'), 'error');
        return false;
    }

    return true;
}

// Simulate API call
function simulateApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1000);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white max-w-md z-50 transition-opacity duration-300`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Newsletter form handling
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('form:not(#contactForm)');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) return;

            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate newsletter subscription
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            form.reset();
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Cost constants
const PRICES = {
    baseStationXG: 1499,
    u6MeshPro: 235,
    buildingBridgeXG: 489,
    infrastructure: {
        perSite: 2000, // Mâts, boîtiers, câblage
    },
    services: {
        installation: 1000,
        support: {
            standard: 300,
            premium: 600
        },
        portal: 500,
        monitoring: 400
    }
};

// Cost simulator functionality
function initCostSimulator() {
    const siteCountSlider = document.querySelector('input[type="range"]:nth-of-type(1)');
    const apCountSlider = document.querySelector('input[type="range"]:nth-of-type(2)');
    const equipmentButtons = document.querySelectorAll('.grid-cols-2 button');
    const optionCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Initialize counters display
    if (siteCountSlider) {
        const siteCountDisplay = siteCountSlider.nextElementSibling;
        siteCountSlider.addEventListener('input', () => {
            siteCountDisplay.textContent = siteCountSlider.value;
            updateCosts();
        });
    }
    
    if (apCountSlider) {
        const apCountDisplay = apCountSlider.nextElementSibling;
        apCountSlider.addEventListener('input', () => {
            apCountDisplay.textContent = apCountSlider.value;
            updateCosts();
        });
    }

    // Equipment selection
    equipmentButtons?.forEach(button => {
        button.addEventListener('click', () => {
            equipmentButtons.forEach(b => {
                b.classList.remove('border-primary', 'bg-blue-50');
                b.classList.add('border-gray-200');
                b.querySelector('i').classList.remove('text-primary');
                b.querySelector('i').classList.add('text-gray-400');
            });
            button.classList.add('border-primary', 'bg-blue-50');
            button.classList.remove('border-gray-200');
            button.querySelector('i').classList.add('text-primary');
            button.querySelector('i').classList.remove('text-gray-400');
            updateCosts();
        });
    });

    // Options selection
    optionCheckboxes?.forEach(checkbox => {
        checkbox.addEventListener('change', updateCosts);
    });
}

function updateCosts() {
    const siteCount = parseInt(document.querySelector('input[type="range"]:nth-of-type(1)')?.value || 3);
    const apCount = parseInt(document.querySelector('input[type="range"]:nth-of-type(2)')?.value || 4);
    const isBaseStationXG = document.querySelector('.grid-cols-2 button:first-child')?.classList.contains('border-primary');
    const options = {
        premium: document.querySelector('input[type="checkbox"]:nth-of-type(1)')?.checked || false,
        portal: document.querySelector('input[type="checkbox"]:nth-of-type(2)')?.checked || false,
        installation: document.querySelector('input[type="checkbox"]:nth-of-type(3)')?.checked || false
    };

    // Calculate equipment costs
    const apPrice = isBaseStationXG ? PRICES.baseStationXG : PRICES.u6MeshPro;
    const equipmentCost = (apPrice * apCount * siteCount) + 
                         (PRICES.buildingBridgeXG * Math.ceil(siteCount / 2));

    // Calculate infrastructure costs
    const infrastructureCost = PRICES.infrastructure.perSite * siteCount;

    // Calculate service costs
    let serviceCost = PRICES.services.monitoring; // Base monitoring cost
    
    // Add support cost
    serviceCost += options.premium ? PRICES.services.support.premium : PRICES.services.support.standard;
    
    // Add portal cost if selected
    if (options.portal) {
        serviceCost += PRICES.services.portal;
    }
    
    // Add installation cost if selected (per site)
    if (options.installation) {
        serviceCost += PRICES.services.installation * siteCount;
    }

    // Update equipment details
    const equipmentDetails = document.getElementById('equipmentDetails');
    const equipmentSpecs = document.getElementById('equipmentSpecs');
    const equipmentCostElement = document.getElementById('equipmentCost');
    if (equipmentDetails && equipmentSpecs && equipmentCostElement) {
        const totalAPs = apCount * siteCount;
        const deviceType = isBaseStationXG ? 'WiFi BaseStation XG' : 'U6 Mesh Pro';
        equipmentDetails.textContent = `${totalAPs}x ${deviceType}`;
        equipmentSpecs.textContent = isBaseStationXG ? 
            'Couverture haute densité, jusqu\'à 1500 clients' : 
            'Couverture standard, jusqu\'à 500 clients';
        equipmentCostElement.textContent = `${equipmentCost.toLocaleString('fr-BE')} €`;
    }

    // Update infrastructure details
    const infraDetails = document.getElementById('infraDetails');
    const infraSpecs = document.getElementById('infraSpecs');
    const infraCostElement = document.getElementById('infraCost');
    if (infraDetails && infraSpecs && infraCostElement) {
        const bridgeCount = Math.ceil(siteCount / 2);
        infraDetails.textContent = `${bridgeCount}x Building Bridge XG, switches, mâts`;
        infraSpecs.textContent = `Liaisons ${isBaseStationXG ? '10' : '5'} Gbps, installation sur mâts 6m`;
        infraCostElement.textContent = `${infrastructureCost.toLocaleString('fr-BE')} €`;
    }

    // Update services details
    const servicesDetails = document.getElementById('servicesDetails');
    const servicesSpecs = document.getElementById('servicesSpecs');
    const servicesCostElement = document.getElementById('servicesCost');
    if (servicesDetails && servicesSpecs && servicesCostElement) {

        // Build detailed service description
        const serviceDetails = [];
        const serviceSpecs = [];

        // Support level
        if (options.premium) {
            serviceDetails.push('Support premium 24/7');
            serviceSpecs.push('Intervention < 4h');
        } else {
            serviceDetails.push('Support standard');
            serviceSpecs.push('Intervention J+1');
        }

        // Installation
        const installationCostElement = document.getElementById('installationCost');
        if (options.installation) {
            const totalInstallCost = PRICES.services.installation * siteCount;
            serviceDetails.push(`Installation & démontage`);
            serviceSpecs.push(`${siteCount} sites`);
            installationCostElement.textContent = 
                `Installation: ${PRICES.services.installation.toLocaleString('fr-BE')} € × ${siteCount} sites = ${totalInstallCost.toLocaleString('fr-BE')} €`;
        } else {
            installationCostElement.textContent = '';
        }

        // Portal
        if (options.portal) {
            serviceDetails.push('Portail captif');
            serviceSpecs.push('Personnalisé');
        }

        // Always include monitoring
        serviceDetails.push('Monitoring');
        serviceSpecs.push('Temps réel');

        servicesDetails.textContent = serviceDetails.join(', ');
        servicesSpecs.textContent = serviceSpecs.join(' • ');
        servicesCostElement.textContent = `${serviceCost.toLocaleString('fr-BE')} €`;
    }

    // Update total
    const totalElement = document.getElementById('totalCost');
    if (totalElement) {
        totalElement.textContent = `${(equipmentCost + infrastructureCost + serviceCost).toLocaleString('fr-BE')} €`;
    }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initContactForm();
    initNewsletterForm();
    initSmoothScroll();
    initCostSimulator();
});

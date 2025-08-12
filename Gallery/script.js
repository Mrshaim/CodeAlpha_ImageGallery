// Image data
const images = [
    {
        id: 1,
        src: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Mountain Landscape",
        category: "nature",
        title: "Majestic Peaks"
    },
    {
        id: 2,
        src: "https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Modern Architecture",
        category: "architecture",
        title: "Glass Tower"
    },
    {
        id: 3,
        src: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Forest Path",
        category: "nature",
        title: "Enchanted Forest"
    },
    {
        id: 4,
        src: "https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Portrait Photography",
        category: "portraits",
        title: "Urban Portrait"
    },
    {
        id: 5,
        src: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "City Skyline",
        category: "urban",
        title: "City Lights"
    },
    {
        id: 6,
        src: "https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Ocean Waves",
        category: "nature",
        title: "Endless Blue"
    },
    {
        id: 7,
        src: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Minimalist Interior",
        category: "architecture",
        title: "Clean Lines"
    },
    {
        id: 8,
        src: "https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Street Photography",
        category: "urban",
        title: "City Life"
    },
    {
        id: 9,
        src: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Portrait Model",
        category: "portraits",
        title: "Natural Beauty"
    },
    {
        id: 10,
        src: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Golden Hour",
        category: "nature",
        title: "Golden Moment"
    },
    {
        id: 11,
        src: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Modern Building",
        category: "architecture",
        title: "Geometric Beauty"
    },
    {
        id: 12,
        src: "https://images.pexels.com/photos/2014422/pexels-photo-2014422.jpeg?auto=compress&cs=tinysrgb&w=800",
        alt: "Urban Scene",
        category: "urban",
        title: "Street Corner"
    }
];

// Global variables
let currentFilter = 'all';
let currentImageIndex = 0;
let filteredImages = [...images];

// DOM elements
const galleryGrid = document.getElementById('gallery-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Initialize the gallery
document.addEventListener('DOMContentLoaded', function() {
    renderGallery();
    initializeEventListeners();
    addScrollEffects();
});

// Render gallery images
function renderGallery() {
    galleryGrid.innerHTML = '';
    
    filteredImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Add stagger animation
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });
}

// Create gallery item element
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.category = image.category;
    
    item.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" loading="lazy">
        <div class="gallery-overlay">
            <h3 class="gallery-title">${image.title}</h3>
            <p class="gallery-category">${image.category}</p>
        </div>
    `;
    
    item.addEventListener('click', () => openLightbox(index));
    
    return item;
}

// Filter functionality
function filterImages(category) {
    currentFilter = category;
    
    if (category === 'all') {
        filteredImages = [...images];
    } else {
        filteredImages = images.filter(image => image.category === category);
    }
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    
    // Add exit animation
    const items = galleryGrid.querySelectorAll('.gallery-item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.05}s`;
        item.classList.add('fade-out');
    });
    
    // Render filtered images after animation
    setTimeout(() => {
        renderGallery();
    }, 300);
}

// Lightbox functionality
function openLightbox(index) {
    currentImageIndex = index;
    const image = filteredImages[index];
    
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxTitle.textContent = image.title;
    lightboxCategory.textContent = image.category;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Preload adjacent images
    preloadAdjacentImages();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateLightbox(direction) {
    if (direction === 'next') {
        currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
    } else {
        currentImageIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    }
    
    const image = filteredImages[currentImageIndex];
    
    // Add transition effect
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxCategory.textContent = image.category;
        
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 150);
    
    preloadAdjacentImages();
}

function preloadAdjacentImages() {
    const prevIndex = currentImageIndex === 0 ? filteredImages.length - 1 : currentImageIndex - 1;
    const nextIndex = (currentImageIndex + 1) % filteredImages.length;
    
    [prevIndex, nextIndex].forEach(index => {
        const img = new Image();
        img.src = filteredImages[index].src;
    });
}

// Event listeners
function initializeEventListeners() {
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterImages(btn.dataset.filter);
        });
    });
    
    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox('prev'));
    lightboxNext.addEventListener('click', () => navigateLightbox('next'));
    
    // Close lightbox on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox('prev');
                break;
            case 'ArrowRight':
                navigateLightbox('next');
                break;
        }
    });
    
    // Navigation smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll effects
function addScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Header background opacity
        if (scrolled > 100) {
            header.style.background = 'rgba(26, 26, 46, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 46, 0.95)';
        }
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.gallery-item, .stat-item, .section-header').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function scrollToGallery() {
    document.getElementById('gallery').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Touch/swipe support for lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            navigateLightbox('next');
        } else {
            navigateLightbox('prev');
        }
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    .fade-out {
        animation: fadeOutDown 0.3s ease-in forwards;
    }
    
    .animate-in {
        animation: slideInUp 0.8s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeOutDown {
        to {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
        }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
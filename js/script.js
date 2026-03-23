document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DO AGE GATE (POP-UP 18+) ---
    const ageGate = document.getElementById('age-gate');
    if (ageGate) {
        // Removida a memória (localStorage). Agora ele sempre vai travar a tela e aparecer no refresh!
        document.body.style.overflow = 'hidden'; 

        document.getElementById('btn-yes-age').addEventListener('click', () => {
            ageGate.style.display = 'none';
            document.body.style.overflow = 'auto'; // Destrava a tela para rolagem
        });

        document.getElementById('btn-no-age').addEventListener('click', () => {
            window.location.href = 'menor-de-idade.html';
        });
    }

    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.classList.toggle('menu-open'); 
    }

    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            serviceItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // --- ANIMAÇÃO DOS BOTÕES E FUNDO DO HERO ---
    const heroSlides = document.querySelectorAll('.hero-slider .slide');
    const pageItems = document.querySelectorAll('.hero-pagination .page-item');
    const mobileCurrentNum = document.getElementById('current-slide-num');
    
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        if (heroSlides.length === 0) return;
        
        heroSlides.forEach(slide => slide.classList.remove('active'));
        pageItems.forEach(item => item.classList.remove('active'));
        
        if(heroSlides[index]) heroSlides[index].classList.add('active');
        if(pageItems[index]) pageItems[index].classList.add('active');
        
        currentSlide = index;

        if(mobileCurrentNum) {
            mobileCurrentNum.textContent = '0' + (index + 1);
        }
    }

    function nextSlide() {
        let limit = heroSlides.length;
        if (limit === 0) return;
        let next = (currentSlide + 1) % limit;
        goToSlide(next);
    }

    function prevSlide() {
        let limit = heroSlides.length;
        if (limit === 0) return;
        let prev = (currentSlide - 1 + limit) % limit;
        goToSlide(prev);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 4000); 
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopSlider(); 
            goToSlide(index);
        });
    });

    const mobilePrevBtn = document.getElementById('prev-slide-btn');
    const mobileNextBtn = document.getElementById('next-slide-btn');

    if(mobilePrevBtn) {
        mobilePrevBtn.addEventListener('click', () => {
            stopSlider();
            prevSlide();
        });
    }

    if(mobileNextBtn) {
        mobileNextBtn.addEventListener('click', () => {
            stopSlider();
            nextSlide();
        });
    }

    if (heroSlides.length > 0) {
        startSlider();
    }

    // --- LÓGICA DOS CARROSSEIS ---
    function setupCarousel(containerSelector, leftArrowSelector, rightArrowSelector) {
        const container = document.querySelector(containerSelector);
        const leftArrow = document.querySelector(leftArrowSelector);
        const rightArrow = document.querySelector(rightArrowSelector);

        if (!container) return;

        const moveNext = () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
                const scrollAmount = container.clientWidth + gap;
                if (Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 10) {
                    container.style.setProperty('scroll-behavior', 'auto', 'important');
                    container.scrollLeft = 0;
                    setTimeout(() => container.style.removeProperty('scroll-behavior'), 50);
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            } else {
                const scrollAmount = 350;
                if (Math.ceil(container.scrollLeft + container.clientWidth) >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        };

        const movePrev = () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                const gap = parseFloat(window.getComputedStyle(container).gap) || 0;
                const scrollAmount = container.clientWidth + gap;
                if (container.scrollLeft <= 10) {
                    container.style.setProperty('scroll-behavior', 'auto', 'important');
                    container.scrollLeft = container.scrollWidth;
                    setTimeout(() => container.style.removeProperty('scroll-behavior'), 50);
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                const scrollAmount = 350;
                if (container.scrollLeft <= 10) {
                    container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            }
        };

        if(leftArrow) leftArrow.addEventListener('click', movePrev);
        if(rightArrow) rightArrow.addEventListener('click', moveNext);

        let interval = setInterval(moveNext, 3000);

        container.addEventListener('mouseenter', () => clearInterval(interval));
        container.addEventListener('mouseleave', () => {
            interval = setInterval(moveNext, 3000);
        });
        
        container.addEventListener('touchstart', () => clearInterval(interval));
        container.addEventListener('touchend', () => {
            interval = setInterval(moveNext, 3000);
        });
    }

    setupCarousel('.diff-cards', '.diff-arrow-left', '.diff-arrow-right');
    setupCarousel('.gallery-container', '.gal-arrow-left', '.gal-arrow-right');
    setupCarousel('.clients-logos', '.client-arrow-left', '.client-arrow-right');

    // --- LÓGICA DO LIGHTBOX ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightboxBtn = document.querySelector('.lightbox-close');
    const prevLightboxBtn = document.querySelector('.lightbox-prev');
    const nextLightboxBtn = document.querySelector('.lightbox-next');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    let currentImageIndex = 0;

    if(lightbox && galleryImages.length > 0) {
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
                lightbox.classList.add('active');
            });
        });

        closeLightboxBtn.addEventListener('click', () => lightbox.classList.remove('active'));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.classList.remove('active');
        });

        prevLightboxBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : galleryImages.length - 1;
            updateLightboxImage();
        });

        nextLightboxBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex < galleryImages.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        });

        function updateLightboxImage() {
            lightboxImg.src = galleryImages[currentImageIndex].src;
        }
    }
});
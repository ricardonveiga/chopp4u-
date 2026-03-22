document.addEventListener('DOMContentLoaded', () => {

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
        
        // Remove a classe active de todas as fotos e links desktop
        heroSlides.forEach(slide => slide.classList.remove('active'));
        pageItems.forEach(item => item.classList.remove('active'));
        
        // Adiciona active apenas no atual
        if(heroSlides[index]) heroSlides[index].classList.add('active');
        if(pageItems[index]) pageItems[index].classList.add('active');
        
        currentSlide = index;

        // Atualiza a numeração do Mobile
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

    // Clique na paginação do Desktop
    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopSlider(); 
            goToSlide(index);
        });
    });

    // Clique na paginação do Mobile (ANT / PRÓX)
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

    // Inicia animação
    if (heroSlides.length > 0) {
        startSlider();
    }

    // --- LÓGICA DOS CARROSSEIS ---
    function setupCarousel(containerSelector, leftArrowSelector, rightArrowSelector) {
        const container = document.querySelector(containerSelector);
        const leftArrow = document.querySelector(leftArrowSelector);
        const rightArrow = document.querySelector(rightArrowSelector);

        if (!container) return;

        let scrollAmount = 350; 

        leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        let interval = setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 3000);

        container.addEventListener('mouseenter', () => clearInterval(interval));
        container.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                    container.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }, 3000);
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

        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
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
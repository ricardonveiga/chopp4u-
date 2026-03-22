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
    const heroSlide = document.querySelector('.hero-slider .slide');
    const pageItems = document.querySelectorAll('.hero-pagination .page-item');
    const mobileCurrentNum = document.getElementById('current-slide-num'); // Controle numero mobile
    
    const imageUrls = [
        'images/banner-1.jpg',
        'images/banner-2.jpg',
        'images/banner-3.jpg'
    ];
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });

    const bgImages = [
        `url('${imageUrls[0]}')`,
        `url('${imageUrls[1]}')`,
        `url('${imageUrls[2]}')`
    ];
    
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        if (!heroSlide) return;
        
        // Atualiza a barra do desktop
        pageItems.forEach(el => el.classList.remove('active'));
        if(pageItems[index]) {
            pageItems[index].classList.add('active');
        }
        
        heroSlide.style.backgroundImage = bgImages[index];
        currentSlide = index;

        // Atualiza o numero na barra do Mobile
        if(mobileCurrentNum) {
            mobileCurrentNum.textContent = '0' + (index + 1);
        }
    }

    function nextSlide() {
        // Se pageItems existir no desktop usa o tamanho dele, senão usa o array de bg
        let limit = pageItems.length > 0 ? pageItems.length : bgImages.length;
        let next = (currentSlide + 1) % limit;
        goToSlide(next);
    }

    function prevSlide() {
        let limit = pageItems.length > 0 ? pageItems.length : bgImages.length;
        let prev = (currentSlide - 1 + limit) % limit;
        goToSlide(prev);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 4000); 
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Clique nas barras do Desktop
    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopSlider(); 
            goToSlide(index);
        });
    });

    // Cliques nos textos "ANT / PRÓX" do Mobile
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

    // Inicia a animação se existirem os itens na tela
    if (pageItems.length > 0 || bgImages.length > 0) {
        startSlider();
    }

    // --- LÓGICA DOS CARROSSEIS (Diferenciais e Galeria) ---
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


    // --- LÓGICA DO LIGHTBOX (Galeria em tela cheia) ---
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
document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const closeBtnMob = document.getElementById('close-btn-mob'); // Pegando o botão X do mobile
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        // Essa classe adicionada ao body engatilha o CSS do Push Menu
        document.body.classList.toggle('menu-open'); 
    }

    menuBtn.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if(closeBtnMob) closeBtnMob.addEventListener('click', toggleMenu); // O botão de fechar do mobile funciona
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
    const mobCurrent = document.querySelector('.mob-current'); // O número da paginação mobile
    
    // Pré-carregamento das imagens para evitar a "tela preta" piscando
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
        
        // Desktop nav update
        if(pageItems.length > 0){
            pageItems.forEach(el => el.classList.remove('active'));
            if(pageItems[index]) pageItems[index].classList.add('active');
        }
        
        heroSlide.style.backgroundImage = bgImages[index];
        currentSlide = index;

        // Mobile nav update ("01", "02", "03")
        if(mobCurrent) {
            mobCurrent.textContent = '0' + (index + 1);
        }
    }

    function nextSlide() {
        let next = (currentSlide + 1) % bgImages.length;
        goToSlide(next);
    }

    function startSlider() {
        // Altera a imagem a cada 4 segundos
        slideInterval = setInterval(nextSlide, 4000); 
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    // Clique nas abas do desktop
    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopSlider(); 
            goToSlide(index);
        });
    });

    // Controles Mobile (ANT / PRÓX)
    const mobPrev = document.querySelector('.mob-prev');
    const mobNext = document.querySelector('.mob-next');
    
    if(mobPrev) {
        mobPrev.addEventListener('click', () => {
            stopSlider();
            let prev = (currentSlide - 1 + bgImages.length) % bgImages.length;
            goToSlide(prev);
        });
    }
    
    if(mobNext) {
        mobNext.addEventListener('click', () => {
            stopSlider();
            nextSlide();
        });
    }

    // Inicia a animação se existirem os itens na tela
    if (bgImages.length > 0) {
        startSlider();
    }

    // --- LÓGICA DOS CARROSSEIS (Diferenciais e Galeria) ---
    function setupCarousel(containerSelector, leftArrowSelector, rightArrowSelector) {
        const container = document.querySelector(containerSelector);
        const leftArrow = document.querySelector(leftArrowSelector);
        const rightArrow = document.querySelector(rightArrowSelector);

        if (!container) return;

        let scrollAmount = 350; // Quantidade de rolagem por clique/tick

        // Eventos das setas
        leftArrow.addEventListener('click', () => {
            container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        rightArrow.addEventListener('click', () => {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // Rolagem Automática
        let interval = setInterval(() => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' }); // Volta pro início se chegou no fim
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }, 3000);

        // Pausar automático ao colocar o mouse em cima
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

    // Ativando os carrosseis
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
        // Abrir o lightbox ao clicar na imagem
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                updateLightboxImage();
                lightbox.classList.add('active');
            });
        });

        // Fechar ao clicar no botão X ou fora da imagem
        closeLightboxBtn.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });

        // Passar fotos
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
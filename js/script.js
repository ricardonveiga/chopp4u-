document.addEventListener('DOMContentLoaded', () => {

    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
        
        // Essa classe adicionada ao body engatilha o CSS do Push Menu
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
        pageItems.forEach(el => el.classList.remove('active'));
        pageItems[index].classList.add('active');
        heroSlide.style.backgroundImage = bgImages[index];
        currentSlide = index;
    }

    function nextSlide() {
        let next = (currentSlide + 1) % pageItems.length;
        goToSlide(next);
    }

    function startSlider() {
        // Altera a imagem a cada 4 segundos
        slideInterval = setInterval(nextSlide, 4000); 
    }

    function stopSlider() {
        clearInterval(slideInterval);
    }

    pageItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            stopSlider(); // Para a animação automática ao clicar
            goToSlide(index);
        });
    });

    // Inicia a animação se existirem os itens na tela
    if (pageItems.length > 0) {
        startSlider();
    }

});
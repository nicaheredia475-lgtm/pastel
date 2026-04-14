document.addEventListener('DOMContentLoaded', () => {
    console.log("Naprinte Project Initialized!");

    // Переключение вкладок в прайс-листе
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const hamburger = document.querySelector('.hamburger');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav a');

    // Логика переключения табов
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // Убираем активный класс у всех кнопок и контента
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Добавляем активный класс текущей кнопке и контенту
            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    // Логика гамбургера
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Закрытие меню при клике на ссылку
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });



    // Плавная прокрутка для всех навигационных ссылок
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Логика видео-модалки
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const videoCards = document.querySelectorAll('.video-card');
    const closeModal = document.querySelector('.close-modal');

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video');
            
            // Очищаем предыдущий источник для стабильности
            modalVideo.pause();
            modalVideo.innerHTML = ''; 
            
            // Создаем новый элемент source - это надежнее для мобильных браузеров
            const source = document.createElement('source');
            source.src = videoSrc;
            source.type = 'video/mp4';
            modalVideo.appendChild(source);
            
            // Заставляем плеер 'проснуться' и загрузить новый источник
            modalVideo.load();
            
            videoModal.classList.add('active');
            
            // Пробуем запустить воспроизведение
            const playPromise = modalVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Если браузер блокирует (например, на iPhone в режиме энергосбережения), 
                    // просто выведем в консоль. Пользователь сможет нажать Play сам.
                    console.log("Видео готово, ожидает ручного запуска, если автоплей заблокирован.");
                });
            }
            
            document.body.style.overflow = 'hidden';
        });
    });

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
        if (!menuOverlay.classList.contains('active')) {
            document.body.style.overflow = 'auto';
        }
    };

    closeModal.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Анимация появления при прокрутке (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // После того как элемент появился, больше за ним не следим
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15 // Элемент появится, когда 15% его площади будет в кадре
    });

    revealElements.forEach(el => revealObserver.observe(el));

});

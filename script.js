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

    // Принудительное автовоспроизведение видео (обход блокировки мобильных браузеров)
    const allVideos = document.querySelectorAll('.video-card video');
    
    function forcePlayVideos() {
        allVideos.forEach(video => {
            video.muted = true;
            video.setAttribute('playsinline', '');
            video.setAttribute('muted', '');
            video.setAttribute('autoplay', '');
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Браузер заблокировал — попробуем при первом касании
                });
            }
        });
    }

    // Запускаем при появлении секции отзывов
    const reviewSection = document.querySelector('#reviews');
    if (reviewSection) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    forcePlayVideos();
                }
            });
        }, { threshold: 0.1 });
        videoObserver.observe(reviewSection);
    }

    // Запускаем при первом касании экрана (fallback для iOS)
    document.addEventListener('touchstart', forcePlayVideos, { once: true });
    document.addEventListener('click', forcePlayVideos, { once: true });

    // Запускаем сразу на десктопе
    forcePlayVideos();
});

// Проверка на двойную инициализацию (защита от багов при перезагрузках)
if (window.naprinteInit) {
    console.warn("Naprinte: Скрипт уже запущен.");
} else {
    window.naprinteInit = true;

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

    // Переменные для видео-модалки
    const videoModal = document.getElementById('video-modal');
    const videoPlaceholder = document.getElementById('video-placeholder');
    const videoCards = document.querySelectorAll('.video-card');
    const closeModal = document.querySelector('.close-modal');

    // Функция открытия видео
    const openVideo = (videoSrc) => {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Очищаем старое содержимое и создаем новый контейнер
        videoPlaceholder.innerHTML = '';
        
        const videoElement = document.createElement('video');
        videoElement.src = videoSrc;
        videoElement.controls = true;
        videoElement.playsInline = true;
        videoElement.autoplay = true;
        videoElement.style.width = '100%';
        videoElement.style.display = 'block';
        videoElement.style.borderRadius = '20px';
        
        videoPlaceholder.appendChild(videoElement);

        videoElement.play().catch(error => {
            console.warn("Autoplay blocked, attempting muted...");
            videoElement.muted = true;
            videoElement.play();
        });
    };

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        
        // Удаляем видео после завершения анимации закрытия
        setTimeout(() => {
            if (!videoModal.classList.contains('active')) {
                const video = videoPlaceholder.querySelector('video');
                if (video) {
                    video.pause();
                    video.src = "";
                    video.load();
                }
                videoPlaceholder.innerHTML = '';
            }
        }, 400);

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

    // Эффект шапки при скролле
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
}

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
    const modalVideo = document.getElementById('modal-video');
    const videoCards = document.querySelectorAll('.video-card');
    const closeModal = document.querySelector('.close-modal');

    // Функция открытия видео
    const openVideo = (videoSrc) => {
        // Сначала показываем модалку
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Полная очистка состояния плеера перед новым видео
        modalVideo.pause();
        modalVideo.removeAttribute('src');
        modalVideo.innerHTML = '';
        modalVideo.load();

        // Установка нового источника
        // Используем комбинацию src и load() - это самый стабильный вариант
        modalVideo.src = videoSrc;
        modalVideo.load();

        // Небольшая задержка перед игрой нужна для iPhone/Safari
        setTimeout(() => {
            const playPromise = modalVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn("Автовоспроизведение заблокировано. Пробуем Muted...", error);
                    // Если заблокировано (например, режим экономии энергии), пробуем без звука
                    modalVideo.muted = true;
                    modalVideo.play().catch(e => {
                        console.error("Видео не может быть воспроизведено даже без звука. Проверьте формат файла.");
                    });
                });
            }
        }, 100);
    };

    videoCards.forEach(card => {
        card.addEventListener('click', () => {
            const videoSrc = card.getAttribute('data-video');
            openVideo(videoSrc);
        });
    });

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        modalVideo.pause();
        
        // Очищаем источник через задержку, чтобы не было ошибки "Aborted"
        setTimeout(() => {
            if (!videoModal.classList.contains('active')) {
                modalVideo.removeAttribute('src');
                modalVideo.load();
            }
        }, 300);

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
}

document.addEventListener('DOMContentLoaded', function() {
    // Функция для инициализации карусели
    function initCarousel(carouselSelector) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;
        
        let currentIndex = 0;
        const itemWidth = 210; // 180px + 30px gap
        let autoScrollInterval;

        // Auto-scroll function
        function autoScroll() {
            currentIndex++;
            const currentTranslate = -currentIndex * itemWidth;
            carousel.style.transform = `translateX(${currentTranslate}px)`;
            
            // Если достигли дублированных элементов, незаметно возвращаемся к началу
            if (currentIndex >= 3) {
                setTimeout(() => {
                    carousel.style.transition = 'none';
                    currentIndex = 0;
                    carousel.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        carousel.style.transition = 'transform 0.5s ease-in-out';
                    }, 10);
                }, 500);
            }
        }

        // Start auto-scroll
        function startAutoScroll() {
            clearInterval(autoScrollInterval);
            autoScrollInterval = setInterval(autoScroll, 3000);
        }

        // Initialize
        carousel.style.transform = 'translateX(0)';
        currentIndex = 0;
        
        // Start auto-scroll
        startAutoScroll();
    }

    // Инициализируем все карусели
    initCarousel('.menu-section:first-of-type .carousel-track'); // Кофе
    initCarousel('.tea-section .carousel-track'); // Чай
    initCarousel('.ice-cream-section .carousel-track'); // Мороженое
    initCarousel('.drinks-section .carousel-track'); // Напитки
    initCarousel('.bakery-section .carousel-track'); // Выпечка
    initCarousel('.desserts-section .carousel-track'); // Десерты
    initCarousel('.gingerbread-section .carousel-track'); // Пряники
});

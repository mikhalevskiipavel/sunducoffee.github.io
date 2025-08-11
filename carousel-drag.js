function initCarouselWithDrag(carouselSelector) {
    const carousel = document.querySelector(carouselSelector);
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const originalItems = Array.from(track.querySelectorAll('.menu-item'));
    const numOriginal = originalItems.length;

    if (numOriginal === 0) return;

    // Удаляем существующие дубликаты, если они есть
    const allItems = Array.from(track.querySelectorAll('.menu-item'));
    if (allItems.length > numOriginal) {
        for (let i = numOriginal; i < allItems.length; i++) {
            allItems[i].remove();
        }
    }

    // Duplicate the items twice for buffering
    for (let i = 0; i < 2; i++) {
        originalItems.forEach(item => {
            const clone = item.cloneNode(true);
            track.appendChild(clone);
        });
    }

    const allItemsAfterClone = Array.from(track.querySelectorAll('.menu-item'));
    const initialIndex = numOriginal;
    let currentIndex = initialIndex;

    // Получаем реальную ширину элемента с учетом gap
    const firstItem = allItemsAfterClone[0];
    const itemWidth = firstItem.offsetWidth;
    const computedStyle = window.getComputedStyle(track);
    const gap = parseInt(computedStyle.gap) || 30;

    // Set initial position
    track.style.transform = `translateX(${-(itemWidth + gap) * currentIndex}px)`;

    let isDragging = false;
    let startPos = 0;
    let currentTranslate = -(itemWidth + gap) * currentIndex;
    let prevTranslate = currentTranslate;
    let animationID;

    function setPositionByIndex() {
        currentTranslate = -(itemWidth + gap) * currentIndex;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function animation() {
        track.style.transform = `translateX(${currentTranslate}px)`;
        if (isDragging) requestAnimationFrame(animation);
    }

    function touchStart(event) {
        event.preventDefault();
        startPos = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none';
        
        // Stop auto-scroll when user starts dragging
        if (window.autoScrollInterval) {
            clearInterval(window.autoScrollInterval);
            window.autoScrollInterval = null;
        }
    }

    function touchMove(event) {
        if (isDragging) {
            event.preventDefault();
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        
        cancelAnimationFrame(animationID);
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;

        // Snap to nearest item
        if (movedBy < -(itemWidth + gap) / 3 && currentIndex < initialIndex + numOriginal) {
            currentIndex += 1;
        }

        if (movedBy > (itemWidth + gap) / 3 && currentIndex > 0) {
            currentIndex -= 1;
        }

        setPositionByIndex();
        track.style.transition = 'transform 0.3s ease';

        // Handle infinite loop
        setTimeout(() => {
            if (currentIndex === 0 || currentIndex === initialIndex + numOriginal) {
                track.style.transition = 'none';
                currentIndex = initialIndex;
                setPositionByIndex();
            }
        }, 300);

        // Resume auto-scroll after a delay
        setTimeout(() => {
            if (!window.autoScrollInterval) {
                startAutoScroll();
            }
        }, 2000);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function startAutoScroll() {
        if (window.autoScrollInterval) {
            clearInterval(window.autoScrollInterval);
        }

        window.autoScrollInterval = setInterval(() => {
            if (!isDragging) {
                currentIndex++;
                setPositionByIndex();
                track.style.transition = 'transform 0.5s ease-in-out';

                // Handle infinite loop
                if (currentIndex >= initialIndex + numOriginal) {
                    setTimeout(() => {
                        track.style.transition = 'none';
                        currentIndex = initialIndex;
                        setPositionByIndex();
                    }, 500);
                }
            }
        }, 3000);
    }

    // Event listeners
    carousel.addEventListener('mousedown', touchStart);
    document.addEventListener('mousemove', touchMove);
    document.addEventListener('mouseup', touchEnd);

    // For touch devices
    carousel.addEventListener('touchstart', touchStart, { passive: false });
    carousel.addEventListener('touchmove', touchMove, { passive: false });
    carousel.addEventListener('touchend', touchEnd);

    // Start auto-scroll
    startAutoScroll();
}

// Initialize all carousels when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize each carousel section
    initCarouselWithDrag('.menu-section .carousel-container'); // Кофе
    initCarouselWithDrag('.tea-section .carousel-container');
    initCarouselWithDrag('.ice-cream-section .carousel-container');
    initCarouselWithDrag('.drinks-section .carousel-container');
    initCarouselWithDrag('.bakery-section .carousel-container');
    initCarouselWithDrag('.desserts-section .carousel-container');
    initCarouselWithDrag('.gingerbread-section .carousel-container');
});

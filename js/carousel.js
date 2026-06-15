/* carousel.js - Самописный премиум движок каруселей для Мобильных устройств */
document.addEventListener('DOMContentLoaded', () => {
    initServicesCarousel();
    initCasesCarousel();
});

class PremiumTouchCarousel {
    constructor(viewportId, containerId, cardClass) {
        this.viewport = document.getElementById(viewportId);
        this.container = document.getElementById(containerId);
        this.cards = this.container ? this.container.querySelectorAll(`.${cardClass}`) : [];
        
        this.currentIndex = 0;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.isDragging = false;
        
        this.init();
    }

    init() {
        if (!this.viewport || this.cards.length === 0) return;

        // Навешиваем события тача смартфона
        this.viewport.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
        this.viewport.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        this.viewport.addEventListener('touchend', this.touchEnd.bind(this));
        
        window.addEventListener('resize', this.updateLayout.bind(this));
        this.updateLayout();
    }

    touchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.container.style.transition = 'none'; // Отключаем плавность при ручном движении пальцем
    }

    touchMove(e) {
        if (!this.isDragging) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - this.startX;
        
        this.currentTranslate = this.prevTranslate + diffX;
        this.container.style.transform = `translateX(${this.currentTranslate}px)`;
        
        // Блокируем скролл экрана по вертикали, если идет уверенный свайп карусели
        if (Math.abs(diffX) > 7 && e.cancelable) {
            e.preventDefault();
        }
    }

    touchEnd() {
        this.isDragging = false;
        const movedBy = this.currentTranslate - this.prevTranslate;

        // Порог чувствительности свайпа (в пикселях)
        if (movedBy < -45 && this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
        } else if (movedBy > 45 && this.currentIndex > 0) {
            this.currentIndex--;
        }

        this.slideToIndex(this.currentIndex);
    }

    slideToIndex(index) {
        this.currentIndex = index;
        this.container.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
        
        const viewportWidth = this.viewport.offsetWidth;
        const card = this.cards[this.currentIndex];
        const cardWidth = card.offsetWidth;
        const cardMarginLeft = parseFloat(window.getComputedStyle(card).marginLeft) || 0;
        
        // Формула центрирования карточки ровно по центру экрана мобильного
        const targetTranslate = -(card.offsetLeft - (viewportWidth - cardWidth) / 2 + cardMarginLeft);
        
        this.container.style.transform = `translateX(${targetTranslate}px)`;
        this.currentTranslate = targetTranslate;
        this.prevTranslate = targetTranslate;

        this.updateClasses();
    }

    updateLayout() {
        setTimeout(() => {
            this.slideToIndex(this.currentIndex);
        }, 60);
    }

    updateClasses() {
        this.cards.forEach((card, idx) => {
            if (idx === this.currentIndex) {
                card.classList.add('active-slide');
            } else {
                card.classList.remove('active-slide');
            }
        });
    }
}

/* Настройка карусели услуг и логики разворачивания текста "Далее" */
function initServicesCarousel() {
    new PremiumTouchCarousel('servicesViewport', 'servicesContainer', 'service-card');
    
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
        const wrapper = card.querySelector('.service-desc-wrapper');
        const btnReadMore = card.querySelector('.btn-read-more');
        const btnCollapse = card.querySelector('.btn-collapse-service');

        if (!wrapper || !btnReadMore || !btnCollapse) return;

        btnReadMore.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.add('full-view');
            btnReadMore.style.display = 'none';
            btnCollapse.style.display = 'block';
        });

        btnCollapse.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.remove('full-view');
            btnReadMore.style.display = 'inline-block';
            btnCollapse.style.display = 'none';
            
            // Возвращаем фокус экрана к карточке, если текст был длинным
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

function initCasesCarousel() {
    new PremiumTouchCarousel('casesViewport', 'casesContainer', 'case-card');
}
/* main.js - Логика Хедера и Аккордеона */
document.addEventListener('DOMContentLoaded', () => {
    initHeaderBurger();
    initBenefitsAccordion();
});

/* 1. Логика Хедера: Бургер и плавно выезжающая горизонтальная линия */
function initHeaderBurger() {
    const trigger = document.getElementById('burgerTrigger');
    const menuLine = document.getElementById('navLineMenu');
    const links = document.querySelectorAll('.nav-link-item');

    if (!trigger || !menuLine) return;

    trigger.addEventListener('click', () => {
        trigger.classList.toggle('active');
        menuLine.classList.toggle('open');
    });

    // Плавный скролл при клике и закрытие линии-меню
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            // Пропускаем заглушку калькулятора
            if(targetId === '#calc') return;

            const targetSection = document.querySelector(targetId);
            
            trigger.classList.remove('active');
            menuLine.classList.remove('open');

            if (targetSection) {
                const headerOffset = 70; // Высота шапки
                const elementPosition = targetSection.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* 2. Блок преимуществ: разворачивание блоков по вертикали */
function initBenefitsAccordion() {
    const cards = document.querySelectorAll('.benefit-card');

    cards.forEach(card => {
        const toggleBtn = card.querySelector('.benefit-toggle-btn');
        if (!toggleBtn) return;

        toggleBtn.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');

            if (isExpanded) {
                card.classList.remove('expanded');
                toggleBtn.innerText = 'Подробнее';
            } else {
                card.classList.add('expanded');
                toggleBtn.innerText = 'Свернуть';
            }
        });
    });
}
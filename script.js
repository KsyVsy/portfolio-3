function showMessage() {
    alert("Спасибо за интерес к моему портфолио!");
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");
    
    // ✅ Исправлено: добавлен оператор ||
    if (!sidebar || !menuButton) return;

    sidebar.classList.toggle("active");
    menuButton.textContent = sidebar.classList.contains("active") ? "✖️" : "☰";
}

document.addEventListener("DOMContentLoaded", () => {
    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    /* =========================================
       АНИМАЦИЯ СЧЁТЧИКОВ (запускается при скролле)
    ========================================= */
    const counterElements = document.querySelectorAll(".number");
    
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                // ✅ Исправлено: добавлен оператор ??
                const target = Number(counter.dataset.target) ?? 0;
                let current = 0;
                const increment = Math.max(1, Math.ceil(target / 60));

                const update = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = current;
                        setTimeout(update, 16); // ~60fps
                    } else {
                        counter.textContent = target;
                    }
                };
                update();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    counterElements.forEach(el => counterObserver.observe(el));

    /* =========================================
       АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
    ========================================= */
    const animatedElements = document.querySelectorAll(".fade-in");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }
        );
        animatedElements.forEach(el => observer.observe(el));
    } else {
        animatedElements.forEach(el => el.classList.add("visible"));
    }

    /* =========================================
       ЗАКРЫТИЕ МЕНЮ
    ========================================= */
    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("menuButton");

    if (sidebar && menuButton) {
        sidebar.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                sidebar.classList.remove("active");
                menuButton.textContent = "☰";
            });
        });

        document.addEventListener("click", event => {
            const isInside = sidebar.contains(event.target);
            const isBtn = menuButton.contains(event.target);
            if (sidebar.classList.contains("active") && !isInside && !isBtn) {
                sidebar.classList.remove("active");
                menuButton.textContent = "☰";
            }
        });
    }

    /* =========================================
       ПАРАЛЛАКС (с оптимизацией)
    ========================================= */
    if (hero && heroContent) {
        let rafId;
        hero.addEventListener("mousemove", event => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = (event.clientX / window.innerWidth - 0.5) * 20;
                const y = (event.clientY / window.innerHeight - 0.5) * 20;
                // ✅ Исправлено: добавлены шаблонные строки с обратными кавычками
                hero.style.backgroundPosition = `calc(50% + ${x}px) calc(50% + ${y}px)`;
                heroContent.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
        });

        hero.addEventListener("mouseleave", () => {
            if (rafId) cancelAnimationFrame(rafId);
            hero.style.backgroundPosition = "center";
            heroContent.style.transform = "translate(0, 0)";
        });
    }

    /* =========================================
       ПЛАВНЫЙ СКРОЛЛ ПО ЯКОРЯМ
    ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const targetId = link.getAttribute("href");
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                
                // Закрыть мобильное меню при переходе по якорю
                if (sidebar?.classList.contains("active")) {
                    sidebar.classList.remove("active");
                    menuButton.textContent = "☰";
                }
                
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});
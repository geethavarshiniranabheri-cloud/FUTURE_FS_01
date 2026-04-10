// typing animation
const text = ["Web Developer", "CSE Student", "Tech Enthusiast"];
let i = 0, j = 0, isDeleting = false;

function type() {
    const el = document.getElementById("typing");
    if (!el) return;

    let current = text[i];

    if (!isDeleting) {
        el.innerHTML = current.substring(0, j++);
        if (j > current.length) {
            isDeleting = true;
            setTimeout(type, 1000);
            return;
        }
    } else {
        el.innerHTML = current.substring(0, j--);
        if (j < 0) {
            isDeleting = false;
            i = (i + 1) % text.length;
        }
    }

    setTimeout(type, isDeleting ? 50 : 100);
}
type();

// scroll animation + skills animation
const elements = document.querySelectorAll(".fade");

window.addEventListener("scroll", () => {
    elements.forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight - 100) {
            el.classList.add("show");

            // animate skill bars
            const bars = el.querySelectorAll(".skill-bar span");
            bars.forEach(bar => {
                bar.style.width = bar.getAttribute("data-width");
            });
        }
    });
});
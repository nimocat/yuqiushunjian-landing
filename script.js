const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const glow = document.querySelector(".cursor-glow");
if (glow && !reduceMotion) {
  window.addEventListener("pointermove", (event) => {
    glow.style.setProperty("--x", `${event.clientX}px`);
    glow.style.setProperty("--y", `${event.clientY}px`);
  });
}

const reveals = [...document.querySelectorAll(".reveal")];
const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.16 }
);
reveals.forEach((node) => revealObserver.observe(node));

const carousel = document.querySelector("[data-carousel]");
if (carousel && !reduceMotion) {
  const slides = [...carousel.querySelectorAll("img")];
  let index = 0;
  setInterval(() => {
    slides[index].classList.remove("active");
    index = (index + 1) % slides.length;
    slides[index].classList.add("active");
  }, 3200);
}

const counters = [...document.querySelectorAll("[data-count]")];
const counterObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const node = entry.target;
      const target = Number(node.dataset.count || "0");
      const start = performance.now();
      const duration = 900;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        node.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(node);
    }
  },
  { threshold: 0.8 }
);
counters.forEach((node) => counterObserver.observe(node));

if (!reduceMotion) {
  for (const card of document.querySelectorAll(".tilt-card")) {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 6}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  }

  for (const button of document.querySelectorAll(".magnetic")) {
    button.addEventListener("pointermove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  }
}

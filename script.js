const CONFIG = {
  email: "support@covexp.in"
};

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("primaryNav");
  const backTop = document.querySelector(".back-top");
  const year = document.getElementById("year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Current year
  if (year) year.textContent = new Date().getFullYear();

  // Sticky header + back to top
  const handleScroll = () => {
    header?.classList.toggle("scrolled", window.scrollY > 35);
    backTop?.classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Mobile navigation
  const closeMenu = () => {
    nav?.classList.remove("open");
    menuToggle?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    nav?.classList.add("open");
    menuToggle?.classList.add("active");
    menuToggle?.setAttribute("aria-expanded", "true");
    menuToggle?.setAttribute("aria-label", "Close navigation");
    document.body.classList.add("menu-open");
  };

  menuToggle?.addEventListener("click", () => {
    nav?.classList.contains("open") ? closeMenu() : openMenu();
  });

  nav?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  // Back to top
  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // Smooth internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  // Quote form
  const form = document.getElementById("quoteForm");

  if (form) {
    const fields = {
      name: form.elements.name,
      email: form.elements.email,
      service: form.elements.service,
      message: form.elements.message
    };

    const setError = (field, message) => {
      const label = field.closest("label");
      const small = label?.querySelector("small");
      field.setAttribute("aria-invalid", "true");
      if (small) small.textContent = message;
    };

    const clearError = field => {
      const label = field.closest("label");
      const small = label?.querySelector("small");
      field.removeAttribute("aria-invalid");
      if (small) small.textContent = "";
    };

    Object.values(fields).forEach(field => {
      field?.addEventListener("input", () => clearError(field));
      field?.addEventListener("change", () => clearError(field));
    });

    form.addEventListener("submit", event => {
      event.preventDefault();

      Object.values(fields).forEach(field => field && clearError(field));

      let valid = true;
      const name = fields.name.value.trim();
      const email = fields.email.value.trim();
      const service = fields.service.value.trim();
      const message = fields.message.value.trim();

      if (name.length < 2) {
        setError(fields.name, "Please enter your name.");
        valid = false;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError(fields.email, "Please enter a valid email address.");
        valid = false;
      }

      if (!service) {
        setError(fields.service, "Please select a service.");
        valid = false;
      }

      if (message.length < 10) {
        setError(fields.message, "Please provide a little more detail.");
        valid = false;
      }

      if (!valid) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
        return;
      }

      const company = form.elements.company.value.trim();
      const phone = form.elements.phone.value.trim();

      const subject = `COVEXP enquiry — ${service}`;
      const body = [
        "Hello COVEXP Team,",
        "",
        "I would like to enquire about your logistics services.",
        "",
        `Name: ${name}`,
        `Company: ${company || "Not provided"}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Service: ${service}`,
        "",
        "Message:",
        message,
        "",
        "Regards,",
        name
      ].join("\n");

      const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const success = form.querySelector(".form-success");
      if (success) {
        success.hidden = false;
        success.textContent = "Your email application is opening with the enquiry details.";
      }

      window.location.href = mailto;
    });
  }
});

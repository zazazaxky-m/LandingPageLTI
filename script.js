(function () {
  const data = window.lumiatechData;
  const localeButtons = document.querySelectorAll("[data-locale-button]");
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");
  let currentLocale = localStorage.getItem("lumiatech-locale") || data.defaultLocale;
  let currentFilter = "all";

  function text(value) {
    if (!value || typeof value === "string") return value || "";
    return value[currentLocale] || value.en || value.id || value.zh || "";
  }

  function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node) node.textContent = text(value);
  }

  function initials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();
  }

  function renderNav() {
    const navHtml = data.nav
      .map((item) => `<a href="${item.href}">${text(item.label)}</a>`)
      .join("");
    document.querySelector("[data-desktop-nav]").innerHTML = navHtml;
    document.querySelector("[data-mobile-nav]").innerHTML = navHtml;
    document.querySelector("[data-footer-nav]").innerHTML = navHtml;
  }

  function renderHero() {
    setText("[data-brand-name]", data.brand.name);
    setText("[data-footer-brand]", data.brand.name);
    setText("[data-hero-title]", data.brand.tagline);
    setText("[data-hero-description]", data.brand.shortDescription);
    setText("[data-hero-primary]", data.brand.ctaPrimary);
    setText("[data-hero-secondary]", data.brand.ctaSecondary);
    setText("[data-nav-cta]", data.brand.ctaSecondary);
    setText("[data-footer-tagline]", data.brand.tagline);
    document.title = `${data.brand.name} - ${text(data.brand.tagline)}`;

    document.querySelector("[data-hero-tags]").innerHTML = data.heroTags
      .map((tag) => `<span>${tag}</span>`)
      .join("");

    document.querySelector("[data-hero-stats]").innerHTML = data.heroStats
      .map(
        (item) => `
          <div class="stat">
            <strong>${item.value}</strong>
            <span>${text(item.label)}</span>
          </div>
        `
      )
      .join("");
  }

  function renderPartners() {
    document.querySelector("[data-partners]").innerHTML = data.partners
      .map(
        (partner) => `
          <div class="partner-logo" title="${partner.name}">
            <span>${initials(partner.name)}</span>
            <small>${partner.name}</small>
          </div>
        `
      )
      .join("");
  }

  function renderAbout() {
    setText("[data-about-eyebrow]", data.about.eyebrow);
    setText("[data-about-title]", data.about.title);
    setText("[data-about-body]", data.about.body);
    document.querySelector("[data-about-bullets]").innerHTML = data.about.bullets
      .map((bullet) => `<li>${text(bullet)}</li>`)
      .join("");
  }

  function renderSolutions() {
    const memberLabel = currentLocale === "zh" ? "\u6210\u5458" : currentLocale === "id" ? "member" : "members";
    document.querySelector("[data-solutions]").innerHTML = data.divisions
      .map(
        (division, index) => `
          <article class="solution-card reveal" style="--delay:${index * 70}ms">
            <div class="solution-card__top">
              <span class="solution-icon">${division.code}</span>
              <span class="member-count">${division.members} ${memberLabel}</span>
            </div>
            <h3>${text(division.title)}</h3>
            <p>${text(division.body)}</p>
            <div class="chip-row">
              ${division.capabilities.map((capability) => `<span>${capability}</span>`).join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderProductFilters() {
    const filters = [
      { key: "all", label: { en: "All", id: "Semua", zh: "全部" } },
      ...data.divisions.map((division) => ({ key: division.key, label: division.title }))
    ];

    document.querySelector("[data-product-filters]").innerHTML = filters
      .map(
        (filter) => `
          <button type="button" class="${filter.key === currentFilter ? "active" : ""}" data-filter="${filter.key}">
            ${text(filter.label)}
          </button>
        `
      )
      .join("");

    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        renderProductFilters();
        renderProducts();
      });
    });
  }

  function renderProducts() {
    const products =
      currentFilter === "all"
        ? data.products
        : data.products.filter((product) => product.division === currentFilter);

    document.querySelector("[data-products]").innerHTML = products
      .map(
        (product, index) => `
          <article class="product-card reveal" style="--delay:${index * 70}ms">
            <div class="product-visual product-visual--${product.division}">
              <span>${product.category}</span>
            </div>
            <div class="product-card__body">
              <div class="product-meta">
                <span>${product.status}</span>
                <span>${product.category}</span>
              </div>
              <h3>${product.title}</h3>
              <p>${text(product.body)}</p>
              <div class="chip-row">
                ${product.stack.map((item) => `<span>${item}</span>`).join("")}
              </div>
            </div>
          </article>
        `
      )
      .join("");
    observeReveal();
  }

  function renderWhy() {
    document.querySelector("[data-why]").innerHTML = data.why
      .map(
        (item, index) => `
          <article class="why-card reveal" style="--delay:${index * 70}ms">
            <span>0${index + 1}</span>
            <h3>${text(item.title)}</h3>
            <p>${text(item.body)}</p>
          </article>
        `
      )
      .join("");
  }

  function renderRemote() {
    setText("[data-remote-title]", data.remote.title);
    setText("[data-remote-body]", data.remote.body);
  }

  function renderTeam() {
    document.querySelector("[data-team]").innerHTML = data.team
      .map(
        (member, index) => `
          <article class="team-card reveal" style="--delay:${index * 70}ms">
            <div class="avatar">${index + 1}</div>
            <h3>${member.role}</h3>
            <div class="chip-row">
              ${member.skills.map((skill) => `<span>${skill}</span>`).join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  function renderAcademicCareer() {
    document.querySelector("[data-academic]").innerHTML = data.academic
      .map(
        (item) => `
          <article>
            <h3>${text(item.title)}</h3>
            <p>${text(item.body)}</p>
          </article>
        `
      )
      .join("");

    document.querySelector("[data-careers]").innerHTML = data.careers
      .map(
        (job) => `
          <article class="job-row">
            <div>
              <h3>${job.title}</h3>
              <p>${job.division} - ${job.type}</p>
            </div>
            <span>${text(job.status)}</span>
          </article>
        `
      )
      .join("");
  }

  function renderContact() {
    setText("[data-contact-title]", data.contact.title);
    setText("[data-contact-address]", data.contact.address);

    const email = document.querySelector("[data-contact-email]");
    email.textContent = data.contact.email;
    email.href = `mailto:${data.contact.email}`;

    const phone = document.querySelector("[data-contact-phone]");
    phone.textContent = data.contact.phone;
    phone.href = `tel:${data.contact.phone.replace(/\s/g, "")}`;

    document.querySelector("[data-interest-select]").innerHTML = data.contact.interests
      .map((interest) => `<option>${interest}</option>`)
      .join("");
  }

  function updateSectionLabels() {
    const labels = {
      "[data-hero-eyebrow]": {
        en: "Engineering technology company",
        id: "Perusahaan engineering technology",
        zh: "工程技术公司"
      },
      "[data-partner-label]": {
        en: "Partners / Clients / Collaborations",
        id: "Partner / Client / Kolaborasi",
        zh: "合作伙伴 / 客户 / 协作"
      },
      "[data-solutions-eyebrow]": { en: "Solutions", id: "Solusi", zh: "解决方案" },
      "[data-solutions-title]": {
        en: "Four divisions. One engineering delivery system.",
        id: "Empat divisi. Satu sistem delivery engineering.",
        zh: "四个部门。一个工程交付系统。"
      },
      "[data-products-eyebrow]": { en: "Featured Products", id: "Produk Unggulan", zh: "精选产品" },
      "[data-products-title]": {
        en: "Product concepts ready to become a full catalog.",
        id: "Konsep produk yang siap berkembang jadi katalog penuh.",
        zh: "可扩展为完整目录的产品概念。"
      },
      "[data-why-eyebrow]": { en: "Why Choose Us", id: "Kenapa Memilih Kami", zh: "为什么选择我们" },
      "[data-why-title]": {
        en: "Practical engineering, documented delivery, secure product thinking.",
        id: "Engineering praktis, delivery terdokumentasi, dan produk yang aman.",
        zh: "务实工程、文档化交付与安全产品思维。"
      },
      "[data-remote-eyebrow]": { en: "Remote Collaboration", id: "Kolaborasi Remote", zh: "远程协作" },
      "[data-team-eyebrow]": { en: "Employee / Team", id: "Employee / Tim", zh: "员工 / 团队" },
      "[data-team-title]": {
        en: "Lean team structure for focused execution.",
        id: "Struktur tim ramping untuk eksekusi yang fokus.",
        zh: "精简团队结构，专注执行。"
      },
      "[data-academic-eyebrow]": { en: "Academic", id: "Akademik", zh: "学术" },
      "[data-academic-title]": {
        en: "Research, internship, and university collaboration.",
        id: "Riset, magang, dan kolaborasi kampus.",
        zh: "研究、实习与大学合作。"
      },
      "[data-career-eyebrow]": { en: "Career", id: "Karier", zh: "招聘" },
      "[data-career-title]": {
        en: "Remote-friendly roles for builders.",
        id: "Role ramah remote untuk para builder.",
        zh: "面向建设者的远程友好岗位。"
      },
      "[data-contact-eyebrow]": { en: "Contact Us", id: "Hubungi Kami", zh: "\u8054\u7cfb\u6211\u4eec" },
      "[data-form-label=\"name\"]": { en: "Name", id: "Nama", zh: "\u59d3\u540d" },
      "[data-form-label=\"email\"]": { en: "Email", id: "Email", zh: "\u90ae\u7bb1" },
      "[data-form-label=\"interest\"]": { en: "Interest", id: "Minat", zh: "\u9700\u6c42\u7c7b\u522b" },
      "[data-form-label=\"message\"]": { en: "Message", id: "Pesan", zh: "\u6d88\u606f" },
      "[data-form-submit]": { en: "Send Message", id: "Kirim Pesan", zh: "\u53d1\u9001\u6d88\u606f" }
    };

    Object.entries(labels).forEach(([selector, value]) => setText(selector, value));
  }

  function bindContactForm() {
    const form = document.querySelector("[data-contact-form]");
    const status = document.querySelector("[data-form-status]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent =
        currentLocale === "id"
          ? "Pesan siap dikirim. Backend contact form masuk fase berikutnya."
          : currentLocale === "zh"
            ? "消息已准备好。联系表单后端将在下一阶段接入。"
            : "Message prepared. Contact form backend is planned for the next phase.";
      form.reset();
    });
  }

  function observeReveal() {
    const nodes = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    nodes.forEach((node) => observer.observe(node));
  }

  function updateLanguageState() {
    document.documentElement.lang = currentLocale === "zh" ? "zh-CN" : currentLocale;
    localeButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.localeButton === currentLocale);
    });
  }

  function renderAll() {
    updateLanguageState();
    renderNav();
    updateSectionLabels();
    renderHero();
    renderPartners();
    renderAbout();
    renderSolutions();
    renderProductFilters();
    renderProducts();
    renderWhy();
    renderRemote();
    renderTeam();
    renderAcademicCareer();
    renderContact();
    observeReveal();
  }

  localeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentLocale = button.dataset.localeButton;
      localStorage.setItem("lumiatech-locale", currentLocale);
      renderAll();
    });
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = mobilePanel.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobilePanel.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      mobilePanel.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  });

  bindContactForm();
  renderAll();
})();

window.lumiatechData = {
  defaultLocale: "id",
  brand: {
    name: "Lumiatech",
    tagline: {
      en: "Discover Engineering Technology",
      id: "Discover Engineering Technology",
      zh: "探索工程技术"
    },
    shortDescription: {
      en: "A remote-ready engineering technology company building prototypes, IT platforms, mobile products, and secure digital systems.",
      id: "Perusahaan teknologi engineering yang siap remote untuk membangun prototype, platform IT, produk mobile, dan sistem digital yang aman.",
      zh: "一家支持远程协作的工程技术公司，构建原型、IT 平台、移动产品与安全数字系统。"
    },
    ctaPrimary: {
      en: "Explore Solutions",
      id: "Lihat Solusi",
      zh: "探索方案"
    },
    ctaSecondary: {
      en: "Contact Us",
      id: "Hubungi Kami",
      zh: "联系我们"
    }
  },
  nav: [
    { label: { en: "Home", id: "Home", zh: "首页" }, href: "#home" },
    { label: { en: "Solutions", id: "Solusi", zh: "解决方案" }, href: "#solutions" },
    { label: { en: "Products", id: "Produk", zh: "产品" }, href: "#products" },
    { label: { en: "Team", id: "Tim", zh: "团队" }, href: "#team" },
    { label: { en: "Academic", id: "Akademik", zh: "学术" }, href: "#academic" },
    { label: { en: "Career", id: "Karier", zh: "招聘" }, href: "#career" },
    { label: { en: "Contact", id: "Kontak", zh: "联系" }, href: "#contact" }
  ],
  heroStats: [
    { value: "4", label: { en: "Divisions", id: "Divisi", zh: "部门" } },
    { value: "11+", label: { en: "Core Members", id: "Core Member", zh: "核心成员" } },
    { value: "3", label: { en: "Languages", id: "Bahasa", zh: "语言" } }
  ],
  heroTags: [
    "Prototype",
    "Web Platform",
    "Android/iOS",
    "Security"
  ],
  partners: [
    { name: "Nusa Research", type: "academic" },
    { name: "Astra AeroLab", type: "client" },
    { name: "Mitra Robotics", type: "partner" },
    { name: "Sagara University", type: "academic" },
    { name: "TeknoCloud", type: "vendor" },
    { name: "Sentra Energy", type: "client" }
  ],
  about: {
    eyebrow: { en: "Company Profile", id: "Profil Perusahaan", zh: "公司简介" },
    title: {
      en: "Built for teams that need engineering depth and product speed.",
      id: "Dibangun untuk tim yang butuh kedalaman engineering dan kecepatan produk.",
      zh: "为需要工程深度与产品速度的团队而建。"
    },
    body: {
      en: "Lumiatech connects hardware exploration, software delivery, mobile development, and cyber security into one practical technology partner. The company is intentionally remote-friendly, so collaboration can move fast across cities, labs, and field environments.",
      id: "Lumiatech menghubungkan eksplorasi hardware, delivery software, pengembangan mobile, dan cyber security dalam satu partner teknologi yang praktis. Perusahaan ini dirancang ramah remote agar kolaborasi bisa berjalan cepat lintas kota, lab, dan lapangan.",
      zh: "Lumiatech 将硬件探索、软件交付、移动开发和网络安全连接成一个务实的技术伙伴。公司支持远程协作，让跨城市、实验室和现场环境的合作更高效。"
    },
    bullets: [
      { en: "Prototype-first mindset for uncertain ideas.", id: "Mindset prototype-first untuk ide yang masih berkembang.", zh: "以原型优先验证不确定想法。" },
      { en: "Engineering documentation that supports handover.", id: "Dokumentasi engineering yang siap untuk handover.", zh: "支持交接的工程文档。" },
      { en: "Secure-by-design delivery across product layers.", id: "Delivery secure-by-design di setiap lapisan produk.", zh: "贯穿产品层的安全设计交付。" }
    ]
  },
  divisions: [
    {
      key: "engineering",
      code: "ENG",
      members: "+/- 4",
      title: { en: "Engineering / Prototype", id: "Engineering / Prototype", zh: "工程 / 原型" },
      body: {
        en: "Hardware, IoT, embedded systems, mechanical and electronic prototyping for early-stage validation.",
        id: "Hardware, IoT, embedded system, serta prototype mekanik dan elektronik untuk validasi awal.",
        zh: "硬件、物联网、嵌入式系统、机械和电子原型，用于早期验证。"
      },
      capabilities: ["IoT", "Embedded", "CAD", "Firmware"]
    },
    {
      key: "it",
      code: "IT",
      members: "3",
      title: { en: "IT Solution", id: "IT Solution", zh: "IT 解决方案" },
      body: {
        en: "Web applications, backend systems, dashboards, APIs, cloud automation, and enterprise tooling.",
        id: "Web app, backend, dashboard, API, cloud automation, dan tooling enterprise.",
        zh: "Web 应用、后端系统、仪表盘、API、云自动化与企业工具。"
      },
      capabilities: ["Dashboard", "API", "Cloud", "Automation"]
    },
    {
      key: "mobile",
      code: "APP",
      members: "2",
      title: { en: "Mobile App", id: "Mobile App", zh: "移动应用" },
      body: {
        en: "Android, iOS, cross-platform apps, API integration, and mobile UX for field-ready products.",
        id: "Android, iOS, cross-platform app, integrasi API, dan UX mobile untuk produk siap lapangan.",
        zh: "Android、iOS、跨平台应用、API 集成与适用于现场产品的移动体验。"
      },
      capabilities: ["Android", "iOS", "Flutter", "UX"]
    },
    {
      key: "security",
      code: "SEC",
      members: "2",
      title: { en: "Cyber Security", id: "Cyber Security", zh: "网络安全" },
      body: {
        en: "Security assessment, penetration testing, vulnerability review, monitoring, and secure architecture.",
        id: "Security assessment, penetration testing, vulnerability review, monitoring, dan secure architecture.",
        zh: "安全评估、渗透测试、漏洞审查、监控与安全架构。"
      },
      capabilities: ["Pentest", "VA", "Monitoring", "Hardening"]
    }
  ],
  products: [
    {
      title: "FieldOps Control Hub",
      category: "IT Solution",
      division: "it",
      status: "Featured",
      body: {
        en: "Operational dashboard for assets, sensors, workflows, and field reporting.",
        id: "Dashboard operasional untuk aset, sensor, workflow, dan laporan lapangan.",
        zh: "用于资产、传感器、流程和现场报告的运营仪表盘。"
      },
      stack: ["Next.js", "PostgreSQL", "MQTT"]
    },
    {
      title: "Prototype Sensor Kit",
      category: "Engineering",
      division: "engineering",
      status: "Prototype",
      body: {
        en: "Rapid sensor kit for validating hardware concepts before full product build.",
        id: "Sensor kit cepat untuk validasi konsep hardware sebelum produk penuh dibuat.",
        zh: "用于完整产品开发前快速验证硬件概念的传感器套件。"
      },
      stack: ["ESP32", "C", "3D CAD"]
    },
    {
      title: "Secure Mobile Suite",
      category: "Mobile App",
      division: "mobile",
      status: "Concept",
      body: {
        en: "Mobile app foundation with secure auth, offline sync, and API integration.",
        id: "Fondasi mobile app dengan auth aman, offline sync, dan integrasi API.",
        zh: "具备安全认证、离线同步和 API 集成的移动应用基础。"
      },
      stack: ["Flutter", "REST", "Auth"]
    }
  ],
  why: [
    {
      title: { en: "One practical team", id: "Satu tim praktis", zh: "务实的一体化团队" },
      body: {
        en: "Hardware, software, mobile, and security teams work around one product objective.",
        id: "Tim hardware, software, mobile, dan security bekerja pada satu objektif produk.",
        zh: "硬件、软件、移动和安全团队围绕同一个产品目标协作。"
      }
    },
    {
      title: { en: "Remote-ready delivery", id: "Delivery siap remote", zh: "远程就绪交付" },
      body: {
        en: "Designed for async updates, technical documentation, review cycles, and distributed execution.",
        id: "Dirancang untuk update async, dokumentasi teknis, review cycle, dan eksekusi terdistribusi.",
        zh: "支持异步更新、技术文档、评审周期和分布式执行。"
      }
    },
    {
      title: { en: "Security from day one", id: "Security sejak awal", zh: "从第一天开始安全" },
      body: {
        en: "Security reviews are treated as a delivery layer, not a last-minute patch.",
        id: "Security review diperlakukan sebagai lapisan delivery, bukan tambalan di akhir.",
        zh: "安全评审是交付的一层，而不是最后补丁。"
      }
    }
  ],
  academic: [
    {
      title: { en: "Internship Studio", id: "Internship Studio", zh: "实习工作室" },
      body: {
        en: "Structured internship projects connected to real engineering and product problems.",
        id: "Program magang terstruktur yang terhubung dengan masalah engineering dan produk nyata.",
        zh: "与真实工程和产品问题相连的结构化实习项目。"
      }
    },
    {
      title: { en: "Research Collaboration", id: "Kolaborasi Riset", zh: "研究合作" },
      body: {
        en: "University and lab collaboration for prototypes, applied research, and workshops.",
        id: "Kolaborasi kampus dan lab untuk prototype, riset terapan, dan workshop.",
        zh: "与大学和实验室合作开展原型、应用研究与工作坊。"
      }
    }
  ],
  careers: [
    {
      title: "Prototype Engineer",
      division: "Engineering",
      type: "Hybrid / Remote",
      status: { en: "Opening soon", id: "Segera dibuka", zh: "即将开放" }
    },
    {
      title: "Full-stack Developer",
      division: "IT Solution",
      type: "Remote",
      status: { en: "Open", id: "Dibuka", zh: "开放" }
    },
    {
      title: "Mobile Developer Intern",
      division: "Mobile App",
      type: "Remote Internship",
      status: { en: "Draft", id: "Draft", zh: "草稿" }
    }
  ],
  team: [
    { role: "Engineering Lead", skills: ["IoT", "Prototype", "CAD"] },
    { role: "Backend Engineer", skills: ["API", "Cloud", "Automation"] },
    { role: "Mobile Engineer", skills: ["Android", "iOS", "UX"] },
    { role: "Security Analyst", skills: ["VA", "Pentest", "Monitoring"] }
  ],
  remote: {
    title: {
      en: "Built for remote collaboration without losing engineering clarity.",
      id: "Dibangun untuk kolaborasi remote tanpa kehilangan kejelasan engineering.",
      zh: "为远程协作而建，同时保持工程清晰度。"
    },
    body: {
      en: "Every project is organized around technical notes, sprint reviews, prototype evidence, and decision records so clients can follow progress even when teams are distributed.",
      id: "Setiap project disusun dengan catatan teknis, sprint review, bukti prototype, dan decision record agar client bisa mengikuti progres walau tim terdistribusi.",
      zh: "每个项目围绕技术记录、迭代评审、原型证据和决策记录组织，即使团队分布各地，客户也能清楚跟踪进展。"
    }
  },
  contact: {
    title: {
      en: "Start with the problem. We will map the technology path.",
      id: "Mulai dari masalahnya. Kami bantu petakan jalur teknologinya.",
      zh: "从问题开始。我们将一起规划技术路径。"
    },
    email: "hello@lumiatech.example",
    phone: "+62 812 0000 0000",
    address: {
      en: "Remote-first company, Indonesia",
      id: "Perusahaan remote-first, Indonesia",
      zh: "远程优先公司，印度尼西亚"
    },
    interests: [
      "Engineering / Prototype",
      "IT Solution",
      "Mobile App",
      "Cyber Security",
      "Partnership",
      "Career",
      "Academic",
      "Other"
    ]
  }
};

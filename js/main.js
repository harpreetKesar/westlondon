const pages = [
  { key: "home", label: "Home", href: "index.html" },
  { key: "services", label: "Services", href: "services.html" },
  { key: "emergency", label: "Emergency", href: "emergency-electrician.html" },
  { key: "certificates", label: "Certificates", href: "landlord-certificates.html" },
  { key: "contact", label: "Contact", href: "contact.html" }
];

function getActivePage() {
  const declaredPage = document.body.dataset.page;

  if (declaredPage) {
    return declaredPage;
  }

  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const currentPage = pages.find((page) => page.href === currentFile);

  return currentPage ? currentPage.key : "home";
}

function renderHeader() {
  const headerMount = document.querySelector("[data-site-header]");

  if (!headerMount) {
    return;
  }

  const activePage = getActivePage();
  const navigation = pages
    .map((page) => {
      const currentAttribute = page.key === activePage ? ' aria-current="page"' : "";
      return `<a href="${page.href}"${currentAttribute}>${page.label}</a>`;
    })
    .join("");

  headerMount.innerHTML = `
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="West London Electrical Services home">
        <img src="images/westlondonelectricalservices.jpeg" alt="West London Electrical Services logo">
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="site-nav" aria-label="Main navigation">
        ${navigation}
      </nav>
      <a class="header-call" href="tel:07355573777">073 5557 3777</a>
    </header>
  `;
}

function renderFooter() {
  const footerMount = document.querySelector("[data-site-footer]");

  if (!footerMount) {
    return;
  }

  footerMount.innerHTML = `
    <footer class="site-footer">
      <p>&copy; West London Electrical Services</p>
      <p><a href="tel:07355573777">073 5557 3777</a> </p>
    </footer>
  `;
}

function setupMenuToggle() {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");

  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

renderHeader();
renderFooter();
setupMenuToggle();

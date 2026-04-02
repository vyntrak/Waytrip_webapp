(function () {
  const grid = document.getElementById('destinations-grid');
  const loadingEl = document.getElementById('destinations-loading');
  const countEl = document.getElementById('destinations-count');
  const heroTitle = document.getElementById('destination-hero-title');
  const heroSubtitle = document.getElementById('destination-hero-subtitle');
  const aboutTitle = document.getElementById('destination-about-title');
  const aboutDescription = document.getElementById('destination-about-description');

  if (!grid) return;

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function buildCard(destination) {
    const name = escapeHtml(destination.name || 'Destination');
    const country = escapeHtml(destination.country || '');
    const description = escapeHtml(destination.description || 'Discover this amazing destination with WAYTRIP.');
    const image = destination.hero_image || 'src/images/pages/destinations/1.png';

    return `
      <article class="group overflow-hidden rounded bg-white shadow-[0_6px_30px_0_#0510360d]">
        <div class="overflow-hidden">
          <img src="${image}" alt="${name}" class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div class="p-5">
          <h3 class="text-dark-1 text-xl font-semibold">${name}</h3>
          <p class="text-light-1 mt-1 text-sm">${country}</p>
          <p class="text-dark-1 mt-3 text-sm leading-relaxed">${description}</p>
        </div>
      </article>
    `;
  }

  function renderDestinations(destinations) {
    if (!destinations.length) {
      grid.innerHTML = '<p class="text-light-1 text-sm">No destinations available yet.</p>';
      if (countEl) countEl.textContent = '0 destinations';
      return;
    }

    const first = destinations[0];
    if (heroTitle) heroTitle.textContent = `Explore ${first.name}`;
    if (heroSubtitle) {
      const country = first.country ? ` in ${first.country}` : '';
      heroSubtitle.textContent = `Explore deals, travel guides and things to do${country}`;
    }
    if (aboutTitle) aboutTitle.textContent = `What to know before visiting ${first.name}`;
    if (aboutDescription) {
      aboutDescription.textContent = first.description || 'Plan your trip with local insights and recommendations.';
    }

    grid.innerHTML = destinations.map(buildCard).join('');
    if (countEl) countEl.textContent = `${destinations.length} destinations`;
  }

  fetch('/api/destinations')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Failed to load destinations');
      }
      return response.json();
    })
    .then(function (data) {
      renderDestinations(data.destinations || []);
    })
    .catch(function () {
      if (loadingEl) {
        loadingEl.textContent = 'Could not load destinations. Please try again later.';
      }
    });
})();

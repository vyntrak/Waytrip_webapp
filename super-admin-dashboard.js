(function () {
  const token = localStorage.getItem('waytrip_token');
  if (!token) return;

  const fields = {
    homepageBanners: document.getElementById('settings-homepage-banners'),
    featuredDestinations: document.getElementById('settings-featured-destinations'),
    sectionToggles: document.getElementById('settings-section-toggles'),
    promotionalContent: document.getElementById('settings-promotional-content'),
    menuLinks: document.getElementById('settings-menu-links'),
  };

  function pretty(value) {
    return JSON.stringify(value || (Array.isArray(value) ? [] : {}), null, 2);
  }

  fetch('/api/admin/website-settings', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load settings');
      return response.json();
    })
    .then(function (data) {
      const settings = data.settings || {};
      fields.homepageBanners.value = pretty(settings.homepage_banners || []);
      fields.featuredDestinations.value = pretty(settings.featured_destinations || []);
      fields.sectionToggles.value = pretty(settings.section_toggles || {});
      fields.promotionalContent.value = pretty(settings.promotional_content || []);
      fields.menuLinks.value = pretty(settings.menu_links || []);
    })
    .catch(function () {
      alert('Could not load website settings');
    });

  document.getElementById('settings-save-btn').addEventListener('click', function () {
    try {
      const payload = {
        homepageBanners: JSON.parse(fields.homepageBanners.value || '[]'),
        featuredDestinations: JSON.parse(fields.featuredDestinations.value || '[]'),
        sectionToggles: JSON.parse(fields.sectionToggles.value || '{}'),
        promotionalContent: JSON.parse(fields.promotionalContent.value || '[]'),
        menuLinks: JSON.parse(fields.menuLinks.value || '[]'),
      };

      fetch('/api/admin/website-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(payload),
      })
        .then(function (response) {
          if (!response.ok) throw new Error('Update failed');
          return response.json();
        })
        .then(function () {
          alert('Website settings updated successfully');
        })
        .catch(function () {
          alert('Failed to update website settings');
        });
    } catch (error) {
      alert('Invalid JSON format in one of the fields');
    }
  });
})();

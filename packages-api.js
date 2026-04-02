(function () {
  const grid = document.getElementById('packages-grid');
  const loadingEl = document.getElementById('packages-loading');
  const countEl = document.getElementById('packages-count');

  if (!grid) return;

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function packageCard(item) {
    const title = escapeHtml(item.title || 'Travel Package');
    const location = escapeHtml(item.location || '');
    const description = escapeHtml(item.description || 'Explore this package with WAYTRIP.');
    const price = Number(item.price || 0).toFixed(2);
    const days = item.duration_days ? `${item.duration_days} days` : 'Custom duration';
    const image = item.cover_image || 'src/images/hotels/1/1.png';

    return `
      <article class="group overflow-hidden rounded bg-white shadow-[0_10px_30px_0_#0510360d]">
        <div class="overflow-hidden">
          <img src="${image}" alt="${title}" class="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div class="space-y-3 p-5">
          <h3 class="text-dark-1 text-xl font-semibold">${title}</h3>
          <p class="text-light-1 text-sm">${location}</p>
          <p class="text-dark-1 text-sm leading-relaxed">${description}</p>
          <div class="flex items-center justify-between pt-2">
            <span class="text-dark-1 text-sm font-medium">${days}</span>
            <span class="text-blue-1 text-lg font-semibold">$${price}</span>
          </div>
          <button
            class="book-now-btn bg-blue-1 hover:bg-dark-1 mt-2 inline-flex h-11 items-center justify-center rounded px-5 text-sm font-medium text-white transition"
            data-package-id="${item.id}"
            type="button"
          >
            Book Now
          </button>
        </div>
      </article>
    `;
  }

  function setupBookingButtons() {
    grid.querySelectorAll('.book-now-btn').forEach(function (button) {
      button.addEventListener('click', function () {
        const token = localStorage.getItem('waytrip_token');
        if (!token) {
          window.location.href = 'login.html';
          return;
        }

        button.disabled = true;
        button.textContent = 'Booking...';

        fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({ packageId: Number(button.dataset.packageId) }),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Booking failed');
            return response.json();
          })
          .then(function () {
            button.textContent = 'Booked (Upcoming)';
          })
          .catch(function () {
            button.disabled = false;
            button.textContent = 'Book Now';
            alert('Could not create booking. Please try again.');
          });
      });
    });
  }

  fetch('/api/packages')
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load packages');
      return response.json();
    })
    .then(function (data) {
      const packages = data.packages || [];
      if (!packages.length) {
        grid.innerHTML = '<p class="text-light-1 text-sm">No packages found.</p>';
        if (countEl) countEl.textContent = '0 packages';
        return;
      }

      grid.innerHTML = packages.map(packageCard).join('');
      setupBookingButtons();
      if (countEl) countEl.textContent = `${packages.length} packages`;
    })
    .catch(function () {
      if (loadingEl) loadingEl.textContent = 'Could not load packages. Please try again later.';
    });
})();

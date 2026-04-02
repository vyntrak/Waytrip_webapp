(function () {
  const token = localStorage.getItem('waytrip_token');
  const list = document.getElementById('crm-bookings-list');
  if (!token || !list) return;

  function bookingItemTemplate(booking) {
    const userName = [booking.first_name, booking.last_name].filter(Boolean).join(' ');
    const status = booking.status || 'upcoming';
    const notes = booking.notes || '';

    return `
      <div class="border-border rounded border p-4" data-booking-id="${booking.id}">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-dark-1 font-semibold">#${booking.id} • ${booking.package_title || 'Package Booking'}</h3>
          <span class="text-light-1 text-sm">${new Date(booking.created_at).toLocaleString()}</span>
        </div>
        <p class="text-sm">User: <span class="font-medium">${userName}</span> (${booking.email})</p>
        <p class="text-sm">Location: ${booking.package_location || '-'}</p>

        <div class="mt-3 flex flex-wrap items-center gap-3">
          <select class="crm-status border-border h-10 rounded border px-3 text-sm">
            <option value="upcoming" ${status === 'upcoming' ? 'selected' : ''}>upcoming</option>
            <option value="completed" ${status === 'completed' ? 'selected' : ''}>completed</option>
            <option value="cancelled" ${status === 'cancelled' ? 'selected' : ''}>cancelled</option>
          </select>
          <button class="crm-update-status bg-blue-1 rounded px-3 py-2 text-sm text-white">Update Status</button>
        </div>

        <div class="mt-3">
          <textarea class="crm-notes border-border w-full rounded border p-3 text-sm" rows="2" placeholder="Booking notes">${notes}</textarea>
          <button class="crm-save-notes bg-dark-1 mt-2 rounded px-3 py-2 text-sm text-white">Save Notes</button>
        </div>
      </div>
    `;
  }

  function attachActions() {
    list.querySelectorAll('[data-booking-id]').forEach(function (card) {
      const bookingId = card.dataset.bookingId;
      const statusSelect = card.querySelector('.crm-status');
      const updateStatusBtn = card.querySelector('.crm-update-status');
      const notesInput = card.querySelector('.crm-notes');
      const saveNotesBtn = card.querySelector('.crm-save-notes');

      updateStatusBtn.addEventListener('click', function () {
        fetch('/api/crm/bookings/' + bookingId + '/status', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({ status: statusSelect.value }),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Failed status update');
            return response.json();
          })
          .then(function () {
            alert('Booking status updated');
          })
          .catch(function () {
            alert('Could not update booking status');
          });
      });

      saveNotesBtn.addEventListener('click', function () {
        fetch('/api/crm/bookings/' + bookingId + '/notes', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({ notes: notesInput.value }),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Failed notes update');
            return response.json();
          })
          .then(function () {
            alert('Booking notes saved');
          })
          .catch(function () {
            alert('Could not save booking notes');
          });
      });
    });
  }

  fetch('/api/crm/bookings', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed to load bookings');
      return response.json();
    })
    .then(function (data) {
      const bookings = data.bookings || [];
      if (!bookings.length) {
        list.innerHTML = '<p class="text-light-1 text-sm">No bookings found.</p>';
        return;
      }

      list.innerHTML = bookings.map(bookingItemTemplate).join('');
      attachActions();
    })
    .catch(function () {
      list.innerHTML = '<p class="text-red-600 text-sm">Could not load bookings.</p>';
    });
})();

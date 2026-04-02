(function () {
  const token = localStorage.getItem('waytrip_token');
  if (!token) return;

  fetch('/api/crm/bookings', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Cannot load CRM stats');
      return response.json();
    })
    .then(function (data) {
      const bookings = data.bookings || [];
      const upcoming = bookings.filter(function (item) { return item.status === 'upcoming'; }).length;
      const completed = bookings.filter(function (item) { return item.status === 'completed'; }).length;

      document.getElementById('crm-total-bookings').textContent = String(bookings.length);
      document.getElementById('crm-upcoming').textContent = String(upcoming);
      document.getElementById('crm-completed').textContent = String(completed);
    })
    .catch(function () {
      document.getElementById('crm-total-bookings').textContent = '-';
      document.getElementById('crm-upcoming').textContent = '-';
      document.getElementById('crm-completed').textContent = '-';
    });
})();

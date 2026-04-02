(function () {
  const token = localStorage.getItem('waytrip_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  const select = document.getElementById('experience-booking-select');
  const timeline = document.getElementById('experience-timeline');
  const activities = document.getElementById('experience-activities');
  const tasks = document.getElementById('experience-tasks');
  const gallery = document.getElementById('experience-gallery');
  const badges = document.getElementById('experience-badges');
  const saveBtn = document.getElementById('experience-save-btn');

  function toLines(value) {
    return (value || []).join('\n');
  }

  function fetchExperience(bookingId) {
    fetch('/api/experiences/booking/' + bookingId, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(function (response) {
        if (!response.ok) throw new Error('No experience yet');
        return response.json();
      })
      .then(function (data) {
        const exp = data.experience || {};
        timeline.value = exp.timeline || '';
        activities.value = toLines(exp.daily_activities || []);
        tasks.value = toLines(exp.travel_tasks || []);
        gallery.value = toLines(exp.memory_gallery || []);
        badges.value = (exp.achievement_badges || []).join(', ');
      })
      .catch(function () {
        timeline.value = '';
        activities.value = '';
        tasks.value = '';
        gallery.value = '';
        badges.value = '';
      });
  }

  function loadBookings() {
    fetch('/api/bookings/me', {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed bookings');
        return response.json();
      })
      .then(function (data) {
        const bookings = data.bookings || [];
        if (!bookings.length) {
          select.innerHTML = '<option value="">No bookings yet</option>';
          return;
        }

        select.innerHTML = bookings
          .map(function (item) {
            return `<option value="${item.id}">#${item.id} - ${item.package_title || 'Package'} (${item.status})</option>`;
          })
          .join('');

        fetchExperience(select.value);
      })
      .catch(function () {
        select.innerHTML = '<option value="">Could not load bookings</option>';
      });
  }

  select.addEventListener('change', function () {
    if (select.value) fetchExperience(select.value);
  });

  saveBtn.addEventListener('click', function () {
    if (!select.value) {
      alert('Please select booking');
      return;
    }

    fetch('/api/experiences/booking/' + select.value, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        timeline: timeline.value,
        dailyActivities: activities.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean),
        travelTasks: tasks.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean),
        memoryGallery: gallery.value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean),
        achievementBadges: badges.value.split(',').map(function (x) { return x.trim(); }).filter(Boolean),
      }),
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Save failed');
        return response.json();
      })
      .then(function () {
        alert('Experience saved successfully');
      })
      .catch(function () {
        alert('Could not save experience');
      });
  });

  loadBookings();
})();

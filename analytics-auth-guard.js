(function () {
  const token = localStorage.getItem('waytrip_token');
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  fetch('/api/auth/me', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Unauthorized');
      return response.json();
    })
    .then(function (data) {
      const user = data.user;
      if (!user || !['admin', 'super_admin', 'CRM_MANAGER'].includes(user.role)) {
        alert('Analytics dashboard is not allowed for this role');
        window.location.href = 'dashboard.html';
      }
    })
    .catch(function () {
      window.location.href = 'login.html';
    });
})();

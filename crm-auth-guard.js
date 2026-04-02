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
      localStorage.setItem('waytrip_user', JSON.stringify(user));

      if (!user || !['CRM_MANAGER', 'super_admin'].includes(user.role)) {
        alert('CRM access is allowed only for CRM_MANAGER role.');
        window.location.href = 'dashboard.html';
        return;
      }

      document.querySelectorAll('[data-crm-user-name]').forEach(function (node) {
        node.textContent = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'CRM User';
      });
      document.querySelectorAll('[data-crm-user-email]').forEach(function (node) {
        node.textContent = user.email || '';
      });
    })
    .catch(function () {
      localStorage.removeItem('waytrip_token');
      localStorage.removeItem('waytrip_user');
      window.location.href = 'login.html';
    });
})();

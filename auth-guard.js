(function () {
  const token = localStorage.getItem('waytrip_token');
  const storedUserRaw = localStorage.getItem('waytrip_user');

  function redirectToLogin() {
    window.location.href = 'login.html';
  }

  function setUserUI(user) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || 'User';
    const email = user.email || '';

    document.querySelectorAll('[data-auth-user-name]').forEach(function (node) {
      node.textContent = fullName;
    });

    document.querySelectorAll('[data-auth-user-email]').forEach(function (node) {
      node.textContent = email;
    });
  }

  function setUserFromStorage() {
    if (!storedUserRaw) return;

    try {
      const parsedUser = JSON.parse(storedUserRaw);
      if (parsedUser && typeof parsedUser === 'object') {
        setUserUI(parsedUser);
      }
    } catch (error) {
      localStorage.removeItem('waytrip_user');
    }
  }

  if (!token) {
    redirectToLogin();
    return;
  }

  setUserFromStorage();

  fetch('/api/auth/me', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Unauthorized');
      }
      return response.json();
    })
    .then(function (data) {
      if (!data.user) {
        throw new Error('Invalid user payload');
      }

      localStorage.setItem('waytrip_user', JSON.stringify(data.user));
      setUserUI(data.user);
    })
    .catch(function () {
      localStorage.removeItem('waytrip_token');
      localStorage.removeItem('waytrip_user');
      redirectToLogin();
    });
})();

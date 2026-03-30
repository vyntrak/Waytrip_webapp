(function () {
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const messageEl = document.getElementById('login-message');
  const submitBtn = document.getElementById('login-submit-btn');

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = type === 'error' ? 'mt-4 text-sm text-red-600' : 'mt-4 text-sm text-green-600';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showMessage('Please enter email and password.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      showMessage('Signing in...', 'success');

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || 'Login failed. Please check your credentials.', 'error');
        return;
      }

      localStorage.setItem('waytrip_token', data.token);
      localStorage.setItem('waytrip_user', JSON.stringify(data.user));

      showMessage('Login successful! Redirecting to dashboard...', 'success');
      window.setTimeout(function () {
        window.location.href = 'db-dashboard.html';
      }, 800);
    } catch (error) {
      showMessage('Cannot connect to server. Make sure backend is running.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

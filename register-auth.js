(function () {
  const form = document.getElementById('register-form');
  if (!form) return;

  const firstNameInput = document.getElementById('register-first-name');
  const lastNameInput = document.getElementById('register-last-name');
  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const confirmPasswordInput = document.getElementById('register-confirm-password');
  const submitBtn = document.getElementById('register-submit-btn');
  const messageEl = document.getElementById('register-message');

  function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = type === 'error' ? 'mt-4 text-sm text-red-600' : 'mt-4 text-sm text-green-600';
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showMessage('Please fill all required fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      showMessage('Password must be at least 6 characters.', 'error');
      return;
    }

    try {
      submitBtn.disabled = true;
      showMessage('Creating your account...', 'success');

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || 'Registration failed. Please try again.', 'error');
        return;
      }

      showMessage('Registration successful! Redirecting to login...', 'success');
      window.setTimeout(function () {
        window.location.href = 'login.html';
      }, 900);
    } catch (error) {
      showMessage('Cannot connect to server. Make sure backend is running.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();

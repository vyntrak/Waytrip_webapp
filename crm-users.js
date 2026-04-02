(function () {
  const token = localStorage.getItem('waytrip_token');
  const usersList = document.getElementById('crm-users-list');
  const historyPanel = document.getElementById('crm-user-history');
  const searchInput = document.getElementById('crm-user-search');
  const searchBtn = document.getElementById('crm-user-search-btn');

  if (!token || !usersList) return;

  function renderUsers(users) {
    if (!users.length) {
      usersList.innerHTML = '<p class="text-light-1 text-sm">No users found.</p>';
      return;
    }

    usersList.innerHTML = users
      .map(function (user) {
        return `
          <div class="border-border rounded border p-4" data-user-id="${user.id}">
            <div class="mb-2 flex items-center justify-between">
              <h3 class="text-dark-1 font-semibold">${user.first_name} ${user.last_name}</h3>
              <span class="text-xs uppercase">${user.role}</span>
            </div>
            <p class="text-sm">${user.email}</p>
            <div class="mt-3 grid gap-2 sm:grid-cols-2">
              <input class="crm-phone border-border h-10 rounded border px-3 text-sm" value="${user.phone || ''}" placeholder="Phone" />
              <button class="crm-history-btn bg-blue-1 rounded px-3 py-2 text-sm text-white">View History</button>
            </div>
            <textarea class="crm-contact-notes border-border mt-2 w-full rounded border p-3 text-sm" rows="2" placeholder="Contact notes">${user.contact_notes || ''}</textarea>
            <button class="crm-save-contact bg-dark-1 mt-2 rounded px-3 py-2 text-sm text-white">Save Contact</button>
          </div>
        `;
      })
      .join('');

    attachUserActions();
  }

  function attachUserActions() {
    usersList.querySelectorAll('[data-user-id]').forEach(function (card) {
      const userId = card.dataset.userId;
      const phoneInput = card.querySelector('.crm-phone');
      const notesInput = card.querySelector('.crm-contact-notes');
      const saveContactBtn = card.querySelector('.crm-save-contact');
      const historyBtn = card.querySelector('.crm-history-btn');

      saveContactBtn.addEventListener('click', function () {
        fetch('/api/crm/users/' + userId + '/contact', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            phone: phoneInput.value,
            contactNotes: notesInput.value,
          }),
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Failed contact update');
            return response.json();
          })
          .then(function () {
            alert('User contact record updated');
          })
          .catch(function () {
            alert('Could not update contact record');
          });
      });

      historyBtn.addEventListener('click', function () {
        fetch('/api/crm/users/' + userId + '/history', {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Failed history load');
            return response.json();
          })
          .then(function (data) {
            const history = data.history || [];
            if (!history.length) {
              historyPanel.textContent = 'No travel history found for this user.';
              return;
            }

            historyPanel.innerHTML = history
              .map(function (item) {
                return `<div class="mb-2 text-sm">#${item.id} • ${item.package_title || 'Package booking'} • ${item.status}</div>`;
              })
              .join('');
          })
          .catch(function () {
            historyPanel.textContent = 'Could not load user travel history.';
          });
      });
    });
  }

  function loadUsers(searchText) {
    const query = searchText ? '?search=' + encodeURIComponent(searchText) : '';

    fetch('/api/crm/users' + query, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load users');
        return response.json();
      })
      .then(function (data) {
        renderUsers(data.users || []);
      })
      .catch(function () {
        usersList.innerHTML = '<p class="text-red-600 text-sm">Could not load users.</p>';
      });
  }

  searchBtn.addEventListener('click', function () {
    loadUsers(searchInput.value.trim());
  });

  loadUsers('');
})();

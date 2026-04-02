(function () {
  const token = localStorage.getItem('waytrip_token');
  const list = document.getElementById('user-notifications-list');
  if (!token || !list) return;

  function rowTemplate(item) {
    const readClass = item.is_read ? 'opacity-60' : '';
    const readButton = item.is_read
      ? '<span class="text-xs text-green-600">Read</span>'
      : `<button class="mark-read text-xs text-blue-1 underline" data-id="${item.id}">Mark as read</button>`;

    return `
      <div class="hover:bg-light-2 cursor-pointer border-b border-gray-50 p-4 ${readClass}">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <p class="text-dark-1 text-sm font-medium">${item.title}</p>
            <p class="text-light-1 mt-1 text-xs">${item.message}</p>
            <p class="text-light-1 mt-1 text-xs">${new Date(item.created_at).toLocaleString()}</p>
          </div>
          ${readButton}
        </div>
      </div>
    `;
  }

  function bindMarkRead() {
    list.querySelectorAll('.mark-read').forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        fetch('/api/notifications/' + button.dataset.id + '/read', {
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer ' + token,
          },
        })
          .then(function (response) {
            if (!response.ok) throw new Error('Failed');
            return response.json();
          })
          .then(function () {
            loadNotifications();
          })
          .catch(function () {
            alert('Could not mark notification as read');
          });
      });
    });
  }

  function loadNotifications() {
    fetch('/api/notifications/my', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Failed');
        return response.json();
      })
      .then(function (data) {
        const notifications = data.notifications || [];
        if (!notifications.length) {
          list.innerHTML = '<p class="text-light-1 p-4 text-xs">No notifications yet.</p>';
          return;
        }

        list.innerHTML = notifications.map(rowTemplate).join('');
        bindMarkRead();
      })
      .catch(function () {
        list.innerHTML = '<p class="p-4 text-xs text-red-500">Could not load notifications.</p>';
      });
  }

  loadNotifications();
})();

(function () {
  const token = localStorage.getItem('waytrip_token');
  if (!token) return;

  function buildBarChart(canvasId, label, labels, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: '#3554d1',
          borderRadius: 4,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  fetch('/api/analytics/overview', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then(function (response) {
      if (!response.ok) throw new Error('Failed analytics load');
      return response.json();
    })
    .then(function (data) {
      document.getElementById('analytics-total-users').textContent = String(data.totalUsers || 0);

      buildBarChart(
        'bookingsPerMonthChart',
        'Bookings Per Month',
        (data.bookingsPerMonth || []).map(function (x) { return x.month; }),
        (data.bookingsPerMonth || []).map(function (x) { return x.total; }),
      );

      buildBarChart(
        'revenueGrowthChart',
        'Revenue Growth',
        (data.revenueGrowth || []).map(function (x) { return x.month; }),
        (data.revenueGrowth || []).map(function (x) { return Number(x.revenue); }),
      );

      buildBarChart(
        'popularDestinationsChart',
        'Popular Destinations',
        (data.popularDestinations || []).map(function (x) { return x.destination; }),
        (data.popularDestinations || []).map(function (x) { return x.total; }),
      );

      buildBarChart(
        'packagePerformanceChart',
        'Package Performance (Bookings)',
        (data.packagePerformance || []).map(function (x) { return x.title; }),
        (data.packagePerformance || []).map(function (x) { return x.bookings; }),
      );
    })
    .catch(function () {
      alert('Could not load analytics data');
    });
})();

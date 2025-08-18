document.addEventListener('DOMContentLoaded', () => {
    // --- CHART LOGIC ---
    const ctx = document.getElementById('downtimeChart');
    if (!ctx) return; // Fail gracefully if chart element isn't found

    const chartContext = ctx.getContext('2d');
    let downtimeChart;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
        }).format(value);
    };

    const createOrUpdateChart = (hourlyRevenue) => {
        const labels = ['1 Hour', '4 Hours', '8 Hours (1 Shift)', '24 Hours (1 Day)'];
        const data = [
            hourlyRevenue,
            hourlyRevenue * 4,
            hourlyRevenue * 8,
            hourlyRevenue * 24
        ];

        if (downtimeChart) {
            downtimeChart.data.datasets[0].data = data;
            downtimeChart.update();
        } else {
            downtimeChart = new Chart(chartContext, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Cost of Downtime',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(239, 68, 68, 0.6)',
                            'rgba(185, 28, 28, 0.6)'
                        ],
                        borderColor: [
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(239, 68, 68, 1)',
                            'rgba(185, 28, 28, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: (value) => formatCurrency(value),
                                color: '#6b7280'
                            },
                            grid: { color: 'rgba(200, 200, 200, 0.1)' }
                        },
                        x: {
                            ticks: { color: '#6b7280' },
                            grid: { display: false }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            });
        }
    };

    const revenueInput = document.getElementById('hourlyRevenue');
    if (revenueInput) {
        // Initial chart creation
        const initialRevenue = parseInt(revenueInput.value, 10) || 0;
        createOrUpdateChart(initialRevenue);

        // Update chart on input
        revenueInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 0) {
                createOrUpdateChart(value);
            }
        });
    }

    // --- SMOOTH SCROLLING LOGIC ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
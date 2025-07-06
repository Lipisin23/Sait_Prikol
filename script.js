const ctx = document.getElementById('data-chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Температура (°C)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1
            },
            {
                label: 'Влажность (%)',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.1
            },
            {
                label: 'Давление (hPa)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1,
                yAxisID: 'y1'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Температура/Влажность'
                }
            },
            y1: {
                position: 'right',
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Давление'
                },
                grid: {
                    drawOnChartArea: false
                }
            }
        }
    }
});

// Ссылка на данные в Firebase
const dataRef = database.ref('sensorData');

// Обработчик изменений данных
dataRef.limitToLast(20).on('value', (snapshot) => {
    const dataHistory = [];
    snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        dataHistory.push({
            timestamp: data.timestamp || childSnapshot.key,
            temperature: parseFloat(data.temperature),
            humidity: parseFloat(data.humidity),
            pressure: parseFloat(data.pressure)
        });
    });
    
    // Сортируем по времени (от новых к старым)
    dataHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (dataHistory.length > 0) {
        updateDashboard(dataHistory[0]);
        updateChart(dataHistory);
        updateTable(dataHistory);
    }
});

function updateDashboard(latestData) {
    document.getElementById('temperature').textContent = latestData.temperature.toFixed(1);
    document.getElementById('humidity').textContent = latestData.humidity.toFixed(1);
    document.getElementById('pressure').textContent = latestData.pressure.toFixed(0);
    document.getElementById('last-update').textContent = new Date(latestData.timestamp).toLocaleString();
}

function updateChart(dataHistory) {
    const labels = dataHistory.map(item => new Date(item.timestamp).toLocaleTimeString()).reverse();
    const tempData = dataHistory.map(item => item.temperature).reverse();
    const humData = dataHistory.map(item => item.humidity).reverse();
    const pressData = dataHistory.map(item => item.pressure).reverse();
    
    chart.data.labels = labels;
    chart.data.datasets[0].data = tempData;
    chart.data.datasets[1].data = humData;
    chart.data.datasets[2].data = pressData;
    chart.update();
}

function updateTable(dataHistory) {
    const tableBody = document.querySelector('#data-history tbody');
    tableBody.innerHTML = '';
    
    dataHistory.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(item.timestamp).toLocaleString()}</td>
            <td>${item.temperature.toFixed(1)} °C</td>
            <td>${item.humidity.toFixed(1)} %</td>
            <td>${item.pressure.toFixed(0)} hPa</td>
        `;
        tableBody.appendChild(row);
    });
}

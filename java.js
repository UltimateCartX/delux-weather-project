document.addEventListener('DOMContentLoaded', function () {
    const tempCanvas = document.getElementById('tempChart').getContext('2d');
    const humidityCanvas = document.getElementById('humidityChart').getContext('2d');
    const airQualityCanvas = document.getElementById('airQualityChart').getContext('2d');

    function loadCSVData(file) {
        fetch(file)
            .then(response => response.text())
            .then(data => {
                const parsedData = parseCSV(data);
                displayCharts(parsedData);
            })
            .catch(error => console.error('Erreur lors du chargement du fichier:', error));
    }

    function parseCSV(data) {
        const lines = data.split('\n');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const row = lines[i].split(',');
            if (row.length == 4) {
                result.push({
                    time: row[0],
                    temp: parseFloat(row[1]),
                    humidity: parseFloat(row[2]),
                    air_quality: parseFloat(row[3])
                });
            }
        }
        return result;
    }

    function displayCharts(data) {
        const labels = data.map(row => row.time);
        const tempData = data.map(row => row.temp);
        const humidityData = data.map(row => row.humidity);
        const airQualityData = data.map(row => row.air_quality);

        new Chart(tempCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Température (°C)',
                    data: tempData,
                    borderColor: 'red',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Temps'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Température (°C)'
                        }
                    }
                }
            }
        });
        
        new Chart(humidityCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Humidité (%)',
                    data: humidityData,
                    borderColor: 'blue',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Temps'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Humidité (%)'
                        }
                    }
                }
            }
        });

        new Chart(airQualityCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Qualité de l\'air (ppm)',
                    data: airQualityData,
                    borderColor: 'green',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Temps'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Qualité de l\'air (ppm)'
                        }
                    }
                }
            }
        });
    }

    loadCSVData('data.txt');
});

document.addEventListener('DOMContentLoaded', function () {
    // Sélectionner les éléments canvas pour chaque graphique
    const tempCanvas = document.getElementById('tempChart').getContext('2d');
    const humidityCanvas = document.getElementById('humidityChart').getContext('2d');
    const airQualityCanvas = document.getElementById('airQualityChart').getContext('2d');

    // Fonction pour charger le fichier TXT (formaté comme CSV)
    function loadCSVData(file) {
        fetch(file)
            .then(response => response.text())  // Lecture du fichier texte
            .then(data => {
                const parsedData = parseCSV(data);  // Parser le texte en données
                displayCharts(parsedData);  // Afficher les trois graphiques
            })
            .catch(error => console.error('Erreur lors du chargement du fichier:', error));
    }

    // Fonction pour parser le contenu du fichier TXT
    function parseCSV(data) {
        const lines = data.split('\n');  // Diviser chaque ligne
        const result = [];

        for (let i = 1; i < lines.length; i++) {  // Ignorer la première ligne (entêtes)
            const row = lines[i].split(',');  // Diviser par virgule
            if (row.length === 4) {
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

    // Fonction pour afficher les trois graphiques
    function displayCharts(data) {
        const labels = data.map(row => row.time);  // Extraire les heures (temps)
        const tempData = data.map(row => row.temp);  // Température
        const humidityData = data.map(row => row.humidity);  // Humidité
        const airQualityData = data.map(row => row.air_quality);  // Qualité de l'air

        // Graphique de la température
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
                maintainAspectRatio: false, // Permet de changer la hauteur
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

        // Graphique de l'humidité
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
                maintainAspectRatio: false, // Permet de changer la hauteur
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

        // Graphique de la qualité de l'air
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
                maintainAspectRatio: false, // Permet de changer la hauteur
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

    // Charger les données à partir du fichier texte
    loadCSVData('data.txt');
});

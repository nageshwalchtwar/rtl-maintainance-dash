
        fetch('https://raw.githubusercontent.com/nageshwalchtwar/selenium_automated_cron/main/data.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('vr').textContent = data.value;
          
                if(data.value == "Working"){
                        
                document.getElementById('vr').style.color = "green";
                }
                else{
                document.getElementById('vr').style.color = "red";
                }
                const timestampVR = new Date().toLocaleString(); // Get the current date and time
                document.getElementById("timestampVR").textContent=timestampVR;
            })
            .catch(error => {
                document.getElementById('vr').textContent = 'Error';
                document.getElementById('vr').style.color = "red";
                    
            });

        // Example: Fetch status for Website 2
        fetch('https://raw.githubusercontent.com/nageshwalchtwar/selenium_cron_coe/main/data.json')
            .then(response => response.json())
            .then(data1 => {
                document.getElementById('coe').textContent = data1.value;
                if(data1.value == "Working"){
                        
                        document.getElementById('coe').style.color = "green";
                }
                else{
                document.getElementById('coe').style.color = "red";
                }
                // document.getElementById('coe').style.color = "green";
                const timestampCOE = new Date().toLocaleString(); 
                document.getElementById("timestampCOE").textContent=timestampCOE;
            })
            .catch(error => {
                document.getElementById('coe').textContent = 'Error';
                document.getElementById('coe').style.color = "red";
            });
        function checkBlynkStatus(authToken, statusElement) {
                fetch(`https://blynk.cloud/external/api/isHardwareConnected?token=${authToken}`)
                    .then(response => response.json())
                    .then(data => {
                        const isOnline = data === true; // Blynk responds with 1 for online, 0 for offline
                        statusElement.textContent = isOnline ? 'Online' : 'Offline';
                        statusElement.style.color = isOnline ? 'green' : 'red';
                    })
                    .catch(error => {
                        statusElement.textContent = 'Error';
                        statusElement.style.color = 'red';
                    });
            }

function createOrUpdateGraph(data, graphElement, experimentName) {
    // Create or update the graph using Plotly
    const trace = {
        x: data.x, // X-axis data (timestamps)
        y: data.y, // Y-axis data (online/offline values)
        type: 'scatter',
        mode: 'lines+markers',
        name: experimentName,
    };

    const layout = {
        title: `${experimentName} Online/Offline Status`,
        xaxis: { title: 'Timestamp' },
        yaxis: { title: 'Status' },
    };

    const graphData = [trace];

    Plotly.newPlot(graphElement, graphData, layout);

    // Set a threshold for offline status (e.g., 'Offline')
    const offlineThreshold = 'Offline';

    // Check if the latest status is offline and display it as a horizontal line
    if (data.y[data.y.length - 1] === offlineThreshold) {
        Plotly.addTraces(graphElement, {
            x: data.x,
            y: [offlineThreshold], // Create a horizontal line
            type: 'scatter',
            mode: 'lines',
            name: 'Offline',
            line: { color: 'red' },
        });
    }
}
        // Function to fetch and update status for an experiment
        function fetchAndUpdateStatus(authToken, statusElement, graphElement, experimentName) {
            fetch(`https://blynk.cloud/external/api/isHardwareConnected?token=${authToken}`)
                .then(response => response.json())
                .then(data => {
                    const isOnline = data === true; // Blynk responds with 1 for online, 0 for offline
                    statusElement.textContent = isOnline ? 'Online' : 'Offline';
                    statusElement.style.color = isOnline ? 'green' : 'red';

                    // Create or update the graph
                    createOrUpdateGraph(
                        { x: [new Date()], y: [isOnline ? 'Online' : 'Offline'] },
                        graphElement,
                        experimentName
                    );
                })
                .catch(error => {
                    statusElement.textContent = 'Error';
                    statusElement.style.color = 'red';
                });
        }

        function showGraphPopup() {
            // Fetch and update status for Vanishing Rod Experiment
            fetchAndUpdateStatus(
                'ih9WueVjBqXegKg2efGtVqUVdFRQdhJa',
                document.getElementById('VR'),
                document.getElementById('plot-VR'),
                'Blynk VR'
            );

            // Fetch and update status for Conservation of Mechanical Energy
            fetchAndUpdateStatus(
                'vTZNEt9WyE--pOBu6LmH_QMAkoEcC4hd',
                document.getElementById('COE'),
                document.getElementById('plot-COE'),
                'Blynk COE'
            );

            // You can add more experiments here

            // Show the graph container
            const graphContainer = document.getElementById('graphContainer');
            graphContainer.style.display = 'block';
        }

        setInterval(function() {
            // Update status for Vanishing Rod Experiment
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_automated_cron/main/data.json', 
                                 document.getElementById('vr'), 
                                 document.getElementById('timestampVR'));
            
            // Update status for Conservation of Mechanical Energy
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_cron_coe/main/data.json', 
                                 document.getElementById('coe'), 
                                 document.getElementById('timestampCOE'));
        fetchAndUpdateStatus(
            'ih9WueVjBqXegKg2efGtVqUVdFRQdhJa',
            document.getElementById('VR'),
            document.getElementById('plot-VR'),
            'Blynk VR'
        );

        fetchAndUpdateStatus(
            'vTZNEt9WyE--pOBu6LmH_QMAkoEcC4hd',
            document.getElementById('COE'),
            document.getElementById('plot-COE'),
            'Blynk COE'
        );

            // checkBlynkStatus('your_auth_token_3', document.getElementById('statusExp3'));
            
            // You can add more websites and status elements here
        }, 5000);


        fetch('https://raw.githubusercontent.com/nageshwalchtwar/selenium_automated_cron/main/data.json')
            .then(response => response.json())
            .then(data => {
                document.getElementById('vr').textContent = data.value;
                const timestampVR = new Date().toLocaleString(); // Get the current date and time
                document.getElementById("timestampVR").textContent=timestampVR;
            })
            .catch(error => {
                document.getElementById('vr').textContent = 'Error';
            });

        // Example: Fetch status for Website 2
        fetch('https://raw.githubusercontent.com/nageshwalchtwar/selenium_cron_coe/main/data.json')
            .then(response => response.json())
            .then(data1 => {
                document.getElementById('coe').textContent = data1.value;
                const timestampCOE = new Date().toLocaleString(); 
                document.getElementById("timestampCOE").textContent=timestampCOE;
            })
            .catch(error => {
                document.getElementById('coe').textContent = 'Error';
            });
        function checkBlynkStatus(authToken, statusElement) {
            fetch(`https://blynk-cloud.com/${authToken}/isAppConnected`)
                .then(response => response.json())
                .then(data => {
                    const isOnline = data === 1;
                    statusElement.textContent = isOnline ? 'Online' : 'Offline';
                    statusElement.classList.toggle('offline', !isOnline);
                })
                .catch(error => {
                    statusElement.textContent = 'Error';
                    statusElement.classList.add('offline');
                });
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
            checkBlynkStatus('ih9WueVjBqXegKg2efGtVqUVdFRQdhJa', document.getElementById('COE'));
            checkBlynkStatus('vTZNEt9WyE--pOBu6LmH_QMAkoEcC4hd', document.getElementById('VR'));
            // checkBlynkStatus('your_auth_token_3', document.getElementById('statusExp3'));
            
            // You can add more websites and status elements here
        }, 5000);

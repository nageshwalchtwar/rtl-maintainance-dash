
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
        setInterval(function() {
            // Update status for Vanishing Rod Experiment
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_automated_cron/main/data.json', 
                                 document.getElementById('vr'), 
                                 document.getElementById('timestampVR'));
            
            // Update status for Conservation of Mechanical Energy
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_cron_coe/main/data.json', 
                                 document.getElementById('coe'), 
                                 document.getElementById('timestampCOE'));

            // checkBlynkStatus('your_auth_token_3', document.getElementById('statusExp3'));
            
            // You can add more websites and status elements here
        }, 5000);


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
        setInterval(function() {
            // Update status for Vanishing Rod Experiment
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_automated_cron/main/data.json', 
                                 document.getElementById('vr'), 
                                 document.getElementById('timestampVR'));
            
            // Update status for Conservation of Mechanical Energy
            fetchAndUpdateStatus('https://raw.githubusercontent.com/nageshwalchtwar/selenium_cron_coe/main/data.json', 
                                 document.getElementById('coe'), 
                                 document.getElementById('timestampCOE'));
            
            // You can add more websites and status elements here
        }, 5000);

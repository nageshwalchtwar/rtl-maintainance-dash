import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import base64
from io import BytesIO, StringIO
import requests

def get_csv_from_onedrive(shared_link):
    # Convert the sharing link to a direct download link
    if "sharepoint.com" in shared_link:
        download_link = shared_link.split('?')[0] + '?download=1'
    else:
        download_link = 'https://api.onedrive.com/v1.0/shares/u!' + shared_link.split('/')[-1] + '/root/content'
    
    # Fetch the CSV content
    response = requests.get(download_link)
    response.raise_for_status()  # Raise an exception for bad responses
    
    # Return the content as a StringIO object
    return StringIO(response.text)

def generate_experiment_status_plot(onedrive_link, output_html_path):
    # Fetch CSV from OneDrive
    csv_content = get_csv_from_onedrive(onedrive_link)
    
    # Read the CSV file
    df = pd.read_csv(csv_content, parse_dates=['Date'])

    # Sort the dataframe by date
    df = df.sort_values('Date')

    # Create a status column that combines CoE, FL, and VR status
    df['Status'] = df.apply(lambda row: 'Offline' if 'Offline' in [row['CoE Status'], row['FL Status'], row['VR Status']]
                            else ('Hardware Issue' if 'Hardware issue' in [row['CoE Status'], row['FL Status'], row['VR Status']]
                            else 'Working'), axis=1)

    # Create a daily status summary
    daily_status = df.groupby('Date')['Status'].value_counts().unstack(fill_value=0)

    # Calculate the total offline time
    offline_days = daily_status[daily_status['Offline'] > 0].shape[0]
    hardware_issue_days = daily_status[daily_status['Hardware Issue'] > 0].shape[0]
    total_offline_days = offline_days + hardware_issue_days

    # Set up the plot style
    sns.set(style="whitegrid")
    plt.figure(figsize=(15, 10))

    # Create the stacked area chart
    ax = daily_status.plot(kind='area', stacked=True, alpha=0.7)

    # Customize the plot
    plt.title('Experiment Status Over Time', fontsize=20)
    plt.xlabel('Date', fontsize=14)
    plt.ylabel('Number of Instances', fontsize=14)
    plt.legend(title='Status', title_fontsize='13', fontsize='12', loc='center left', bbox_to_anchor=(1, 0.5))
    
    # Rotate x-axis labels for better readability
    plt.xticks(rotation=45, ha='right')

    # Add grid lines
    plt.grid(True, linestyle='--', alpha=0.7)

    # Annotate total offline time
    plt.text(0.02, 0.95, f'Total Offline Days: {total_offline_days}', transform=ax.transAxes, 
             fontsize=12, verticalalignment='top', bbox=dict(boxstyle='round,pad=0.5', fc='yellow', alpha=0.5))

    # Adjust layout
    plt.tight_layout()

    # Save plot to a BytesIO object
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plot_url = base64.b64encode(img.getvalue()).decode()

    # Generate HTML content
    html_content = f"""
    <html>
    <head>
        <title>Experiment Status Plot</title>
    </head>
    <body>
        <h1>Experiment Status Plot</h1>
        <img src="data:image/png;base64,{plot_url}" alt="Experiment Status Plot">
        <h2>Summary</h2>
        <p>Date Range: {df['Date'].min().date()} to {df['Date'].max().date()}</p>
        <p>Total Offline Days: {total_offline_days}</p>
        <ul>
            <li>Offline: {offline_days}</li>
            <li>Hardware Issues: {hardware_issue_days}</li>
        </ul>
    </body>
    </html>
    """

    # Write HTML content to file
    with open(output_html_path, 'w') as f:
        f.write(html_content)

    print(f"HTML file generated: {output_html_path}")

# Usage
onedrive_link = 'https://iiitaphyd-my.sharepoint.com/:x:/g/personal/nagesh_walchatwar_research_iiit_ac_in/EW_It61sJv1BsvrE4tyEDQgBaT_TMS0wOAmWS03D6g-o3A?e=B450nl'
output_html_path = 'experiment_plots.html'
generate_experiment_status_plot(onedrive_link, output_html_path)
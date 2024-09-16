import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import base64
from io import BytesIO, StringIO
import requests
import os

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
    df = pd.read_csv(csv_content)

    # Print column names and first few rows for debugging
    print("Column names:", df.columns.tolist())
    print("\nFirst few rows of the dataframe:")
    print(df.head())

    # Check if 'Date' column exists, if not, try to identify a suitable date column
    date_column = 'Date' if 'Date' in df.columns else df.filter(like='date').columns[0] if len(df.filter(like='date').columns) > 0 else None

    if date_column is None:
        raise ValueError("Could not find a suitable date column in the CSV file.")

    # Parse the date column
    df[date_column] = pd.to_datetime(df[date_column])

    # Sort the dataframe by date
    df = df.sort_values(date_column)

    # Identify status columns
    status_columns = [col for col in df.columns if 'status' in col.lower()]

    if len(status_columns) == 0:
        raise ValueError("Could not find any status columns in the CSV file.")

    # Create a status column that combines all status columns
    df['Status'] = df.apply(lambda row: 'Offline' if 'Offline' in row[status_columns].values
                            else ('Hardware Issue' if 'Hardware issue' in row[status_columns].values
                            else 'Working'), axis=1)

    # Create a daily status summary
    daily_status = df.groupby(date_column)['Status'].value_counts().unstack(fill_value=0)

    # Calculate the total offline time
    offline_days = daily_status[daily_status['Offline'] > 0].shape[0] if 'Offline' in daily_status.columns else 0
    hardware_issue_days = daily_status[daily_status['Hardware Issue'] > 0].shape[0] if 'Hardware Issue' in daily_status.columns else 0
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
        <p>Date Range: {df[date_column].min().date()} to {df[date_column].max().date()}</p>
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
onedrive_link = os.environ.get('ONEDRIVE_LINK')
output_html_path = 'experiment_plots.html'

try:
    generate_experiment_status_plot(onedrive_link, output_html_path)
except Exception as e:
    print(f"An error occurred: {str(e)}")
    # You might want to create a simple HTML file with the error message
    with open(output_html_path, 'w') as f:
        f.write(f"<html><body><h1>Error</h1><p>{str(e)}</p></body></html>")

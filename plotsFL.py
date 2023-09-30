import pandas as pd
import matplotlib.pyplot as plt
import plotly.express as px

# Read the CSV file into a pandas DataFrame
data = pd.read_csv('daily_log_sorted.csv')

# Convert the 'Date' column to datetime format
data['Date'] = pd.to_datetime(data['Date'])

# Create a new DataFrame with all dates
all_dates = pd.DataFrame({'Date': pd.date_range(start=data['Date'].min(), end=data['Date'].max(), freq='D')})

# Merge the original data with all_dates to fill in missing data
merged_data = pd.merge(all_dates, data, how='left', on='Date')

# Fill NaN values with default status
merged_data.fillna({'CoE Status': 'Not Available', 'FL Status': 'Not Available', 'VR Status': 'Not Available'}, inplace=True)

# Create a figure and axis using Plotly Express
fig = px.line(merged_data, x='Date', y='VR Status', labels={'Date': 'Date', 'VR Status': 'VR Status'})
fig.update_traces(mode='lines+markers', line=dict(shape='linear'))
fig.update_layout(title='Status Over Time', xaxis_title='Date', yaxis_title='Status')

# Add hover text
fig.update_traces(text=merged_data['Comments'])
fig.update_traces(hovertemplate='%{y}<br>Comments: %{text}<br> Date: %{x}')

# Rotate x-axis labels for better readability
fig.update_xaxes(tickangle=45)

# Show the interactive plot
# fig.show()
fig.write_html("plotFL.html")